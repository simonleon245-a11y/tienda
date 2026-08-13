export type Language = 'es' | 'en';

export interface UIStrings {
  appTitle: string;
  appSubtitle: string;
  colorButtonLabel: string;
  languageButtonLabel: string;
  albumTitle: string;
  albumFrequency: string;
  movieTitle: string;
  movieFrequency: string;
  bookTitle: string;
  bookFrequency: (days: number) => string;
  noSynopsis: string;
  retry: string;
  reroll: string;
  changeGenre: string;
  close: string;
  musicGenreModalTitle: string;
  movieGenreModalTitle: string;
  bookGenreModalTitle: string;
  colorModalTitle: string;
  basicColors: string;
  premiumColors: string;
  languageModalTitle: string;
  premiumCardTitle: string;
  premiumPrice: string;
  premiumBenefits: string[];
  subscribeButton: string;
  subscriptionUnavailableTitle: string;
  subscriptionNotConfigured: string;
  rerollCapTitle: string;
  rerollCapMessage: string;
  cancelAction: string;
  viewPremiumAction: string;
  lockedColorTitle: string;
  lockedColorMessage: string;
  noProvidersFound: string;
  watchProviderType: { flatrate: string; rent: string; buy: string };
  missingLastfmKey: string;
  missingTmdbKey: string;
  lastfmError: (status: number) => string;
  tmdbError: (status: number) => string;
  googleBooksError: (status: number) => string;
  noAlbumsFound: (genre: string) => string;
  noMoviesFound: string;
  noBooksFound: string;
  unknownArtist: string;
  unknownAuthor: string;
  noDescriptionAvailable: string;
  notificationChannelName: string;
  dailyNotificationTitle: string;
  dailyNotificationBody: string;
  monthlyNotificationTitle: string;
  monthlyNotificationBody: string;
}

