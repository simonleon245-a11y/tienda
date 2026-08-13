import { Genre } from '@/types';

// Los "id" de música son tags de Last.fm (minúsculas, tal como los espera su API).
export const MUSIC_GENRES: Genre[] = [
  { id: 'rock', label: 'Rock' },
  { id: 'pop', label: 'Pop' },
  { id: 'hip hop', label: 'Hip-Hop' },
  { id: 'r&b', label: 'R&B' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'electronic', label: 'Electrónica' },
  { id: 'classical', label: 'Clásica' },
  { id: 'reggae', label: 'Reggae' },
  { id: 'reggaeton', label: 'Reggaetón' },
  { id: 'metal', label: 'Metal' },
  { id: 'indie', label: 'Indie' },
  { id: 'folk', label: 'Folk' },
  { id: 'country', label: 'Country' },
  { id: 'punk', label: 'Punk' },
  { id: 'latin', label: 'Latina' },
];

// Los "id" de películas son los genre_id oficiales de TMDb.
export const MOVIE_GENRES: Genre[] = [
  { id: '28', label: 'Acción' },
  { id: '12', label: 'Aventura' },
  { id: '16', label: 'Animación' },
  { id: '35', label: 'Comedia' },
  { id: '80', label: 'Crimen' },
  { id: '99', label: 'Documental' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Familiar' },
  { id: '14', label: 'Fantasía' },
  { id: '36', label: 'Historia' },
  { id: '27', label: 'Terror' },
  { id: '9648', label: 'Misterio' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Ciencia ficción' },
  { id: '53', label: 'Suspenso' },
  { id: '10752', label: 'Bélica' },
];

// Los "id" de libros son subjects/categorías tal como los busca Google Books.
export const BOOK_GENRES: Genre[] = [
  { id: 'fiction', label: 'Ficción' },
  { id: 'fantasy', label: 'Fantasía' },
  { id: 'mystery', label: 'Misterio' },
  { id: 'romance', label: 'Romance' },
  { id: 'science fiction', label: 'Ciencia ficción' },
  { id: 'thriller', label: 'Suspenso' },
  { id: 'horror', label: 'Terror' },
  { id: 'biography', label: 'Biografía' },
  { id: 'history', label: 'Historia' },
  { id: 'self-help', label: 'Autoayuda' },
  { id: 'poetry', label: 'Poesía' },
  { id: 'young adult fiction', label: 'Juvenil' },
];

export function genreLabel(list: Genre[], id: string): string {
  return list.find((g) => g.id === id)?.label ?? id;
}
