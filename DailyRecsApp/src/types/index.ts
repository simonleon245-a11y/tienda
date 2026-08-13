export type Category = 'album' | 'movie' | 'book';

export interface Genre {
  id: string;
  label: string;
}

export interface AlbumPick {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  genre: string;
  lastfmUrl: string;
  spotifyUrl: string;
  youtubeMusicUrl: string;
  amazonMusicUrl: string;
}

export type WatchProviderType = 'flatrate' | 'rent' | 'buy';

export interface WatchProvider {
  id: number;
  name: string;
  logoUrl: string | null;
  type: WatchProviderType;
}

export interface MoviePick {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseYear: string;
  genre: string;
  rating: number;
  watchProviders: WatchProvider[];
  watchProvidersUrl: string | null;
}

export interface BookPick {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  genre: string;
  description: string;
  infoUrl: string;
}

export interface GenrePreferences {
  album: string;
  movie: string;
  book: string;
}
