import { Linking } from 'react-native';
import { ENV } from '@/utils/env';
import { getIsPremium, setIsPremium } from './storage';
import { Language, translations } from '@/i18n/translations';

/**
 * Suscripción premium ($3/mes: sin anuncios + "ver otra opción" ilimitado).
 *
 * Esto es un scaffold local: hoy solo guarda una bandera en el teléfono.
 * Cuando exista la web/backend con la pasarela de pago (Wompi recomendado
 * para Colombia, ver README sección 7), hay que reemplazar
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

export async function openUpgradeFlow(language: Language = 'es'): Promise<void> {
  if (!ENV.PREMIUM_CHECKOUT_URL) {
    throw new Error(translations[language].subscriptionNotConfigured);
  }
  await Linking.openURL(ENV.PREMIUM_CHECKOUT_URL);
}

/** Alternativa de pago único a la suscripción mensual: acceso premium
 * "de por vida". Igual que la suscripción, hoy no hay verificación
 * automática del pago — desbloquear premium tras la compra sigue siendo
 * manual hasta que exista un backend que valide contra Wompi. */
export async function openLifetimeUpgradeFlow(language: Language = 'es'): Promise<void> {
  if (!ENV.PREMIUM_LIFETIME_CHECKOUT_URL) {
    throw new Error(translations[language].lifetimeNotConfigured);
  }
  await Linking.openURL(ENV.PREMIUM_LIFETIME_CHECKOUT_URL);
}
