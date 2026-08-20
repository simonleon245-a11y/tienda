import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

/** Cancela una suscripción. Acepta GET (para que el link de la pantalla
 * de confirmación funcione con un solo clic) y POST. El "token" es el
 * cancel_token que se le entregó a la persona al suscribirse — sin el
 * token correcto no se puede cancelar, así nadie puede cancelar la
 * suscripción de otra persona solo sabiendo su correo. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const source = req.method === 'GET' ? req.query : req.body ?? {};
  const email = typeof source.email === 'string' ? source.email : '';
  const token = typeof source.token === 'string' ? source.token : '';

  if (!email || !token) {
    res.status(400).json({ error: 'Falta el correo o el token de cancelación.' });
    return;
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('subscribers')
    .update({ status: 'canceled', next_charge_at: null })
    .eq('email', email)
    .eq('cancel_token', token)
    .select()
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (!data) {
    res.status(404).json({ error: 'No encontramos esa suscripción, o el link ya no es válido.' });
    return;
  }

  res.status(200).json({ success: true, message: 'Tu suscripción quedó cancelada. No se hará ningún cobro más.' });
}
