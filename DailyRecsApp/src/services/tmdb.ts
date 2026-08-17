import { ENV } from '@/utils/env';
import { dailySeed, pickIndex, todayKey } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { MoviePick, WatchProvider } from '@/types';
import { Language, translations } from '@/i18n/translations';

const TMDB_LOCALE: Record<Language, string> = { es: 'es-ES', en: 'en-US' };

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PROVIDER_LOGO_BASE = 'https://image.tmdb.org/t/p/w92';
const PAGES_TO_FETCH = 2; // ~40 películas de pool por género
const MAX_PROVIDERS_SHOWN = 6;

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface TmdbWatchProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface TmdbWatchProvidersForRegion {
  link?: string;
  flatrate?: TmdbWatchProviderEntry[];
  rent?: TmdbWatchProviderEntry[];
  buy?: TmdbWatchProviderEntry[];
}

/** Algunos géneros son en realidad "subgéneros": un id de género normal
 * de TMDb + un id de palabra clave (keyword), separados por ":" — por
 * ejemplo '27:283085' es Terror + la keyword "body horror". TMDb no
 * tiene subgéneros como tal, así que esto se resuelve combinando
 * with_genres y with_keywords en la misma búsqueda. */
function parseGenreId(genreId: string): { genre: string; keyword?: string } {
  const [genre, keyword] = genreId.split(':');
  return keyword ? { genre, keyword } : { genre };
}

async function fetchDiscoverPage(
  genreId: string,
  page: number,
  language: Language
): Promise<TmdbMovie[]> {
  const { genre, keyword } = parseGenreId(genreId);
  const keywordParam = keyword ? `&with_keywords=${encodeURIComponent(keyword)}` : '';
  const url = `${BASE_URL}/discover/movie?api_key=${ENV.TMDB_API_KEY}&with_genres=${encodeURIComponent(
    genre
  )}${keywordParam}&sort_by=popularity.desc&page=${page}&language=${TMDB_LOCALE[language]}&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(translations[language].tmdbError(res.status));
  }
  const json = await res.json();
  return json?.results ?? [];
}

async function fetchMoviePool(genreId: string, language: Language): Promise<TmdbMovie[]> {
  const cacheKey = `tmdb-pool:${genreId}:${language}:${todayKey()}`;
  const cached = await getCached<TmdbMovie[]>(cacheKey);
  if (cached) return cached;

  const t = translations[language];
  if (!ENV.TMDB_API_KEY) {
    throw new Error(t.missingTmdbKey);
  }

  const pages = await Promise.all(
    Array.from({ length: PAGES_TO_FETCH }, (_, i) => fetchDiscoverPage(genreId, i + 1, language))
  );
  const pool = pages.flat();
  if (pool.length === 0) {
    throw new Error(t.noMoviesFound);
  }

  await setCached(cacheKey, pool);
  return pool;
}

/** Dónde ver la película: TMDb agrega esta info a partir de JustWatch,
 * gratis con la misma API key. Solo se pide para la película ya elegida
 * del día (no para todo el pool), para no multiplicar las llamadas. */
async function fetchWatchProviders(
  movieId: number
): Promise<{ providers: WatchProvider[]; link: string | null }> {
  const cacheKey = `tmdb-providers:${movieId}:${todayKey()}`;
  const cached = await getCached<{ providers: WatchProvider[]; link: string | null }>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${ENV.TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { providers: [], link: null };
  }
  const json = await res.json();
  const byRegion: Record<string, TmdbWatchProvidersForRegion> = json?.results ?? {};
  const region =
    byRegion[ENV.TMDB_WATCH_REGION] ?? byRegion.US ?? Object.values(byRegion)[0] ?? null;

  if (!region) {
    const empty = { providers: [], link: null };
    await setCached(cacheKey, empty);
    return empty;
  }

  const seen = new Set<number>();
  const providers: WatchProvider[] = [];
  const groups: [TmdbWatchProviderEntry[] | undefined, WatchProvider['type']][] = [
    [region.flatrate, 'flatrate'],
    [region.rent, 'rent'],
    [region.buy, 'buy'],
  ];
  for (const [entries, type] of groups) {
    for (const entry of entries ?? []) {
      if (seen.has(entry.provider_id) || providers.length >= MAX_PROVIDERS_SHOWN) continue;
      seen.add(entry.provider_id);
      providers.push({
        id: entry.provider_id,
        name: entry.provider_name,
        logoUrl: entry.logo_path ? `${PROVIDER_LOGO_BASE}${entry.logo_path}` : null,
        type,
      });
    }
  }

  const result = { providers, link: region.link ?? null };
  await setCached(cacheKey, result);
  return result;
}

export async function getDailyMovie(
  genreId: string,
  variant = 0,
  language: Language = 'es'
): Promise<MoviePick> {
  const pool = await fetchMoviePool(genreId, language);
  const index = pickIndex(dailySeed(genreId, new Date(), variant), pool.length);
  const movie = pool[index];
  const { providers, link } = await fetchWatchProviders(movie.id);

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : '—',
    rating: movie.vote_average,
    watchProviders: providers,
    watchProvidersUrl: link,
  };
}
