import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chargePaymentSource, getTransaction } from './_lib/wompi';
import { supabaseAdmin } from './_lib/supabase';
import { nextChargeDate } from './_lib/dates';

const PENDING_RECONCILE_AFTER_MS = 10 * 60 * 1000;

/** Respaldo para cuando el webhook de confirmación nunca llega (ya nos
 * pasó una vez por un bug en la verificación de firma): revisa
 * directamente con Wompi el estado de cualquier suscriptor que lleve
 * más de 10 minutos en "pending" y lo destraba. */
async function reconcilePendingSubscribers(
  supabase: ReturnType<typeof supabaseAdmin>
): Promise<Array<{ email: string; status: string }>> {
  const cutoff = new Date(Date.now() - PENDING_RECONCILE_AFTER_MS).toISOString();
  const { data: pendingSubscribers } = await supabase
    .from('subscribers')
    .select('*')
    .eq('status', 'pending')
    .lte('created_at', cutoff);

  const results: Array<{ email: string; status: string }> = [];

  for (const subscriber of pendingSubscribers ?? []) {
    const { data: lastTransaction } = await supabase
      .from('subscriber_transactions')
      .select('wompi_transaction_id, wompi_reference')
      .eq('subscriber_id', subscriber.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lastTransaction?.wompi_transaction_id) continue;

    try {
      const transaction = await getTransaction(lastTransaction.wompi_transaction_id);
      if (transaction.status === 'PENDING') continue;

      await supabase.from('subscriber_transactions').insert({
        subscriber_id: subscriber.id,
        wompi_transaction_id: transaction.id,
        wompi_reference: lastTransaction.wompi_reference,
        status: transaction.status,
        amount_in_cents: transaction.amount_in_cents,
        raw_event: transaction,
      });

      const approved = transaction.status === 'APPROVED';
      await supabase
        .from('subscribers')
        .update({
          status: approved ? 'active' : 'past_due',
          next_charge_at: approved ? nextChargeDate(subscriber.plan) : null,
        })
        .eq('id', subscriber.id);

      results.push({ email: subscriber.email, status: `reconciled: ${transaction.status}` });
    } catch (err) {
      results.push({ email: subscriber.email, status: `reconcile error: ${(err as Error).message}` });
    }
  }

  return results;
}

/** Se ejecuta una vez al día (configurado en vercel.json -> "crons").
 * Busca a quién le toca cobrar hoy y cobra usando la tarjeta ya guardada
 * — así es como el pago se vuelve de verdad recurrente en vez de un pago
 * único que hay que repetir a mano cada mes. También revisa (y destraba)
 * cualquier suscriptor que se haya quedado en "pending" por un webhook
 * que nunca llegó. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'No autorizado.' });
    return;
  }

  const supabase = supabaseAdmin();
  const reconciled = await reconcilePendingSubscribers(supabase);

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

  res.status(200).json({
    reconciled: reconciled.length,
    reconciledResults: reconciled,
    charged: results.length,
    results,
  });
}
