// Supabase Edge Function: flow-confirmar
// Confirma el pago con Flow y activa el plan Pro en la base de datos

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac }   from 'node:crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { token, usuario_id } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Consultar estado del pago a Flow
    const params: Record<string, string> = { apiKey: FLOW_API_KEY, token };
    params.s = flowSign(params, FLOW_SECRET_KEY);

    const qs      = new URLSearchParams(params).toString();
    const flowRes = await fetch(`${FLOW_API_URL}/payment/getStatusByToken?${qs}`);
    const flowData = await flowRes.json();

    // Flow status: 1=pendiente, 2=pagado, 3=rechazado, 4=anulado
    const pagado = flowData.status === 2;

    // Actualizar registro en pagos_flow
    await supabase
      .from('pagos_flow')
      .update({
        estado:      pagado ? 'pagado' : 'rechazado',
        flow_status: flowData.status,
        medio_pago:  flowData.paymentData?.media,
        payload_flow: flowData,
        updated_at:  new Date().toISOString(),
      })
      .eq('flow_token', token)
      .eq('usuario_id', usuario_id);

    if (pagado) {
      // Activar plan Pro
      await supabase
        .from('usuarios')
        .update({ plan: 'pro', updated_at: new Date().toISOString() })
        .eq('id', usuario_id);

      await supabase
        .from('perfiles')
        .update({ destacado: true, updated_at: new Date().toISOString() })
        .eq('usuario_id', usuario_id);

      // Crear suscripción activa 30 días
      const inicio = new Date();
      const fin    = new Date(inicio);
      fin.setDate(fin.getDate() + 30);

      await supabase.from('suscripciones').insert({
        usuario_id,
        plan:        'pro',
        estado:      'activa',
        monto:       flowData.amount,
        fecha_inicio: inicio.toISOString(),
        fecha_fin:   fin.toISOString(),
      });
    }

    return new Response(JSON.stringify({
      pagado,
      status:        flowData.status,
      commerceOrder: flowData.commerceOrder,
      monto:         flowData.amount,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status:  400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
