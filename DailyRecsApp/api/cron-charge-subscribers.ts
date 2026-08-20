import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chargePaymentSource } from './_lib/wompi';
import { supabaseAdmin } from './_lib/supabase';

const DAY_MS = 24 * 60 * 60 * 1000;

function nextChargeDate(plan: 'monthly' | 'annual'): string {
  const days = plan === 'monthly' ? 30 : 365;
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

/** Se ejecuta una vez al día (configurado en vercel.json -> "crons").
 * Busca a quién le toca cobrar hoy y cobra usando la tarjeta ya guardada
 * — así es como el pago se vuelve de verdad recurrente en vez de un pago
 * único que hay que repetir a mano cada mes. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'No autorizado.' });
    return;
  }

  const supabase = supabaseAdmin();
  const { data: dueSubscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .in('status', ['active', 'past_due'])
    .lte('next_charge_at', new Date().toISOString());

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const results: Array<{ email: string; status: string }> = [];

  for (const subscriber of dueSubscribers ?? []) {
    if (!subscriber.payment_source_id) continue;
    const reference = `recos-${subscriber.plan}-renew-${Date.now()}-${subscriber.id.slice(0, 8)}`;

    try {
      const transaction = await chargePaymentSource({
        amountInCents: subscriber.amount_in_cents,
        customerEmail: subscriber.email,
        reference,
        paymentSourceId: subscriber.payment_source_id,
      });

      await supabase.from('subscriber_transactions').insert({
        subscriber_id: subscriber.id,
        wompi_transaction_id: transaction.id,
        wompi_reference: reference,
        status: transaction.status,
        amount_in_cents: subscriber.amount_in_cents,
        raw_event: transaction,
      });

      const approved = transaction.status === 'APPROVED';
      await supabase
        .from('subscribers')
        .update({
          status: approved ? 'active' : 'past_due',
          next_charge_at: approved ? nextChargeDate(subscriber.plan) : subscriber.next_charge_at,
        })
        .eq('id', subscriber.id);

      results.push({ email: subscriber.email, status: transaction.status });
    } catch (err) {
      await supabase.from('subscribers').update({ status: 'past_due' }).eq('id', subscriber.id);
      results.push({ email: subscriber.email, status: `error: ${(err as Error).message}` });
    }
  }

  res.status(200).json({ charged: results.length, results });
}
