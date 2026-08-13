import { Platform } from 'react-native';
import mobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ENV } from '@/utils/env';
import { incrementGenreChangeCount } from './storage';
import { checkPremiumStatus } from './premium';

// Cada cuántos cambios de género se muestra un intersticial, para no
// saturar de anuncios a alguien que solo está explorando géneros.
const INTERSTITIAL_FREQUENCY = 3;

export function getBannerAdUnitId(): string {
  const configured = Platform.select({
    ios: ENV.ADMOB_BANNER_IOS,
    android: ENV.ADMOB_BANNER_ANDROID,
    default: '',
  });
  return configured || TestIds.BANNER;
}

function getInterstitialAdUnitId(): string {
  const configured = Platform.select({
    ios: ENV.ADMOB_INTERSTITIAL_IOS,
    android: ENV.ADMOB_INTERSTITIAL_ANDROID,
    default: '',
  });
  return configured || TestIds.INTERSTITIAL;
}

let interstitial: InterstitialAd | null = null;
let interstitialLoaded = false;

function loadInterstitial(): void {
  interstitial = InterstitialAd.createForAdRequest(getInterstitialAdUnitId(), {
    requestNonPersonalizedAdsOnly: false,
  });
  interstitialLoaded = false;

  const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    interstitialLoaded = true;
  });
  const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    unsubscribeLoaded();
    unsubscribeClosed();
    loadInterstitial(); // precarga el siguiente
  });

  interstitial.load();
}

export async function initializeAds(): Promise<void> {
  await mobileAds().initialize();
  loadInterstitial();
}

/** Llamar cada vez que el usuario cambia de género; muestra un
 * intersticial cada INTERSTITIAL_FREQUENCY cambios, si ya está cargado.
 * No hace nada si el usuario tiene la suscripción premium. */
export async function maybeShowInterstitial(): Promise<void> {
  if (await checkPremiumStatus()) return;
  const count = await incrementGenreChangeCount();
  if (count % INTERSTITIAL_FREQUENCY !== 0) return;
  if (interstitial && interstitialLoaded) {
    interstitial.show();
  }
}
