import { ENV } from '@/utils/env';
import { dailySeed, pickIndex, todayKey } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { MoviePick, WatchProvider } from '@/types';
import { genreLabel, MOVIE_GENRES } from '@/constants/genres';

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

async function fetchDiscoverPage(genreId: string, page: number): Promise<TmdbMovie[]> {
  const url = `${BASE_URL}/discover/movie?api_key=${ENV.TMDB_API_KEY}&with_genres=${encodeURIComponent(
    genreId
  )}&sort_by=popularity.desc&page=${page}&language=es-ES&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDb respondió ${res.status}`);
  }
  const json = await res.json();
  return json?.results ?? [];
}

async function fetchMoviePool(genreId: string): Promise<TmdbMovie[]> {
  const cacheKey = `tmdb-pool:${genreId}:${todayKey()}`;
  const cached = await getCached<TmdbMovie[]>(cacheKey);
  if (cached) return cached;

  if (!ENV.TMDB_API_KEY) {
    throw new Error('Falta TMDB_API_KEY. Configúrala en tu archivo .env (ver .env.example).');
  }

  const pages = await Promise.all(
    Array.from({ length: PAGES_TO_FETCH }, (_, i) => fetchDiscoverPage(genreId, i + 1))
  );
  const pool = pages.flat();
  if (pool.length === 0) {
    throw new Error(`No se encontraron películas para este género.`);
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

export async function getDailyMovie(genreId: string): Promise<MoviePick> {
  const pool = await fetchMoviePool(genreId);
  const index = pickIndex(dailySeed(genreId), pool.length);
  const movie = pool[index];
  const { providers, link } = await fetchWatchProviders(movie.id);

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : '—',
    genre: genreLabel(MOVIE_GENRES, genreId),
    rating: movie.vote_average,
    watchProviders: providers,
    watchProvidersUrl: link,
  };
}
