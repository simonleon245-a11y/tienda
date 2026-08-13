import { ENV } from '@/utils/env';
import { dailySeed, pickIndex, todayKey } from '@/utils/dailySeed';
import { getCached, setCached } from './storage';
import { AlbumPick } from '@/types';

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const POOL_SIZE = 50;

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

async function fetchTopAlbumsPool(tag: string): Promise<LastfmAlbum[]> {
  const cacheKey = `lastfm-pool:${tag}:${todayKey()}`;
  const cached = await getCached<LastfmAlbum[]>(cacheKey);
  if (cached) return cached;

  if (!ENV.LASTFM_API_KEY) {
    throw new Error(
      'Falta LASTFM_API_KEY. Configúrala en tu archivo .env (ver .env.example).'
    );
  }

  const url = `${BASE_URL}?method=tag.gettopalbums&tag=${encodeURIComponent(
    tag
  )}&api_key=${ENV.LASTFM_API_KEY}&format=json&limit=${POOL_SIZE}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Last.fm respondió ${res.status}`);
  }
  const json = await res.json();
  const albums: LastfmAlbum[] = json?.topalbums?.album ?? [];
  if (albums.length === 0) {
    throw new Error(`No se encontraron álbumes para el género "${tag}".`);
  }

  await setCached(cacheKey, albums);
  return albums;
}

export async function getDailyAlbum(genreId: string): Promise<AlbumPick> {
  const pool = await fetchTopAlbumsPool(genreId);
  const index = pickIndex(dailySeed(genreId), pool.length);
  const album = pool[index];
  const artistName =
    typeof album.artist === 'string' ? album.artist : album.artist?.name ?? 'Desconocido';

  return {
    id: album.mbid || `${album.name}-${artistName}`,
    title: album.name,
    artist: artistName,
    coverUrl: bestImage(album.image),
    genre: genreId,
    lastfmUrl: album.url,
  };
}
