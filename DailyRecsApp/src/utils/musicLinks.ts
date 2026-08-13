/**
 * Enlaces de búsqueda a Spotify, YouTube Music y Amazon Music para un
 * álbum. No usan las APIs oficiales de esos servicios (evitan tener que
 * pedir y guardar más claves/secrets), así que abren la búsqueda del
 * servicio con "artista + álbum" en vez de apuntar directo al ID exacto
 * del álbum — en la práctica el resultado casi siempre es el primero.
 */

export interface MusicLinks {
  spotifyUrl: string;
  youtubeMusicUrl: string;
  amazonMusicUrl: string;
}

export function buildMusicLinks(artist: string, title: string): MusicLinks {
  const query = encodeURIComponent(`${artist} ${title}`);
  return {
    spotifyUrl: `https://open.spotify.com/search/${query}`,
    youtubeMusicUrl: `https://music.youtube.com/search?q=${query}`,
    amazonMusicUrl: `https://music.amazon.com/search/${query}`,
  };
}
