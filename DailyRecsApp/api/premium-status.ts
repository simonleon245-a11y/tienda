import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';
import { allowCors } from './_lib/cors';

/** La app llama esto (GET /api/premium-status?email=...) para saber si un
 * correo tiene una suscripción activa de verdad, en vez de confiar solo
 * en una bandera guardada en el teléfono. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const email = typeof req.query.email === 'string' ? req.query.email : '';
  if (!email) {
    res.status(400).json({ error: 'Falta el correo.' });
    return;
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('subscribers')
    .select('plan, status, next_charge_at')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (!data) {
    res.status(200).json({ premium: false });
    return;
  }

  res.status(200).json({
    premium: data.status === 'active',
    plan: data.plan,
    status: data.status,
    nextChargeAt: data.next_charge_at,
  });
}
