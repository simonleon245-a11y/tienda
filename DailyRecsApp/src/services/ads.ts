import { Platform } from 'react-native';
import { ENV } from '@/utils/env';
import { incrementGenreChangeCount } from './storage';
import { checkPremiumStatus } from './premium';
import { isExpoGo } from '@/utils/environment';

// Cada cuántos cambios de género se muestra un intersticial, para no
// saturar de anuncios a alguien que solo está explorando géneros.
const INTERSTITIAL_FREQUENCY = 3;

/**
 * IDs de prueba oficiales de Google AdMob (no generan ingresos, solo
 * sirven para comprobar que el anuncio se muestra). Los escribimos acá
 * directo en vez de importar `TestIds` del paquete: cualquier import,
 * aunque sea de una sola cosa, dispara el código nativo de
 * react-native-google-mobile-ads con solo cargarse — y ese código no
 * existe dentro de Expo Go, lo que crashea toda la app. Por eso todo el
 * resto de este archivo importa el paquete de forma diferida (`import()`
 * dentro de las funciones), solo cuando `isExpoGo` es falso.
 */
const GOOGLE_TEST_IDS = {
  banner:
    Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716',
      android: 'ca-app-pub-3940256099942544/6300978111',
    }) ?? '',
  interstitial:
    Platform.select({
      ios: 'ca-app-pub-3940256099942544/4411468910',
      android: 'ca-app-pub-3940256099942544/1033173712',
    }) ?? '',
};

export function getBannerAdUnitId(): string {
  const configured = Platform.select({
    ios: ENV.ADMOB_BANNER_IOS,
    android: ENV.ADMOB_BANNER_ANDROID,
    default: '',
  });
  return configured || GOOGLE_TEST_IDS.banner;
}

function getInterstitialAdUnitId(): string {
  const configured = Platform.select({
    ios: ENV.ADMOB_INTERSTITIAL_IOS,
    android: ENV.ADMOB_INTERSTITIAL_ANDROID,
    default: '',
  });
  return configured || GOOGLE_TEST_IDS.interstitial;
}

type GoogleAdsModule = typeof import('react-native-google-mobile-ads');

let interstitial: ReturnType<GoogleAdsModule['InterstitialAd']['createForAdRequest']> | null =
  null;
let interstitialLoaded = false;

function loadInterstitial(mod: GoogleAdsModule): void {
  interstitial = mod.InterstitialAd.createForAdRequest(getInterstitialAdUnitId(), {
    requestNonPersonalizedAdsOnly: false,
  });
  interstitialLoaded = false;

  const unsubscribeLoaded = interstitial.addAdEventListener(mod.AdEventType.LOADED, () => {
    interstitialLoaded = true;
  });
  const unsubscribeClosed = interstitial.addAdEventListener(mod.AdEventType.CLOSED, () => {
    unsubscribeLoaded();
    unsubscribeClosed();
    loadInterstitial(mod); // precarga el siguiente
  });

  interstitial.load();
}

export async function initializeAds(): Promise<void> {
  if (isExpoGo) return; // el SDK nativo de AdMob no existe dentro de Expo Go
  const mod = await import('react-native-google-mobile-ads');
  await mod.default().initialize();
  loadInterstitial(mod);
}

/** Llamar cada vez que el usuario cambia de género; muestra un
 * intersticial cada INTERSTITIAL_FREQUENCY cambios, si ya está cargado.
 * No hace nada si el usuario tiene la suscripción premium ni en Expo Go. */
export async function maybeShowInterstitial(): Promise<void> {
  if (isExpoGo) return;
  if (await checkPremiumStatus()) return;
  const count = await incrementGenreChangeCount();
  if (count % INTERSTITIAL_FREQUENCY !== 0) return;
  if (interstitial && interstitialLoaded) {
    interstitial.show();
  }
}
