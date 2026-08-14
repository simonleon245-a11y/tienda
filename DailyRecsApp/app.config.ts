import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const ANDROID_ADMOB_APP_ID =
  process.env.ANDROID_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713'; // Google test App ID
const IOS_ADMOB_APP_ID =
  process.env.IOS_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~1458002511'; // Google test App ID

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Recos Diarias',
  slug: 'recos-diarias',
  owner: 'burudeon',
  scheme: 'recosdiarias',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#5B21B6',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.recosdiarias.app',
    infoPlist: {
      GADApplicationIdentifier: IOS_ADMOB_APP_ID,
      UIBackgroundModes: ['remote-notification'],
    },
  },
  android: {
    package: 'com.recosdiarias.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#5B21B6',
    },
    permissions: ['com.google.android.gms.permission.AD_ID'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#5B21B6',
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: ANDROID_ADMOB_APP_ID,
        iosAppId: IOS_ADMOB_APP_ID,
      },
    ],
  ],
  extra: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY || '',
    TMDB_API_KEY: process.env.TMDB_API_KEY || '',
    TMDB_WATCH_REGION: process.env.TMDB_WATCH_REGION || 'US',
    GOOGLE_BOOKS_API_KEY: process.env.GOOGLE_BOOKS_API_KEY || '',
    ADMOB_BANNER_ANDROID: process.env.ADMOB_BANNER_ANDROID || '',
    ADMOB_BANNER_IOS: process.env.ADMOB_BANNER_IOS || '',
    ADMOB_INTERSTITIAL_ANDROID: process.env.ADMOB_INTERSTITIAL_ANDROID || '',
    ADMOB_INTERSTITIAL_IOS: process.env.ADMOB_INTERSTITIAL_IOS || '',
    ADSENSE_CLIENT_ID: process.env.ADSENSE_CLIENT_ID || '',
    ADSENSE_SLOT_ID: process.env.ADSENSE_SLOT_ID || '',
    FORMSPREE_ENDPOINT: process.env.FORMSPREE_ENDPOINT || '',
    PREMIUM_CHECKOUT_URL: process.env.PREMIUM_CHECKOUT_URL || '',
    PREMIUM_LIFETIME_CHECKOUT_URL: process.env.PREMIUM_LIFETIME_CHECKOUT_URL || '',
    TIP_CHECKOUT_URL: process.env.TIP_CHECKOUT_URL || '',
    eas: {
      // Fijo (no depende del .env) porque el CLI de EAS no puede
      // escribir este valor solo en un app.config.ts dinámico.
      projectId: process.env.EAS_PROJECT_ID || '5254fde2-1975-406c-b90a-f9655b17f909',
    },
  },
});