export const translations: Record<Language, UIStrings> = {
  es: {
    appTitle: 'Tus recomendaciones',
    appSubtitle: 'Elige un género en cada categoría y descubre algo nuevo.',
    colorButtonLabel: 'Color',
    languageButtonLabel: 'Idioma',
    albumTitle: 'Álbum del día',
    albumFrequency: 'Nuevo cada día · poco mainstream',
    movieTitle: 'Película del día',
    movieFrequency: 'Nueva cada día',
    bookTitle: 'Libro del mes',
    bookFrequency: (days) => `Nuevo en ${days} días`,
    noSynopsis: 'Sin sinopsis disponible.',
    retry: 'Reintentar',
    reroll: '🔀 Ver otra opción',
    changeGenre: 'Cambiar género',
    close: 'Cerrar',
    musicGenreModalTitle: 'Género musical',
    movieGenreModalTitle: 'Género de película',
    bookGenreModalTitle: 'Género de libro',
    colorModalTitle: 'Color de la app',
    basicColors: 'Básicos',
    premiumColors: 'Premium ✨',
    languageModalTitle: 'Idioma de la app',
    premiumCardTitle: 'Recos Premium',
    premiumPrice: '$3 USD / mes',
    premiumBenefits: [
      'Cero anuncios (ni banner ni intersticial)',
      '"Ver otra opción" ilimitado en álbum, película y libro',
      'Colores exclusivos para personalizar la app',
      'Acceso anticipado a nuevos géneros y funciones',
    ],
    subscribeButton: 'Suscribirme',
    subscriptionUnavailableTitle: 'Suscripción no disponible todavía',
    subscriptionNotConfigured:
      'La suscripción todavía no está configurada (falta PREMIUM_CHECKOUT_URL en .env).',
    rerollCapTitle: 'Ya usaste tu "ver otra opción" gratis',
    rerollCapMessage:
      'Con Recos Premium tienes recomendaciones ilimitadas y sin anuncios por $3/mes.',
    cancelAction: 'Ahora no',
    viewPremiumAction: 'Ver Premium',
    lockedColorTitle: 'Color exclusivo de Recos Premium',
    lockedColorMessage:
      'Con Recos Premium desbloqueas esta paleta, sin anuncios y "ver otra opción" ilimitado, por $3/mes.',
    noProvidersFound: 'No encontramos dónde verla en tu región todavía.',
    watchProviderType: { flatrate: 'Streaming', rent: 'Alquiler', buy: 'Compra' },
    missingLastfmKey: 'Falta LASTFM_API_KEY. Configúrala en tu archivo .env (ver .env.example).',
    missingTmdbKey: 'Falta TMDB_API_KEY. Configúrala en tu archivo .env (ver .env.example).',
    lastfmError: (status) => `Last.fm respondió ${status}`,
    tmdbError: (status) => `TMDb respondió ${status}`,
    googleBooksError: (status) => `Google Books respondió ${status}`,
    noAlbumsFound: (genre) => `No se encontraron álbumes para el género "${genre}".`,
    noMoviesFound: 'No se encontraron películas para este género.',
    noBooksFound: 'No se encontraron libros para este género.',
    unknownArtist: 'Desconocido',
    unknownAuthor: 'Autor desconocido',
    noDescriptionAvailable: 'Sin descripción disponible.',
    notificationChannelName: 'Recomendaciones diarias',
    dailyNotificationTitle: 'Tu álbum y película del día ya están listos 🎵🎬',
    dailyNotificationBody: 'Abre la app para descubrir las recomendaciones de hoy.',
    monthlyNotificationTitle: 'Nuevo libro del mes disponible 📚',
    monthlyNotificationBody: 'Ya tienes una nueva recomendación de lectura para este mes.',
  },
  en: {
    appTitle: 'Your recommendations',
    appSubtitle: 'Pick a genre in each category and discover something new.',
    colorButtonLabel: 'Color',
    languageButtonLabel: 'Language',
    albumTitle: "Today's album",
    albumFrequency: 'New every day · off the mainstream',
    movieTitle: "Today's movie",
    movieFrequency: 'New every day',
    bookTitle: "This month's book",
    bookFrequency: (days) => `New in ${days} days`,
    noSynopsis: 'No synopsis available.',
    retry: 'Retry',
    reroll: '🔀 See another option',
    changeGenre: 'Change genre',
    close: 'Close',
    musicGenreModalTitle: 'Music genre',
    movieGenreModalTitle: 'Movie genre',
    bookGenreModalTitle: 'Book genre',
    colorModalTitle: 'App color',
    basicColors: 'Basic',
    premiumColors: 'Premium ✨',
    languageModalTitle: 'App language',
    premiumCardTitle: 'Recos Premium',
    premiumPrice: '$3 USD / month',
    premiumBenefits: [
      'Zero ads (no banner, no interstitial)',
      'Unlimited "see another option" for albums, movies and books',
      'Exclusive colors to personalize the app',
      'Early access to new genres and features',
    ],
    subscribeButton: 'Subscribe',
    subscriptionUnavailableTitle: 'Subscription not available yet',
    subscriptionNotConfigured:
      "The subscription isn't set up yet (missing PREMIUM_CHECKOUT_URL in .env).",
    rerollCapTitle: 'You already used today\'s free "see another option"',
    rerollCapMessage: 'Recos Premium gives you unlimited recommendations and no ads for $3/month.',
    cancelAction: 'Not now',
    viewPremiumAction: 'See Premium',
    lockedColorTitle: 'Recos Premium exclusive color',
    lockedColorMessage:
      'Recos Premium unlocks this palette, no ads and unlimited "see another option", for $3/month.',
    noProvidersFound: "We couldn't find where to watch this in your region yet.",
    watchProviderType: { flatrate: 'Streaming', rent: 'Rent', buy: 'Buy' },
    missingLastfmKey: 'Missing LASTFM_API_KEY. Set it in your .env file (see .env.example).',
    missingTmdbKey: 'Missing TMDB_API_KEY. Set it in your .env file (see .env.example).',
    lastfmError: (status) => `Last.fm responded ${status}`,
    tmdbError: (status) => `TMDb responded ${status}`,
    googleBooksError: (status) => `Google Books responded ${status}`,
    noAlbumsFound: (genre) => `No albums found for the "${genre}" genre.`,
    noMoviesFound: 'No movies found for this genre.',
    noBooksFound: 'No books found for this genre.',
    unknownArtist: 'Unknown',
    unknownAuthor: 'Unknown author',
    noDescriptionAvailable: 'No description available.',
    notificationChannelName: 'Daily recommendations',
    dailyNotificationTitle: "Today's album and movie are ready 🎵🎬",
    dailyNotificationBody: 'Open the app to see today\'s recommendations.',
    monthlyNotificationTitle: 'New book of the month available 📚',
    monthlyNotificationBody: "You've got a new reading recommendation for this month.",
  },
};
