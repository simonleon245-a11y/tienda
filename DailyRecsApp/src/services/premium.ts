import { Linking } from 'react-native';
import { getIsPremium, setIsPremium, getPremiumEmail, setPremiumEmail } from './storage';
import { Language, translations } from '@/i18n/translations';

/**
 * Suscripción premium ($3/mes, plan anual con descuento como
 * alternativa) — pago recurrente real vía Wompi (tokenización + fuentes
 * de pago), con un backend propio en /api que guarda quién está activo.
 * Como la app no tiene cuentas/login, el correo con el que la persona
 * pagó es lo único que identifica su suscripción entre reinicios o
 * dispositivos (ver `verifyPremiumByEmail`, el equivalente a "restaurar
 * compra" en otras apps).
 */

// La app y el backend (funciones serverless en /api) viven en el mismo
// proyecto de Vercel que exportó esta build web — pero en nativo
// (iOS/Android) no hay "origin" del que depender, así que se usa la URL
// completa siempre, no una ruta relativa.
const APP_BASE_URL = 'https://recos-diarias-app.vercel.app';

export const FREE_REROLLS_PER_PERIOD = 1;

export async function checkPremiumStatus(): Promise<boolean> {
  return getIsPremium();
}

/** Úsalo solo para pruebas manuales. */
export async function setPremiumStatus(value: boolean): Promise<void> {
  await setIsPremium(value);
}

export async function openUpgradeFlow(): Promise<void> {
  await Linking.openURL(`${APP_BASE_URL}/suscribirse.html?plan=monthly`);
}

export async function openAnnualUpgradeFlow(): Promise<void> {
  await Linking.openURL(`${APP_BASE_URL}/suscribirse.html?plan=annual`);
}

export interface PremiumVerificationResult {
  premium: boolean;
  status?: 'pending' | 'active' | 'past_due' | 'canceled';
}

/** Le pregunta al backend si este correo tiene una suscripción activa de
 * verdad (consulta la base de datos, no confía solo en lo local). Si es
 * premium, guarda la bandera y el correo localmente para no tener que
 * volver a preguntar en cada apertura de la app. */
export async function verifyPremiumByEmail(
  email: string,
  language: Language = 'es'
): Promise<PremiumVerificationResult> {
  const t = translations[language];
  let res: Response;
  try {
    res = await fetch(`${APP_BASE_URL}/api/premium-status?email=${encodeURIComponent(email)}`);
  } catch {
    throw new Error(t.restoreNetworkError);
  }
  if (!res.ok) throw new Error(t.restoreNetworkError);
  const json = (await res.json()) as PremiumVerificationResult;

  if (json.premium) {
    await setIsPremium(true);
    await setPremiumEmail(email);
  }
  return json;
}

/** Se llama al abrir la app: si ya sabemos con qué correo se suscribió,
 * refresca el estado contra el backend (por si canceló, o si un cobro
 * falló) en vez de confiar para siempre en la última bandera guardada. */
export async function refreshPremiumStatus(language: Language = 'es'): Promise<boolean> {
  const email = await getPremiumEmail();
  if (!email) return getIsPremium();

  try {
    const result = await verifyPremiumByEmail(email, language);
    if (!result.premium) await setIsPremium(false);
    return result.premium;
  } catch {
    // Sin internet o el backend no respondió — nos quedamos con lo que
    // ya sabíamos en vez de tumbarle el premium a alguien de la nada.
    return getIsPremium();
  }
}
