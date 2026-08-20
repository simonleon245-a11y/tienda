import { createClient } from '@supabase/supabase-js';

/** Cliente admin de Supabase — usa la service_role key, que se salta Row
 * Level Security. Solo debe usarse acá, en las funciones serverless
 * (nunca en el código de la app/navegador). */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export type SubscriberStatus = 'pending' | 'active' | 'past_due' | 'canceled';

export interface Subscriber {
  id: string;
  email: string;
  plan: 'monthly' | 'annual';
  status: SubscriberStatus;
  payment_source_id: number | null;
  amount_in_cents: number;
  currency: string;
  next_charge_at: string | null;
  cancel_token: string;
  created_at: string;
  updated_at: string;
}
