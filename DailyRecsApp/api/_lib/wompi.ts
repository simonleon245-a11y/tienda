/**
 * Cliente mínimo para la API de Wompi Colombia (v1). Documentación:
 * https://docs.wompi.co/en/docs/colombia/
 *
 * Ambientes: sandbox (pruebas, sin plata real) y production. Se elige con
 * WOMPI_ENV en las variables de entorno — usa "sandbox" hasta que
 * confirmemos que todo el flujo funciona de punta a punta.
 */

const BASE_URLS = {
  sandbox: 'https://sandbox.wompi.co/v1',
  production: 'https://production.wompi.co/v1',
} as const;

function baseUrl(): string {
  const env = process.env.WOMPI_ENV === 'production' ? 'production' : 'sandbox';
  return BASE_URLS[env];
}

function privateKey(): string {
  const key = process.env.WOMPI_PRIVATE_KEY;
  if (!key) throw new Error('Falta WOMPI_PRIVATE_KEY en las variables de entorno.');
  return key;
}

export interface WompiPaymentSource {
  id: number;
  status: 'AVAILABLE' | 'PENDING' | 'DELETED';
  type: string;
}

export interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
  amount_in_cents: number;
  reference: string;
  payment_source_id: number | null;
}

async function wompiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${privateKey()}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const message = json?.error?.reason || json?.error?.type || `Wompi respondió ${res.status}`;
    throw new Error(message);
  }
  return json.data as T;
}

/** Convierte un token de tarjeta (obtenido en el navegador, con la llave
 * pública) en una fuente de pago reutilizable, asociada a este comercio. */
export function createPaymentSource(params: {
  cardToken: string;
  customerEmail: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}): Promise<WompiPaymentSource> {
  return wompiPost<WompiPaymentSource>('/payment_sources', {
    type: 'CARD',
    token: params.cardToken,
    customer_email: params.customerEmail,
    acceptance_token: params.acceptanceToken,
    accept_personal_auth: params.acceptPersonalAuth,
  });
}

/** Cobra a una fuente de pago ya guardada, sin que la persona tenga que
 * estar presente — así es como se cobra cada mes/año automáticamente. */
export function chargePaymentSource(params: {
  amountInCents: number;
  customerEmail: string;
  reference: string;
  paymentSourceId: number;
}): Promise<WompiTransaction> {
  return wompiPost<WompiTransaction>('/transactions', {
    amount_in_cents: params.amountInCents,
    currency: 'COP',
    customer_email: params.customerEmail,
    payment_method: { installments: 1 },
    reference: params.reference,
    payment_source_id: params.paymentSourceId,
  });
}

/** Verifica que un webhook realmente venga de Wompi (no de cualquiera que
 * le pegue a esta URL). Algoritmo exacto de Wompi:
 * sha256(valores_de_signature.properties_concatenados + timestamp + events_secret). */
export function verifyWebhookChecksum(payload: {
  data: Record<string, any>;
  signature: { properties: string[]; timestamp: number; checksum: string };
}): boolean {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) throw new Error('Falta WOMPI_EVENTS_SECRET en las variables de entorno.');

  const { properties, timestamp, checksum } = payload.signature;
  let concatenated = '';
  for (const propPath of properties) {
    const parts = propPath.split('.');
    let value: any = payload.data;
    for (const part of parts.slice(1)) value = value?.[part];
    concatenated += String(value ?? '');
  }
  concatenated += String(timestamp) + eventsSecret;

  const crypto = require('crypto') as typeof import('crypto');
  const expected = crypto.createHash('sha256').update(concatenated).digest('hex').toUpperCase();
  return expected === checksum.toUpperCase();
}
