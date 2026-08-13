# Recos Diarias

App móvil (Android + iOS) que cada día recomienda un **álbum** y una **película**
según el género que elijas, y cada mes recomienda un **libro** según su género.
Incluye notificaciones locales, anuncios (Google AdMob) y una suscripción
premium para monetizar.

Hecha con **React Native + Expo** (TypeScript), un solo código para las dos
plataformas. **No se publica en Google Play ni en la App Store**: se
distribuye como una app web instalable (PWA) desde tu propia página — ver
la sección "Distribución sin tiendas" más abajo.

## ¿Cómo funciona?

- **Álbum del día**: se elige de forma determinista entre álbumes del género
  elegido (vía Last.fm), mismo día + mismo género = mismo álbum. Para evitar
  los superéxitos obvios, la app descarta el centenar de álbumes más
  populares del ranking de Last.fm para ese género y elige entre el resto:
  artistas menos mainstream o emergentes que igual aparecen en el chart del
  género (o sea, con oyentes reales, no ruido aleatorio). Cambia
  automáticamente cada día a medianoche. Ajustable en
  `src/services/lastfm.ts` (constantes `SKIP_PAGES`/`TOTAL_PAGES`).
  Cada álbum trae 3 botones para abrirlo directo en **Spotify**,
  **YouTube Music** y **Amazon Music** (llevan a la búsqueda de "artista +
  álbum" en cada servicio — no requieren claves ni login adicionales).
- **Película del día**: igual, pero con TMDb (The Movie Database). También
  muestra en qué plataformas se puede ver (streaming, alquiler o compra),
  usando los datos de JustWatch que TMDb ya incluye gratis con la misma API
  key. Por defecto busca disponibilidad en EE.UU.; cambia `TMDB_WATCH_REGION`
  en tu `.env` a tu país (`MX`, `ES`, `CO`, `AR`, ...) para ver las
  plataformas correctas de tu región.
- **Libro del mes**: igual, pero se recalcula una vez al mes (vía Google Books).
- Los géneros se guardan en el propio teléfono (no hay backend ni cuentas de
  usuario). Puedes cambiar el género de cada categoría en cualquier momento
  desde el botón "Cambiar género".
- Notificaciones locales: una diaria (9:00) avisando del álbum/película del
  día, y una mensual (día 1, 10:00) avisando del libro del mes.
- Anuncios: un banner fijo abajo de la pantalla, y un anuncio intersticial
  cada 3 cambios de género (para no molestar mientras exploras).
- **Recos Premium ($3/mes)**: sin anuncios + "ver otra opción" ilimitado
  (los usuarios gratis tienen 1 reroll gratis por día/mes en cada
  categoría). Hoy el botón "Suscribirme" es un scaffold local — ver la
  sección "Suscripción premium" más abajo para conectarlo a pagos reales.
- **Color de la app**: botón "🎨 Color" arriba a la derecha. Cinco colores
  básicos disponibles para todos, y ocho colores exclusivos (Oro,
  Esmeralda, Rubí, Zafiro, Amatista, Neón, Bronce, Carmesí) solo para
  suscriptores premium — se ven con candado y, si los tocas sin ser
  premium, invitan a suscribirte. El color elegido se guarda en el
  teléfono y recolorea botones, links y el indicador de carga en toda la
  app. Editable en `src/constants/colors.ts`.

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

## 6. Distribución sin tiendas (PWA)

Como no vamos a subir la app a Google Play ni a la App Store, la forma de
"descargarla desde una página web" es publicarla como **PWA (Progressive
Web App)**: una versión web de la misma app que el usuario agrega a su
pantalla de inicio desde el navegador (Safari en iPhone, Chrome en
Android) y que se ve y se siente como una app instalada — ícono propio,
pantalla completa, funciona sin conexión.

Por qué PWA y no un `.apk`/`.ipa` para descargar directo:
- **Android** sí permite instalar un `.apk` descargado de cualquier web,
  pero **iPhone no** — Apple solo permite instalar apps nativas desde la
  App Store (o con un programa Enterprise, pensado para uso interno de
  empresas, no para el público). La PWA es la única forma real de
  "instalar sin tienda" que funciona igual en ambos.

Pasos, cuando tengas lista la web donde se va a alojar (dímelo cuando la
tengas y conecto esto ahí):
1. `npx expo export --platform web` genera la versión web de la app en
   `dist/`.
2. Esa carpeta se sube tal cual a tu hosting (Vercel, Netlify, o el que
   uses para tu web).
3. Se agrega un `manifest.json` (nombre, ícono, colores) y un service
   worker para que el navegador ofrezca "Agregar a pantalla de inicio" —
   Expo genera la mayor parte de esto automáticamente al exportar para web.
4. Nota importante: los anuncios de AdMob (paso 5) **no** funcionan dentro
   de la versión web/PWA, solo en apps nativas. Si además quieres ofrecer
   un `.apk` de Android descargable (con AdMob funcionando) como opción
   adicional para quien prefiera instalar la app nativa, se genera con
   `npx eas build --platform android --profile preview` (queda un `.apk`
   descargable, sin pasar por Google Play).

Ya probé que `npx expo start --web` carga la app completa en el navegador
sin errores (pantalla, tarjetas, selector de género, tarjeta premium, todo
funcionando). Para que compile en web hubo que resolver dos cosas propias
de mezclar código nativo con web, ya corregidas en el repo:
- `src/services/ads.web.ts` y `src/components/BannerAd.web.tsx`: versiones
  "vacías" (no-op) de los archivos de AdMob que Metro usa automáticamente
  al compilar para web en vez de las versiones nativas (Metro/Expo elige
  el archivo `.web.ts`/`.web.tsx` sobre el normal en builds web) — así el
  SDK nativo de anuncios nunca se intenta empaquetar para el navegador.
- `src/utils/alert.ts`: `Alert.alert` de React Native no muestra nada en
  web; este helper usa `Alert.alert` en Android/iOS y
  `window.confirm`/`window.alert` en web, para que los avisos (límite de
  reroll gratis, suscripción no configurada) se vean en las tres
  plataformas.

## 7. Suscripción premium ($3/mes, sin tiendas)

Como la app no está en las tiendas, tampoco usamos sus sistemas de compra
(Apple/Google IAP) — lo más simple es cobrar con **Stripe** directamente
desde tu página web (evita también su comisión del 15-30%).

Hoy el código ya está listo del lado de la app (`src/services/premium.ts`):
- Si el usuario es premium, no ve anuncios y tiene "ver otra opción"
  ilimitado (los usuarios gratis tienen 1 uso gratis por día/mes en cada
  categoría).
- El botón "Suscribirme" abre `PREMIUM_CHECKOUT_URL` (variable en tu
  `.env`) — hoy está vacía, así que el botón avisa que aún no está
  disponible.

Lo que falta, y que arma junto con tu página web:
1. Un **Stripe Checkout** (link de pago de $3/mes) — se crea en pocos
   minutos desde el dashboard de Stripe sin escribir código.
2. Un pequeño backend (una función serverless en la misma web, por
   ejemplo con Vercel) con dos tareas: recibir el webhook de Stripe
   cuando alguien paga, y responder "¿este usuario es premium?" cuando la
   app se lo pregunte. Como la app no tiene login, lo más simple es pedir
   el email con el que se suscribió (igual que "restaurar compra" en
   otras apps) para verificarlo contra Stripe.
3. Conectar `PREMIUM_CHECKOUT_URL` a ese link de pago, y reemplazar
   `checkPremiumStatus()` en `src/services/premium.ts` para que consulte
   ese backend en vez de solo la bandera guardada en el teléfono.

Beneficios incluidos hoy en el plan premium (y por qué):
- **Sin anuncios**: el beneficio más pedido en cualquier app con ads.
- **"Ver otra opción" ilimitado**: la razón de ser de la suscripción — a
  quien le gusta explorar mucho música/cine/libros, el límite gratis de 1
  por día se queda corto.
- **Acceso anticipado a nuevas funciones/géneros**: cuesta poco dar y
  genera sensación de exclusividad.
- **Colores exclusivos**: 8 colores premium para personalizar la app,
  además de los 5 básicos gratis — ya implementado (`src/constants/colors.ts`).

Ideas para sumar más adelante (no implementadas todavía, quedan fáciles de
agregar sobre esta base):
- **Historial**: guardar los últimos 30 álbumes/películas/libros
  recomendados para poder revisarlos — hoy solo se guarda la recomendación
  actual.
- **Multi-género**: ver una recomendación por cada género favorito a la
  vez, en vez de uno solo.
- **Hora de notificación personalizable**: elegir a qué hora llega el
  aviso diario en vez de la hora fija (9:00).

## Estructura del proyecto

```
DailyRecsApp/
  App.tsx                    Punto de entrada
  app.config.ts               Configuración de Expo (nombre, iconos, plugins)
  src/
    constants/
      genres.ts               Géneros de música, películas y libros
      colors.ts                Paleta de colores básicos y premium
    types/                    Tipos TypeScript compartidos
    utils/
      dailySeed.ts             Lógica de "recomendación del día/mes" determinista
      musicLinks.ts            Links de búsqueda a Spotify/YT Music/Amazon Music
      alert.ts                 Alert.alert multiplataforma (incluye web)
    services/
      lastfm.ts                Álbumes por género (Last.fm)
      tmdb.ts                  Películas + dónde verlas por género (TMDb)
      googleBooks.ts           Libros por género (Google Books)
      storage.ts               Preferencias, color, caché local y contadores de reroll
      notifications.ts         Notificaciones locales diarias/mensuales
      ads.ts / ads.web.ts      Banner + intersticial (AdMob; no-op en web)
      premium.ts               Suscripción premium (scaffold, ver sección 7)
    components/               Tarjetas, selector de género, selector de color,
                                banner de anuncio, links de música, dónde ver,
                                tarjeta premium
    screens/HomeScreen.tsx    Pantalla principal
```

## Ampliar más adelante

- Añadir más géneros: solo hay que agregar entradas en `src/constants/genres.ts`
  (usa tags válidos de Last.fm, genre IDs de TMDb, o subjects de Google Books).
- Cambiar la hora de las notificaciones: editar `DAILY_HOUR`/`MONTHLY_DAY`/
  `MONTHLY_HOUR` en `src/services/notifications.ts`.
- Ver la sección 7 para las ideas de historial, multi-género y demás
  beneficios premium pendientes de construir.
