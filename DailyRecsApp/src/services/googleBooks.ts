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
    language?: string;
  };
}

// Detecta volúmenes/partes sueltas de una obra dividida, ej. "Uncle Tom's
// Cabin (Volume 2 of 2)", "Vol. 1", "Part One", "Tomo 2 de 3".
const PARTIAL_VOLUME_PATTERN =
  /\b(vol(?:ume|umen)?\.?\s*\d+(\s*(of|de)\s*\d+)?|part\s+(one|two|three|four|five|\d+)|tomo\s+\d+(\s*de\s*\d+)?)\b/i;

// Ediciones de accesibilidad/formato especial — válidas para quien las
// necesita, pero no deberían ser la recomendación "por defecto" de un
// género si hay una edición estándar disponible en el mismo pool.
const SPECIAL_FORMAT_PATTERN = /\b(large print|easyread|braille|abridged)\b/i;

function isLowQualityEdition(title: string): boolean {
  return PARTIAL_VOLUME_PATTERN.test(title) || SPECIAL_FORMAT_PATTERN.test(title);
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
  const rawItems: GoogleBookVolume[] = json?.items ?? [];

  // Filtros en cascada: cada uno mejora la calidad del pool, pero si deja
  // la lista vacía (género con poco catálogo), se usa el nivel anterior en
  // vez de fallar — mejor mostrar algo imperfecto que no mostrar nada.

  // 1) Idioma: Google Books no siempre respeta "langRestrict" al 100%.
  const langFiltered = rawItems.filter((item) => item.volumeInfo.language === language);
  const withLanguage = langFiltered.length > 0 ? langFiltered : rawItems;

  // 2) Con sinopsis: un libro sin descripción no sirve como recomendación.
  const withDescription = withLanguage.filter((item) => !!item.volumeInfo.description);
  const withDescriptionOrFallback = withDescription.length > 0 ? withDescription : withLanguage;

  // 3) Sin volúmenes sueltos ni ediciones de accesibilidad/formato especial.
  const qualityFiltered = withDescriptionOrFallback.filter(
    (item) => !isLowQualityEdition(item.volumeInfo.title)
  );
  const items = qualityFiltered.length > 0 ? qualityFiltered : withDescriptionOrFallback;

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
