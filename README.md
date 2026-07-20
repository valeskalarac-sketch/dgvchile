# DGV Chile — Comunidad Creativa

La plataforma digital para diseñadores gráficos y visuales de Chile.

## Stack
- HTML5 + CSS3 vanilla (sin frameworks de build)
- JavaScript ES6+ vanilla
- Fuentes: Bricolage Grotesque + Material Symbols (Google Fonts)
- Paleta: Negro #131313 · Dorado #FFBA20 · Blanco #E5E2E1

## Pantallas
| Archivo | Descripción |
|---|---|
| `index.html` | Home / Feed principal |
| `trabajos.html` | Bolsa de trabajo |
| `perfil.html` | Perfil profesional |
| `comunidad.html` | Comunidad y portafolios |
| `crear.html` | Crear publicación |
| `proyecto.html` | Detalle de proyecto |
| `eventos.html` | Eventos de diseño |
| `recursos.html` | Recursos descargables |
| `notificaciones.html` | Notificaciones |

## Diseño
- Mobile-first (max-width: 430px)
- Modo oscuro estricto (#131313 fondo)
- Acento dorado DGV (#FFBA20)
- Sin dependencias de build — desplegable en GitHub Pages directamente

## Despliegue
Habilitado en GitHub Pages desde la rama `main`.

## Próximos pasos
- [ ] Integrar Supabase Auth (login real)
- [ ] Conectar base de datos (tablas del schema.sql)
- [ ] Sistema de pagos Flow/Khipu para plan Pro
- [ ] Subida real de imágenes (Supabase Storage)
- [ ] Notificaciones push (Service Worker)
