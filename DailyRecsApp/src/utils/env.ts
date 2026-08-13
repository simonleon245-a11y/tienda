import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const ENV = {
  LASTFM_API_KEY: extra.LASTFM_API_KEY ?? '',
  TMDB_API_KEY: extra.TMDB_API_KEY ?? '',
  GOOGLE_BOOKS_API_KEY: extra.GOOGLE_BOOKS_API_KEY ?? '',
  ADMOB_BANNER_ANDROID: extra.ADMOB_BANNER_ANDROID ?? '',
  ADMOB_BANNER_IOS: extra.ADMOB_BANNER_IOS ?? '',
  ADMOB_INTERSTITIAL_ANDROID: extra.ADMOB_INTERSTITIAL_ANDROID ?? '',
  ADMOB_INTERSTITIAL_IOS: extra.ADMOB_INTERSTITIAL_IOS ?? '',
};
