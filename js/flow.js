// DGV Chile — Integración Flow Chile
// Documentación: https://www.flow.cl/docs/api.html
//
// ⚠️  Las llamadas a la API de Flow deben hacerse desde un backend
//     (nunca desde el browser, porque expondrías tu secretKey).
//     Esta app usa Supabase Edge Functions como backend seguro.
//
// FLUJO COMPLETO:
//   1. Usuario pulsa "Suscribirse al Plan Pro"
//   2. Browser llama a Edge Function /flow-crear-orden
//   3. Edge Function llama a Flow API con apiKey+secretKey (servidor)
//   4. Flow devuelve { token, url }
//   5. Browser redirige al usuario a url + token (pago en Flow)
//   6. Flow redirige a /pago-exitoso.html?token=xxx (confirmUrl)
//   7. Browser llama a Edge Function /flow-confirmar con el token
//   8. Edge Function consulta Flow y activa el plan Pro en Supabase
//
// PRECIOS
const PLANES = {
  pro: {
    nombre:      'Plan Pro Mensual',
    precio:      6000,         // CLP — precio validado por encuesta
    moneda:      'CLP',
    descripcion: 'DGV Chile Plan Pro — acceso mensual completo',
    intervalo:   'mensual',
  },
  pro_anual: {
    nombre:      'Plan Pro Anual',
    precio:      60000,        // CLP — 2 meses gratis
    moneda:      'CLP',
    descripcion: 'DGV Chile Plan Pro — acceso anual (2 meses gratis)',
    intervalo:   'anual',
  }
};

// URL de tu Edge Function en Supabase (se completará al desplegar)
const EDGE_URL = 'https://uarjbusgkhtdwusgtjpt.supabase.co/functions/v1';

const Flow = {
  // Crear orden de pago y redirigir al usuario a Flow
  async iniciarPago(plan = 'pro') {
    const user = auth.getUser();
    if (!user) { window.location.href = 'login.html'; return; }

    const planData = PLANES[plan];
    const btn = document.getElementById('btn-pago');
    if (btn) { btn.disabled = true; btn.textContent = 'Procesando...'; }

    try {
      const res = await fetch(`${EDGE_URL}/flow-crear-orden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('dgv_token')}`,
        },
        body: JSON.stringify({
          usuario_id:  user.id,
          email:       user.email,
          plan:        plan,
          monto:       planData.precio,
          descripcion: planData.descripcion,
        })
      });

      const data = await res.json();
      if (data.url && data.token) {
        // Guardar referencia local antes de redirigir
        sessionStorage.setItem('flow_pending_order', data.commerceOrder);
        // Redirigir al pago en Flow
        window.location.href = `${data.url}?token=${data.token}`;
      } else {
        throw new Error(data.error || 'Error al crear la orden');
      }
    } catch (e) {
      alert('Error al conectar con Flow: ' + e.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Suscribirse'; }
    }
  },

  // Confirmar pago (llamado desde pago-exitoso.html)
  async confirmarPago(token) {
    const user = auth.getUser();
    if (!user) return null;

    const res = await fetch(`${EDGE_URL}/flow-confirmar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('dgv_token')}`,
      },
      body: JSON.stringify({ token, usuario_id: user.id })
    });
    return res.json();
  }
};
