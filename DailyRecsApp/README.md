# Recos Diarias

App móvil (Android + iOS) que cada día recomienda un **álbum** y una **película**
según el género que elijas, y cada mes recomienda un **libro** según su género.
Incluye notificaciones locales y anuncios (Google AdMob) para monetizar.

Hecha con **React Native + Expo** (TypeScript), un solo código para las dos tiendas.

## ¿Cómo funciona?

- **Álbum del día**: se elige de forma determinista entre álbumes del género
  elegido (vía Last.fm), mismo día + mismo género = mismo álbum. Para evitar
  los superéxitos obvios, la app descarta el centenar de álbumes más
  populares del ranking de Last.fm para ese género y elige entre el resto:
  artistas menos mainstream o emergentes que igual aparecen en el chart del
  género (o sea, con oyentes reales, no ruido aleatorio). Cambia
  automáticamente cada día a medianoche. Ajustable en
  `src/services/lastfm.ts` (constantes `SKIP_PAGES`/`TOTAL_PAGES`).
- **Película del día**: igual, pero con TMDb (The Movie Database).
- **Libro del mes**: igual, pero se recalcula una vez al mes (vía Google Books).
- Los géneros se guardan en el propio teléfono (no hay backend ni cuentas de
  usuario). Puedes cambiar el género de cada categoría en cualquier momento
  desde el botón "Cambiar género".
- Notificaciones locales: una diaria (9:00) avisando del álbum/película del
  día, y una mensual (día 1, 10:00) avisando del libro del mes.
- Anuncios: un banner fijo abajo de la pantalla, y un anuncio intersticial
  cada 3 cambios de género (para no molestar mientras exploras).

## 1. Requisitos

- [Node.js](https://nodejs.org) 18 o superior.
- Cuenta gratuita de [Expo](https://expo.dev) (para compilar con EAS).
- La app **Expo Go** en tu móvil (App Store / Google Play) para probar
  rápido — **excepto** para probar los anuncios reales, que necesitan una
  "development build" (ver paso 5).

## 2. Instalar dependencias

```bash
cd DailyRecsApp
npm install
```

## 3. Configurar tus claves de API (gratis)

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Y rellena estas claves (todas tienen capa gratuita):

| Clave | De dónde sacarla |
|---|---|
| `LASTFM_API_KEY` | https://www.last.fm/api/account/create — crea una "API account", te da la key al instante. |
| `TMDB_API_KEY` | https://www.themoviedb.org/settings/api — crea una cuenta y pide una "API Key (v3 auth)". |
| `GOOGLE_BOOKS_API_KEY` | Opcional. Sin ella la app funciona igual pero con menos peticiones por hora. Se crea en https://console.cloud.google.com/apis/library/books.googleapis.com. |

Sin estas claves la app se abre pero las tarjetas de álbum/película/libro
mostrarán un error pidiéndolas.

## 4. Probar la app

```bash
npm start
```

Escanea el QR con la app **Expo Go** (Android) o con la cámara (iOS). Nota:
en Expo Go los anuncios de AdMob **no** se muestran (requieren código nativo);
para verlos de verdad necesitas una development build (paso 5).

## 5. Configurar Google AdMob (monetización)

1. Crea una cuenta en https://apps.admob.com (gratis).
2. Crea una app para Android y otra para iOS dentro de AdMob, y copia sus
   **App ID** (`ca-app-pub-XXXX~YYYY`).
3. Dentro de cada app, crea un bloque de anuncio **Banner** y uno
   **Intersticial**, y copia sus **Ad Unit ID** (`ca-app-pub-XXXX/ZZZZ`).
4. Pega los 6 valores en tu `.env`:
   `ANDROID_ADMOB_APP_ID`, `IOS_ADMOB_APP_ID`, `ADMOB_BANNER_ANDROID`,
   `ADMOB_BANNER_IOS`, `ADMOB_INTERSTITIAL_ANDROID`, `ADMOB_INTERSTITIAL_IOS`.
5. Mientras no los configures, la app usa automáticamente los **IDs de
   prueba** de Google (no generan ingresos, pero sirven para comprobar que
   el anuncio se ve).

Como `react-native-google-mobile-ads` incluye código nativo, para ver
anuncios reales (no en Expo Go) necesitas una development build:

```bash
npx expo install expo-dev-client
npx eas build --profile development --platform android
# o --platform ios
```

Instala el `.apk`/`.ipa` generado en tu teléfono y ejecuta `npm start` de
nuevo — esta vez abrirá tu development build en vez de Expo Go.

## 6. Publicar en las tiendas (Android + iOS)

1. Crea cuenta gratis en https://expo.dev e inicia sesión:
   ```bash
   npx eas login
   npx eas build:configure
   ```
2. Compila para producción:
   ```bash
   npx eas build --platform android --profile production
   npx eas build --platform ios --profile production
   ```
   (Para iOS necesitas una cuenta de Apple Developer, 99 USD/año. Para
   Android, una cuenta de Google Play Console, pago único de 25 USD.)
3. Sube los builds generados:
   ```bash
   npx eas submit --platform android
   npx eas submit --platform ios
   ```

Toda la documentación oficial de EAS: https://docs.expo.dev/build/introduction/

## Estructura del proyecto

```
DailyRecsApp/
  App.tsx                    Punto de entrada
  app.config.ts               Configuración de Expo (nombre, iconos, plugins)
  src/
    constants/genres.ts       Géneros de música, películas y libros
    types/                    Tipos TypeScript compartidos
    utils/dailySeed.ts        Lógica de "recomendación del día/mes" determinista
    services/
      lastfm.ts                Álbumes por género (Last.fm)
      tmdb.ts                  Películas por género (TMDb)
      googleBooks.ts           Libros por género (Google Books)
      storage.ts               Preferencias de género + caché local
      notifications.ts         Notificaciones locales diarias/mensuales
      ads.ts                   Banner + intersticial (AdMob)
    components/               Tarjetas, selector de género, banner de anuncio
    screens/HomeScreen.tsx    Pantalla principal
```

## Ampliar más adelante

- Añadir más géneros: solo hay que agregar entradas en `src/constants/genres.ts`
  (usa tags válidos de Last.fm, genre IDs de TMDb, o subjects de Google Books).
- Guardar un historial de recomendaciones anteriores (hoy solo se guarda la
  actual).
- Cambiar la hora de las notificaciones: editar `DAILY_HOUR`/`MONTHLY_DAY`/
  `MONTHLY_HOUR` en `src/services/notifications.ts`.
