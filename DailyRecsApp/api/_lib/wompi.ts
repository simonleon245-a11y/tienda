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
    // Wompi devuelve el detalle real en "reason" (transacciones) o en
    // "messages" (un objeto campo -> [mensajes], en validaciones como
    // fuentes de pago) — sin esto, cualquier error de validación se veía
    // solo como el genérico "INPUT_VALIDATION_ERROR".
    const messages = json?.error?.messages;
    const firstMessage = messages ? Object.values(messages).flat()[0] : undefined;
    const message =
      json?.error?.reason || firstMessage || json?.error?.type || `Wompi respondió ${res.status}`;
    throw new Error(String(message));
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

/** Firma de integridad que Wompi exige en cada transacción (para que
 * nadie pueda alterar el monto/referencia entre que se calcula y que se
 * cobra): sha256(referencia + monto_en_centavos + moneda + secreto). */
function integritySignature(reference: string, amountInCents: number, currency: string): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error('Falta WOMPI_INTEGRITY_SECRET en las variables de entorno.');
  const crypto = require('crypto') as typeof import('crypto');
  return crypto
    .createHash('sha256')
    .update(`${reference}${amountInCents}${currency}${secret}`)
    .digest('hex');
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
    signature: integritySignature(params.reference, params.amountInCents, 'COP'),
    payment_source_id: params.paymentSourceId,
  });
}

/** Consulta el estado actual de una transacción por su id (endpoint
 * público de Wompi, no necesita llave). Sirve de respaldo cuando el
 * webhook de confirmación nunca llega — sin esto, un suscriptor que se
 * queda en "pending" se queda así para siempre. */
export async function getTransaction(transactionId: string): Promise<WompiTransaction> {
  const res = await fetch(`${baseUrl()}/transactions/${transactionId}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.reason || json?.error?.type || `Wompi respondió ${res.status}`);
  }
  return json.data as WompiTransaction;
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
    // Cada propiedad es una ruta completa dentro de "data", ej.
    // "transaction.id" -> payload.data.transaction.id. Antes se descartaba
    // el primer segmento ("transaction"), así que siempre se leía
    // undefined y la firma nunca coincidía con la real de Wompi.
    const parts = propPath.split('.');
    let value: any = payload.data;
    for (const part of parts) value = value?.[part];
    concatenated += String(value ?? '');
  }
  concatenated += String(timestamp) + eventsSecret;

  const crypto = require('crypto') as typeof import('crypto');
  const expected = crypto.createHash('sha256').update(concatenated).digest('hex').toUpperCase();
  return expected === checksum.toUpperCase();
}
