import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Expo Go no incluye módulos nativos de terceros (como el SDK de AdMob),
 * solo los que vienen con Expo por defecto. Si intentamos usar
 * react-native-google-mobile-ads ahí, la app crashea entera con
 * "TurboModuleRegistry.getEnforcing... could not be found". Los anuncios
 * reales solo funcionan en una development build o en el build final
 * (ver README, sección 5).
 */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
