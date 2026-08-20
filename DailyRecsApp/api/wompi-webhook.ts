import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyWebhookChecksum } from './_lib/wompi';
import { supabaseAdmin } from './_lib/supabase';

/** Wompi manda un POST acá cada vez que el estado de una transacción
 * cambia. Hay que configurar esta URL en el dashboard de Wompi
 * (Configuración -> Eventos), para el ambiente sandbox y para producción
 * por separado. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = req.body;

  let valid = false;
  try {
    valid = verifyWebhookChecksum(payload);
  } catch {
    valid = false;
  }
  if (!valid) {
    res.status(401).json({ error: 'Firma inválida.' });
    return;
  }

  if (payload.event !== 'transaction.updated') {
    res.status(200).json({ received: true, skipped: true });
    return;
  }

  const transaction = payload.data?.transaction;
  if (!transaction?.payment_source_id) {
    res.status(200).json({ received: true, skipped: true });
    return;
  }

  const supabase = supabaseAdmin();
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('payment_source_id', transaction.payment_source_id)
    .maybeSingle();

  if (subscriber) {
    await supabase.from('subscriber_transactions').insert({
      subscriber_id: subscriber.id,
      wompi_transaction_id: transaction.id,
      wompi_reference: transaction.reference,
      status: transaction.status,
      amount_in_cents: transaction.amount_in_cents,
      raw_event: transaction,
    });

    if (transaction.status === 'APPROVED' && subscriber.status !== 'canceled') {
      await supabase.from('subscribers').update({ status: 'active' }).eq('id', subscriber.id);
    } else if (
      (transaction.status === 'DECLINED' || transaction.status === 'ERROR') &&
      subscriber.status === 'active'
    ) {
      await supabase.from('subscribers').update({ status: 'past_due' }).eq('id', subscriber.id);
    }
  }

  res.status(200).json({ received: true });
}
