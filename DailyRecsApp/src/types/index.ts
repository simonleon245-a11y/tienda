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
}

export interface MoviePick {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseYear: string;
  genre: string;
  rating: number;
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
