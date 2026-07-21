// DGV Chile — Supabase Client
// Conexión real a la base de datos

const SUPABASE_URL  = 'https://uarjbusgkhtdwusgtjpt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcmpidXNna2h0ZHd1c2d0anB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODkyNzUsImV4cCI6MjEwMDA2NTI3NX0.9ClXh6R6eFnjkEUT-uMrtfCxPeDeX-h9lEd6ztehPvs';

// ── Cliente HTTP minimalista (sin SDK, funciona en HTML estático) ──
const db = {
  // GET con filtros opcionales
  async from(table) {
    return {
      _table: table,
      _filters: [],
      _order: null,
      _limit: null,
      _select: '*',

      select(cols = '*') { this._select = cols; return this; },

      eq(col, val)    { this._filters.push(`${col}=eq.${val}`);    return this; },
      neq(col, val)   { this._filters.push(`${col}=neq.${val}`);   return this; },
      order(col, { ascending = true } = {}) {
        this._order = `${col}=${ascending ? 'asc' : 'desc'}`;
        return this;
      },
      limit(n)        { this._limit = n; return this; },

      async execute() {
        let url = `${SUPABASE_URL}/rest/v1/${this._table}?select=${this._select}`;
        if (this._filters.length) url += '&' + this._filters.join('&');
        if (this._order)  url += `&order=${this._order}`;
        if (this._limit)  url += `&limit=${this._limit}`;

        const res = await fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return res.json();
      }
    };
  },

  // INSERT
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Insert error: ${res.status}`);
    return res.json();
  },

  // UPDATE
  async update(table, match, data) {
    const params = Object.entries(match).map(([k,v]) => `${k}=eq.${v}`).join('&');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Update error: ${res.status}`);
    return res.json();
  },

  // DELETE
  async delete(table, match) {
    const params = Object.entries(match).map(([k,v]) => `${k}=eq.${v}`).join('&');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
      },
    });
    if (!res.ok) throw new Error(`Delete error: ${res.status}`);
    return true;
  }
};

// ── API helpers específicos de DGV Chile ─────────────────────

const API = {

  // Portafolio
  async getPortafolio(limit = 20) {
    const client = await db.from('portafolio_items');
    return client
      .select('*,perfiles(especialidad,ciudad,verificado,usuarios(nombre,avatar_url))')
      .order('likes_count', { ascending: false })
      .limit(limit)
      .execute();
  },

  // Perfiles destacados
  async getPerfilesDestacados() {
    const client = await db.from('perfiles');
    return client
      .select('*,usuarios(nombre,avatar_url,plan)')
      .eq('destacado', true)
      .limit(10)
      .execute();
  },

  // Ofertas activas
  async getOfertas(modalidad = null) {
    const client = await db.from('ofertas_trabajo');
    const q = client
      .select('*')
      .eq('estado', 'activa')
      .order('created_at', { ascending: false });
    if (modalidad) q.eq('modalidad', modalidad);
    return q.execute();
  },

  // Eventos próximos
  async getEventos() {
    const client = await db.from('eventos');
    return client
      .select('*')
      .order('fecha', { ascending: true })
      .limit(10)
      .execute();
  },

  // Recursos
  async getRecursos(categoria = null) {
    const client = await db.from('recursos');
    const q = client.select('*').order('created_at', { ascending: false });
    if (categoria) q.eq('categoria', categoria);
    return q.execute();
  },

  // Like toggle
  async toggleLike(itemId, userId) {
    try {
      await db.insert('likes', { item_id: itemId, usuario_id: userId });
      return { liked: true };
    } catch {
      await db.delete('likes', { item_id: itemId, usuario_id: userId });
      return { liked: false };
    }
  },

  // Comentar
  async addComment(itemId, userId, texto) {
    return db.insert('comentarios', { item_id: itemId, usuario_id: userId, texto });
  },

  // Buscar portafolios (búsqueda simple por título)
  async buscarPortafolio(q) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/portafolio_items?select=*,perfiles(usuarios(nombre,avatar_url))&titulo=ilike.*${encodeURIComponent(q)}*`,
      { headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
    );
    return res.json();
  }
};

// ── Auth helpers ─────────────────────────────────────────────
const auth = {
  async signUp(email, password, nombre) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, data: { nombre } })
    });
    const data = await res.json();
    if (data.user) {
      // Crear fila en usuarios
      await db.insert('usuarios', { id: data.user.id, nombre, email });
    }
    return data;
  },

  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.access_token) {
      sessionStorage.setItem('dgv_token', data.access_token);
      sessionStorage.setItem('dgv_user', JSON.stringify(data.user));
    }
    return data;
  },

  signOut() {
    sessionStorage.removeItem('dgv_token');
    sessionStorage.removeItem('dgv_user');
    window.location.href = 'login.html';
  },

  getUser() {
    const u = sessionStorage.getItem('dgv_user');
    return u ? JSON.parse(u) : null;
  },

  isLoggedIn() {
    return !!sessionStorage.getItem('dgv_token');
  }
};

// ── Skeleton loader helper ───────────────────────────────────
function skeletonCards(n = 4, height = '180px') {
  return Array(n).fill(0).map(() =>
    `<div class="skeleton" style="height:${height};border-radius:12px;margin-bottom:10px"></div>`
  ).join('');
}

console.log('✦ DGV Chile conectado a Supabase');
