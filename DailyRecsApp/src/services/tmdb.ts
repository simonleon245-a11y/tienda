import { ENV } from '@/utils/env';
import { dailySeed, pickIndex, todayKey } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { MoviePick } from '@/types';
import { genreLabel, MOVIE_GENRES } from '@/constants/genres';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PAGES_TO_FETCH = 2; // ~40 películas de pool por género

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
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

export async function getDailyMovie(genreId: string): Promise<MoviePick> {
  const pool = await fetchMoviePool(genreId);
  const index = pickIndex(dailySeed(genreId), pool.length);
  const movie = pool[index];

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : '—',
    genre: genreLabel(MOVIE_GENRES, genreId),
    rating: movie.vote_average,
  };
}
