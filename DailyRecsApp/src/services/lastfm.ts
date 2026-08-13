import { ENV } from '@/utils/env';
import { dailySeed, pickIndex, todayKey } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { AlbumPick } from '@/types';
import { buildMusicLinks } from '@/utils/musicLinks';
import { Language, translations } from '@/i18n/translations';

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Last.fm ordena tag.gettopalbums por popularidad (rank 1 = más escuchado).
// Para priorizar bandas menos conocidas / emergentes, traemos un pool grande
// y descartamos el tramo más mainstream (los primeros PAGE_SIZE*SKIP_PAGES
// puestos del ranking), quedándonos con el resto: siguen siendo álbumes
// relevantes para el género (aparecen en el chart), pero no los hits obvios.
const PAGE_SIZE = 50;
const TOTAL_PAGES = 6; // pool bruto de hasta 300 álbumes
const SKIP_PAGES = 1; // descarta el primer centenar más popular (rank 1-50)

interface LastfmImage {
  '#text': string;
  size: string;
}

interface LastfmAlbum {
  name: string;
  artist: { name: string } | string;
  image?: LastfmImage[];
  mbid?: string;
  url: string;
}

function bestImage(images?: LastfmImage[]): string | null {
  if (!images || images.length === 0) return null;
  const preferred =
    images.find((i) => i.size === 'mega') ??
    images.find((i) => i.size === 'extralarge') ??
    images[images.length - 1];
  return preferred?.['#text'] || null;
}

function artistNameOf(album: LastfmAlbum): string {
  return typeof album.artist === 'string' ? album.artist : album.artist?.name ?? '';
}

async function fetchTopAlbumsPage(
  tag: string,
  page: number,
  language: Language
): Promise<LastfmAlbum[]> {
  const url = `${BASE_URL}?method=tag.gettopalbums&tag=${encodeURIComponent(
    tag
  )}&api_key=${ENV.LASTFM_API_KEY}&format=json&limit=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(translations[language].lastfmError(res.status));
  }
  const json = await res.json();
  return json?.topalbums?.album ?? [];
}

/** Quita duplicados por artista para que el pool final no esté dominado
 * por una sola banda con varios álbumes en el chart. */
function dedupeByArtist(albums: LastfmAlbum[]): LastfmAlbum[] {
  const seen = new Set<string>();
  const result: LastfmAlbum[] = [];
  for (const album of albums) {
    const key = artistNameOf(album).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(album);
  }
  return result;
}

async function fetchTopAlbumsPool(tag: string, language: Language): Promise<LastfmAlbum[]> {
  const cacheKey = `lastfm-pool:${tag}:${todayKey()}`;
  const cached = await getCached<LastfmAlbum[]>(cacheKey);
  if (cached) return cached;

  const t = translations[language];
  if (!ENV.LASTFM_API_KEY) {
    throw new Error(t.missingLastfmKey);
  }

  const pages = await Promise.all(
    Array.from({ length: TOTAL_PAGES }, (_, i) => fetchTopAlbumsPage(tag, i + 1, language))
  );
  const rawPool = pages.flat();
  if (rawPool.length === 0) {
    throw new Error(t.noAlbumsFound(tag));
  }

  const underground = dedupeByArtist(rawPool.slice(SKIP_PAGES * PAGE_SIZE));
  // Si el género tiene poco catálogo en Last.fm y el tramo "menos mainstream"
  // queda vacío, mejor mostrar algo (todo el pool deduplicado) que fallar.
  const pool = underground.length > 0 ? underground : dedupeByArtist(rawPool);

  await setCached(cacheKey, pool);
  return pool;
}

export async function getDailyAlbum(
  genreId: string,
  variant = 0,
  language: Language = 'es'
): Promise<AlbumPick> {
  const pool = await fetchTopAlbumsPool(genreId, language);
  const index = pickIndex(dailySeed(genreId, new Date(), variant), pool.length);
  const album = pool[index];
  const artistName = artistNameOf(album) || translations[language].unknownArtist;

  return {
    id: album.mbid || `${album.name}-${artistName}`,
    title: album.name,
    artist: artistName,
    coverUrl: bestImage(album.image),
    lastfmUrl: album.url,
    ...buildMusicLinks(artistName, album.name),
  };
}
