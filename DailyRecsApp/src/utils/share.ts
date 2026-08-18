import { Platform, Share } from 'react-native';

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'unsupported';

/** Comparte texto+link de forma multiplataforma:
 * - Nativo (iOS/Android): usa el Share de React Native (sin dependencias nuevas).
 * - Web: usa la Web Share API si el navegador la soporta (celulares sobre
 *   todo); si no, copia al portapapeles como respaldo. */
export async function shareText(message: string, url: string): Promise<ShareResult> {
  if (Platform.OS === 'web') {
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    if (nav?.share) {
      try {
        await nav.share({ text: message, url });
        return 'shared';
      } catch {
        return 'cancelled';
      }
    }
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(`${message} ${url}`);
      return 'copied';
    }
    return 'unsupported';
  }

  try {
    await Share.share({ message: `${message} ${url}` });
    return 'shared';
  } catch {
    return 'cancelled';
  }
}
