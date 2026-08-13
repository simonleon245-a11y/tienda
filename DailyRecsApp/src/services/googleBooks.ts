import { ENV } from '@/utils/env';
import { monthKey, monthlySeed, pickIndex } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { BookPick } from '@/types';
import { genreLabel, BOOK_GENRES } from '@/constants/genres';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const POOL_SIZE = 40;

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    infoLink?: string;
  };
}

async function fetchBookPool(subject: string): Promise<GoogleBookVolume[]> {
  const cacheKey = `googlebooks-pool:${subject}:${monthKey()}`;
  const cached = await getCached<GoogleBookVolume[]>(cacheKey);
  if (cached) return cached;

  const keyParam = ENV.GOOGLE_BOOKS_API_KEY ? `&key=${ENV.GOOGLE_BOOKS_API_KEY}` : '';
  const url = `${BASE_URL}?q=subject:${encodeURIComponent(
    subject
  )}&orderBy=relevance&maxResults=${POOL_SIZE}&printType=books&langRestrict=es${keyParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Books respondió ${res.status}`);
  }
  const json = await res.json();
  const items: GoogleBookVolume[] = json?.items ?? [];
  if (items.length === 0) {
    throw new Error(`No se encontraron libros para este género.`);
  }

  await setCached(cacheKey, items);
  return items;
}

export async function getMonthlyBook(genreId: string): Promise<BookPick> {
  const pool = await fetchBookPool(genreId);
  const index = pickIndex(monthlySeed(genreId), pool.length);
  const book = pool[index];
  const info = book.volumeInfo;

  return {
    id: book.id,
    title: info.title,
    authors: info.authors ?? ['Autor desconocido'],
    coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
    genre: genreLabel(BOOK_GENRES, genreId),
    description: info.description ?? 'Sin descripción disponible.',
    infoUrl: info.infoLink ?? '',
  };
}
