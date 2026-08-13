/**
 * Versión web (PWA) del servicio de anuncios: el SDK de Google Mobile Ads
 * es nativo (Android/iOS) y no se puede empaquetar para navegador, así
 * que en web estas funciones son no-ops. Metro elige este archivo en vez
 * de `ads.ts` automáticamente al compilar para `--platform web`.
 *
 * La monetización en la versión web queda pendiente (ver README, sección
 * "Distribución sin tiendas": la idea es Google AdSense para la PWA).
 */

export function getBannerAdUnitId(): string {
  return '';
}

export async function initializeAds(): Promise<void> {}

export async function maybeShowInterstitial(): Promise<void> {}
