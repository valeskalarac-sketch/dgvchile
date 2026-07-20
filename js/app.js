// DGV Chile — App Core JS
// Navegación, datos mock y utilidades

// ── Datos mock ──────────────────────────────────────────────
const DATA = {
  user: {
    name: 'Vale',
    fullName: 'Valentina Rojas',
    role: 'Diseñadora UX/UI',
    location: 'Santiago, Chile',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vale&backgroundColor=b6e3f4',
    proyectos: 128, seguidores: '2.4K', siguiendo: 980,
    bio: 'Diseñadora UX/UI apasionada por crear experiencias digitales intuitivas y significativas.',
    herramientas: ['Figma','Photoshop','Illustrator','After Effects','Notion'],
    verificado: true, plan: 'pro'
  },
  stories: [
    { id:1, name:'Marco.V',  seed:'marco' },
    { id:2, name:'Catalina', seed:'catalina' },
    { id:3, name:'Diego N.', seed:'diego' },
    { id:4, name:'Ana P.',   seed:'ana' },
  ],
  proyectos: [
    { id:1, titulo:'Identidad Nativa',   tags:['Branding','Packaging'],   autor:'Catalina P.', likes:128, img:'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&q=80' },
    { id:2, titulo:'App Finanzas',       tags:['UX/UI Design'],           autor:'Diego N.',    likes:96,  img:'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&q=80' },
    { id:3, titulo:'Marca Raíz Studio',  tags:['Identidad Visual'],       autor:'Marco V.',    likes:214, img:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&q=80' },
    { id:4, titulo:'Motion Festival',   tags:['Motion','Branding'],      autor:'Ana P.',      likes:87,  img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80' },
    { id:5, titulo:'Editorial Revista',  tags:['Editorial'],              autor:'Sofía R.',    likes:63,  img:'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80' },
    { id:6, titulo:'Packaging Orgánico', tags:['Packaging','Branding'],   autor:'Luis M.',     likes:155, img:'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80' },
  ],
  empleos: [
    { id:1, empresa:'Agencia Mambo',    logo:'🟡', titulo:'Brand Designer',        tipo:'Full time',  modalidad:'Remoto',      ubicacion:'Santiago, Chile',    publicado:'Publicado hoy',     destacado:true  },
    { id:2, empresa:'Falabella Retail', logo:'🟢', titulo:'Diseñador/a Gráfico',   tipo:'Part time',  modalidad:'Híbrido',     ubicacion:'Santiago, Chile',    publicado:'Publicado ayer',    destacado:false },
    { id:3, empresa:'NotCo',            logo:'⬛', titulo:'UX/UI Designer',        tipo:'Full time',  modalidad:'Remoto',      ubicacion:'Remoto',             publicado:'Hace 2 días',       destacado:false },
    { id:4, empresa:'Vértice Media',    logo:'🔴', titulo:'Diseñador/a Motion',    tipo:'Full time',  modalidad:'Presencial',  ubicacion:'Santiago, Chile',    publicado:'Hace 3 días',       destacado:false },
    { id:5, empresa:'Raíz Studio',      logo:'🟤', titulo:'Diseñador Identidad',   tipo:'Freelance',  modalidad:'Remoto',      ubicacion:'Valparaíso / Remoto','publicado':'Hace 4 días',     destacado:false },
    { id:6, empresa:'Crea Digital',     logo:'🔵', titulo:'Product Designer',      tipo:'Full time',  modalidad:'Híbrido',     ubicacion:'Santiago, Chile',    publicado:'Hace 5 días',       destacado:false },
  ],
  eventos: [
    { id:1, dia:'24', mes:'MAY', titulo:'Workshop Diseño Editorial con InDesign', tipo:'Workshop', lugar:'Santiago, Chile', hora:'18:00 hrs', organizador:'Estudio Forma', guardado:false },
    { id:2, dia:'31', mes:'MAY', titulo:'Charla Tendencias de Diseño 2026',       tipo:'Charla',   lugar:'Online',          hora:'19:00 hrs', organizador:'DGV Chile',     guardado:true  },
    { id:3, dia:'07', mes:'JUN', titulo:'Meetup Diseñadores UX Santiago',          tipo:'Meetup',   lugar:'Santiago, Chile', hora:'19:30 hrs', organizador:'UX Chile',      guardado:false },
    { id:4, dia:'14', mes:'JUN', titulo:'Workshop Figma Avanzado',                 tipo:'Workshop', lugar:'Online',          hora:'17:00 hrs', organizador:'Design Lab',    guardado:false },
  ],
  recursos: [
    { id:1, titulo:'Guía de Autoedición',      formato:'PDF',  peso:'12 MB',  categoria:'Tutoriales',  color:'#ff6b6b', guardado:false },
    { id:2, titulo:'Plantilla Brief Creativo', formato:'Figma','peso':'2.4 MB',categoria:'Plantillas',  color:'#4ecdc4', guardado:true  },
    { id:3, titulo:'Pack de Íconos Lineales',  formato:'ZIP',  peso:'4.1 MB', categoria:'Herramientas',color:'#45b7d1', guardado:false },
    { id:4, titulo:'Guía de Tipografía',       formato:'PDF',  peso:'8.7 MB', categoria:'Tutoriales',  color:'#f9ca24', guardado:false },
    { id:5, titulo:'Kit Branding Completo',    formato:'ZIP',  peso:'54 MB',  categoria:'Plantillas',  color:'#6c5ce7', guardado:false },
    { id:6, titulo:'Paletas Color Chile',      formato:'PDF',  peso:'3.2 MB', categoria:'Herramientas',color:'#a29bfe', guardado:true  },
  ],
  notificaciones: [
    { id:1, tipo:'mensaje', actor:'Estudio Mambo',   texto:'te envió un mensaje',             tiempo:'Hace 5 min',  leido:false, icon:'chat' },
    { id:2, tipo:'like',    actor:'Tu proyecto',     texto:'recibió 23 me gusta',             tiempo:'Hace 1 hora', leido:false, icon:'favorite' },
    { id:3, tipo:'trabajo', actor:'Nueva oferta',    texto:'Brand Designer en Mambo',         tiempo:'Hace 2 horas',leido:true,  icon:'work' },
    { id:4, tipo:'comment', actor:'Catalina P.',     texto:'comentó tu publicación',          tiempo:'Hace 3 horas',leido:true,  icon:'comment' },
    { id:5, tipo:'follow',  actor:'Marco Venegas',   texto:'comenzó a seguirte',              tiempo:'Hace 5 horas',leido:true,  icon:'person_add' },
    { id:6, tipo:'like',    actor:'Tu portafolio',   texto:'recibió una nueva visita',        tiempo:'Ayer',        leido:true,  icon:'visibility' },
  ],
  miembros: [
    { id:1, name:'Antonia Rivas',  role:'Brand Designer',    seed:'antonia',  proyectos:47, seguidores:'1.2K', verificado:true  },
    { id:2, name:'Marco Venegas',  role:'Motion Designer',   seed:'marco2',   proyectos:83, seguidores:'3.4K', verificado:true  },
    { id:3, name:'Sofía Recabarren',role:'UX Researcher',    seed:'sofia',    proyectos:29, seguidores:'890',  verificado:false },
    { id:4, name:'Luis Morales',   role:'Diseñador Editorial',seed:'luis',    proyectos:61, seguidores:'2.1K', verificado:false },
  ]
};

// ── Avatar helper ───────────────────────────────────────────
function avatarUrl(seed, size=64) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,ffd5dc,c0aede&radius=50&size=${size}`;
}

// ── Bottom Nav ──────────────────────────────────────────────
function renderBottomNav(active) {
  const items = [
    { id:'index',     icon:'home',         label:'Inicio'    },
    { id:'trabajos',  icon:'work',         label:'Trabajos'  },
    { id:'crear',     icon:'add',          label:'',         fab:true },
    { id:'comunidad', icon:'group',        label:'Comunidad' },
    { id:'perfil',    icon:'person',       label:'Perfil'    },
  ];
  return `
  <nav class="bottom-nav">
    ${items.map(item => {
      if (item.fab) return `
        <a href="crear.html" class="nav-fab" aria-label="Crear publicación">
          <span class="material-symbols-outlined" style="font-size:26px">add</span>
        </a>`;
      const isActive = item.id === active;
      return `
        <a href="${item.id === 'index' ? 'index.html' : item.id+'.html'}" 
           class="nav-item${isActive?' active':''}" aria-label="${item.label}">
          <span class="material-symbols-outlined nav-icon${isActive?' icon-filled':''}">${item.icon}</span>
          <span>${item.label}</span>
        </a>`;
    }).join('')}
  </nav>`;
}

// ── Tarjeta de empleo ───────────────────────────────────────
function renderJobCard(job) {
  return `
  <article class="card p-4" style="display:flex;gap:12px;align-items:flex-start;border-radius:12px;margin-bottom:10px">
    <div style="width:44px;height:44px;background:var(--color-surface-container-high);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${job.logo}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
        <div>
          ${job.destacado ? `<span class="badge badge-gold" style="margin-bottom:4px;display:inline-block">Destacado</span><br>` : ''}
          <div class="text-title-sm" style="color:var(--color-on-surface)">${job.titulo}</div>
          <div class="text-body-sm" style="color:var(--color-secondary);margin-top:2px">${job.empresa}</div>
        </div>
        <button class="btn-icon" style="flex-shrink:0;width:32px;height:32px;font-size:18px" aria-label="Guardar">
          <span class="material-symbols-outlined" style="font-size:18px">bookmark_border</span>
        </button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <span class="chip" style="padding:4px 10px;font-size:11px">
          <span class="material-symbols-outlined" style="font-size:13px">public</span> ${job.modalidad}
        </span>
        <span class="chip" style="padding:4px 10px;font-size:11px">${job.tipo}</span>
        <span style="font-size:11px;color:var(--color-outline);align-self:center;margin-left:auto">${job.publicado}</span>
      </div>
    </div>
  </article>`;
}

// ── Tarjeta de proyecto ─────────────────────────────────────
function renderProjectCard(p, big=false) {
  return `
  <a href="proyecto.html?id=${p.id}" class="card" style="display:block;border-radius:12px;overflow:hidden;text-decoration:none">
    <div style="position:relative;aspect-ratio:${big?'16/9':'4/3'};overflow:hidden">
      <img src="${p.img}" alt="${p.titulo}" style="width:100%;height:100%;object-fit:cover;transition:transform .3s" loading="lazy"
           onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
    </div>
    <div style="padding:10px 12px">
      <div class="text-title-sm" style="color:var(--color-on-surface);margin-bottom:4px">${p.titulo}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${p.tags.map(t=>`<span class="badge badge-surface" style="font-size:10px">${t}</span>`).join('')}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:6px">
          <img src="${avatarUrl(p.autor,24)}" style="width:20px;height:20px;border-radius:50%;object-fit:cover" alt="${p.autor}">
          <span class="text-body-sm" style="color:var(--color-secondary)">${p.autor}</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;color:var(--color-outline)">
          <span class="material-symbols-outlined icon-filled" style="font-size:14px;color:#ff6b6b">favorite</span>
          <span class="text-body-sm">${p.likes}</span>
        </div>
      </div>
    </div>
  </a>`;
}

// ── Toast ───────────────────────────────────────────────────
function showToast(msg, icon='check_circle') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--color-surface-container-high);color:var(--color-on-surface);padding:10px 18px;border-radius:999px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4);animation:fadeSlideUp .2s ease forwards`;
  t.innerHTML = `<span class="material-symbols-outlined icon-filled" style="font-size:16px;color:var(--color-primary)">${icon}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 2500);
}

// ── Inicializar nav ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navPlaceholder = document.getElementById('bottom-nav');
  if (navPlaceholder) {
    const page = navPlaceholder.dataset.page || 'index';
    navPlaceholder.outerHTML = renderBottomNav(page);
  }
  // Animación de entrada
  document.querySelector('.page')?.classList.add('page-enter');
});
