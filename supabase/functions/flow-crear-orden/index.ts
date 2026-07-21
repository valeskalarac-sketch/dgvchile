// Supabase Edge Function: flow-crear-orden
// Crea una orden de pago en Flow y devuelve la URL de redirección
//
// Variables de entorno requeridas (configurar en Supabase Dashboard):
//   FLOW_API_KEY    → tu apiKey de Flow (sandbox o producción)
//   FLOW_SECRET_KEY → tu secretKey de Flow
//   FLOW_API_URL    → https://sandbox.flow.cl/api (pruebas)
//                     https://www.flow.cl/api      (producción)
//   APP_URL         → https://valeskalarac-sketch.github.io/dgvchile

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac }   from 'node:crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Firma Flow: ordenar params alfabéticamente + HMAC-SHA256
function flowSign(params: Record<string, string>, secretKey: string): string {
  const keys   = Object.keys(params).sort();
  const concat = keys.map(k => `${k}${params[k]}`).join('');
  return createHmac('sha256', secretKey).update(concat).digest('hex');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const FLOW_API_KEY    = Deno.env.get('FLOW_API_KEY')!;
    const FLOW_SECRET_KEY = Deno.env.get('FLOW_SECRET_KEY')!;
    const FLOW_API_URL    = Deno.env.get('FLOW_API_URL') ?? 'https://sandbox.flow.cl/api';
    const APP_URL         = Deno.env.get('APP_URL')      ?? 'https://valeskalarac-sketch.github.io/dgvchile';

    const { usuario_id, email, plan, monto, descripcion } = await req.json();

    // ID único de orden
    const commerceOrder = `DGV-${usuario_id.slice(0,8)}-${Date.now()}`;

    // Supabase client (para guardar el pago pendiente)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Guardar pago pendiente
    await supabase.from('pagos_flow').insert({
      usuario_id,
      flow_order: commerceOrder,
      monto,
      estado: 'pendiente',
    });

    // Parámetros para Flow
    const params: Record<string, string> = {
      apiKey:         FLOW_API_KEY,
      commerceOrder,
      subject:        descripcion,
      currency:       'CLP',
      amount:         String(Math.round(monto)),
      email,
      paymentMethod:  '9',             // 9 = todos los medios
      urlConfirmation:`${APP_URL}/pago-webhook.html`,
      urlReturn:      `${APP_URL}/pago-exitoso.html`,
    };

    params.s = flowSign(params, FLOW_SECRET_KEY);

    // Llamar a Flow
    const body = new URLSearchParams(params);
    const flowRes = await fetch(`${FLOW_API_URL}/payment/create`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const flowData = await flowRes.json();

    if (flowData.token && flowData.url) {
      // Guardar token de Flow
      await supabase
        .from('pagos_flow')
        .update({ flow_token: flowData.token })
        .eq('flow_order', commerceOrder);

      return new Response(JSON.stringify({
        token:         flowData.token,
        url:           flowData.url,
        commerceOrder,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    throw new Error(flowData.message ?? 'Error al crear orden en Flow');

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status:  400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
