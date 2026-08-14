import { Linking } from 'react-native';
import { ENV } from '@/utils/env';
import { Language, translations } from '@/i18n/translations';

/** Propina/donación voluntaria, sin relación con premium: abre un link de
 * pago único de Wompi. No desbloquea nada, es solo apoyo opcional. */
export async function openTipFlow(language: Language = 'es'): Promise<void> {
  if (!ENV.TIP_CHECKOUT_URL) {
    throw new Error(translations[language].tipNotConfigured);
  }
  await Linking.openURL(ENV.TIP_CHECKOUT_URL);
}
