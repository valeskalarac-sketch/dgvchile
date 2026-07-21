// Patch: cargar datos reales en index.html
// Este script reemplaza los datos mock por datos de Supabase

async function loadHomeData() {
  // Proyectos destacados
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = skeletonCards(4, '160px');
    try {
      const proyectos = await API.getPortafolio(4);
      grid.innerHTML = '';
      proyectos.forEach(p => {
        const autor = p.perfiles?.usuarios?.nombre || 'Diseñador';
        const avatar = p.perfiles?.usuarios?.avatar_url || avatarUrl(autor, 24);
        const div = document.createElement('a');
        div.href = `proyecto.html?id=${p.id}`;
        div.className = 'card';
        div.style.cssText = 'display:block;border-radius:12px;overflow:hidden;text-decoration:none';
        div.innerHTML = `
          <div style="aspect-ratio:4/3;overflow:hidden">
            <img src="${p.imagen_url}" alt="${p.titulo}" style="width:100%;height:100%;object-fit:cover" loading="lazy">
          </div>
          <div style="padding:10px 12px">
            <div class="text-title-sm" style="margin-bottom:4px">${p.titulo}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
              ${(p.tags||[]).slice(0,2).map(t=>`<span class="badge badge-surface">${t}</span>`).join('')}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span class="text-body-sm text-muted">${autor}</span>
              <span style="font-size:12px;color:var(--color-outline)">❤ ${p.likes_count||0}</span>
            </div>
          </div>`;
        grid.appendChild(div);
      });
    } catch(e) {
      grid.innerHTML = '<p style="color:var(--color-outline);padding:16px;text-align:center">Error cargando proyectos</p>';
    }
  }

  // Ofertas destacadas
  try {
    const ofertas = await API.getOfertas();
    const oferta = ofertas.find(o => o.destacado) || ofertas[0];
    if (oferta) {
      const titleEl = document.querySelector('.featured-job .text-title-lg');
      const subtitleEl = document.querySelector('.featured-job .text-body-sm');
      if (titleEl) titleEl.textContent = oferta.titulo;
      if (subtitleEl) subtitleEl.textContent = `${oferta.empresa_nombre} · ${oferta.ubicacion||''}`;
    }
  } catch(e) { console.warn('Ofertas:', e); }
}

document.addEventListener('DOMContentLoaded', loadHomeData);
