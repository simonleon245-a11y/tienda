import { ENV } from '@/utils/env';
import { monthKey, monthlySeed, pickIndex } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { BookPick } from '@/types';
import { Language, translations } from '@/i18n/translations';

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

async function fetchBookPool(subject: string, language: Language): Promise<GoogleBookVolume[]> {
  const cacheKey = `googlebooks-pool:${subject}:${language}:${monthKey()}`;
  const cached = await getCached<GoogleBookVolume[]>(cacheKey);
  if (cached) return cached;

  const t = translations[language];
  const keyParam = ENV.GOOGLE_BOOKS_API_KEY ? `&key=${ENV.GOOGLE_BOOKS_API_KEY}` : '';
  const url = `${BASE_URL}?q=subject:${encodeURIComponent(
    subject
  )}&orderBy=relevance&maxResults=${POOL_SIZE}&printType=books&langRestrict=${language}${keyParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(t.googleBooksError(res.status));
  }
  const json = await res.json();
  const items: GoogleBookVolume[] = json?.items ?? [];
  if (items.length === 0) {
    throw new Error(t.noBooksFound);
  }

  await setCached(cacheKey, items);
  return items;
}

export async function getMonthlyBook(
  genreId: string,
  variant = 0,
  language: Language = 'es'
): Promise<BookPick> {
  const pool = await fetchBookPool(genreId, language);
  const index = pickIndex(monthlySeed(genreId, new Date(), variant), pool.length);
  const book = pool[index];
  const info = book.volumeInfo;
  const t = translations[language];

  return {
    id: book.id,
    title: info.title,
    authors: info.authors ?? [t.unknownAuthor],
    coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
    description: info.description ?? t.noDescriptionAvailable,
    infoUrl: info.infoLink ?? '',
  };
}
