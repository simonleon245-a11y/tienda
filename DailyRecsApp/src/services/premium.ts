import { Linking } from 'react-native';
import { ENV } from '@/utils/env';
import { getIsPremium, setIsPremium } from './storage';

/**
 * Suscripción premium ($3/mes: sin anuncios + "ver otra opción" ilimitado).
 *
 * Esto es un scaffold local: hoy solo guarda una bandera en el teléfono.
 * Cuando exista la web/backend con Stripe, hay que reemplazar
 * `checkPremiumStatus` para que valide contra ese servidor (por ejemplo,
 * pidiendo el email de compra) en vez de leer solo la bandera local, y
 * `PREMIUM_CHECKOUT_URL` debe apuntar a la página de pago real.
 */

export const FREE_REROLLS_PER_PERIOD = 1;

export async function checkPremiumStatus(): Promise<boolean> {
  return getIsPremium();
}

/** Úsalo solo para pruebas manuales o cuando conectemos la verificación
 * real con el backend de pagos. */
export async function setPremiumStatus(value: boolean): Promise<void> {
  await setIsPremium(value);
}

export async function openUpgradeFlow(): Promise<void> {
  if (!ENV.PREMIUM_CHECKOUT_URL) {
    throw new Error(
      'La suscripción todavía no está configurada (falta PREMIUM_CHECKOUT_URL en .env).'
    );
  }
  await Linking.openURL(ENV.PREMIUM_CHECKOUT_URL);
}
