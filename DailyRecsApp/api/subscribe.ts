import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPaymentSource, chargePaymentSource } from './_lib/wompi';
import { supabaseAdmin } from './_lib/supabase';
import { allowCors } from './_lib/cors';
import { nextChargeDate } from './_lib/dates';

// Precios fijos en pesos colombianos (Wompi cobra en COP, no en USD).
// Ajusta estos valores si la tasa de cambio se mueve mucho — no se
// recalculan solos a propósito, para no depender de otra API externa.
const MONTHLY_COP = Number(process.env.WOMPI_MONTHLY_AMOUNT_COP || 9900);
const ANNUAL_COP = Number(process.env.WOMPI_ANNUAL_AMOUNT_COP || 71900);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, plan, cardToken, acceptanceToken, acceptPersonalAuth } = req.body ?? {};

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Falta el correo.' });
    return;
  }
  if (plan !== 'monthly' && plan !== 'annual') {
    res.status(400).json({ error: 'Plan inválido.' });
    return;
  }
  if (!cardToken || !acceptanceToken || !acceptPersonalAuth) {
    res.status(400).json({ error: 'Falta el token de la tarjeta o los permisos de Wompi.' });
    return;
  }

  const amountInCents = (plan === 'monthly' ? MONTHLY_COP : ANNUAL_COP) * 100;
  const supabase = supabaseAdmin();

  try {
    const paymentSource = await createPaymentSource({
      cardToken,
      customerEmail: email,
      acceptanceToken,
      acceptPersonalAuth,
    });

    const reference = `recos-${plan}-${Date.now()}`;
    const transaction = await chargePaymentSource({
      amountInCents,
      customerEmail: email,
      reference,
      paymentSourceId: paymentSource.id,
    });

    // Wompi crea toda transacción nueva en estado PENDING — la confirmación
    // real (APPROVED/DECLINED) llega después, de forma asíncrona, por el
    // webhook (ver wompi-webhook.ts). Solo DECLINED/ERROR/VOIDED en este
    // primer intento son un fallo real; PENDING es el camino normal.
    const approved = transaction.status === 'APPROVED';
    const failed = transaction.status === 'DECLINED' || transaction.status === 'ERROR' || transaction.status === 'VOIDED';

    const { data: subscriber, error: upsertError } = await supabase
      .from('subscribers')
      .upsert(
        {
          email,
          plan,
          status: approved ? 'active' : failed ? 'past_due' : 'pending',
          payment_source_id: paymentSource.id,
          amount_in_cents: amountInCents,
          currency: 'COP',
          next_charge_at: approved ? nextChargeDate(plan) : null,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (upsertError || !subscriber) {
      throw new Error(upsertError?.message || 'No se pudo guardar la suscripción.');
    }

    await supabase.from('subscriber_transactions').insert({
      subscriber_id: subscriber.id,
      wompi_transaction_id: transaction.id,
      wompi_reference: reference,
      status: transaction.status,
      amount_in_cents: amountInCents,
      raw_event: transaction,
    });

    if (failed) {
      res.status(402).json({
        success: false,
        error: 'El primer cobro no fue aprobado. Intenta con otra tarjeta.',
        wompiStatus: transaction.status,
      });
      return;
    }

    res.status(200).json({
      success: true,
      pending: !approved,
      cancelUrl: `/api/cancel?email=${encodeURIComponent(email)}&token=${subscriber.cancel_token}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
}
