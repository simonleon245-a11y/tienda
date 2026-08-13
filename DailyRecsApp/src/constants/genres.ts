import { Genre } from '@/types';
import { Language } from '@/i18n/translations';

// Los "id" de música son tags de Last.fm (minúsculas, tal como los espera su API).
export const MUSIC_GENRES: Genre[] = [
  { id: 'rock', label: { es: 'Rock', en: 'Rock' } },
  { id: 'pop', label: { es: 'Pop', en: 'Pop' } },
  { id: 'hip hop', label: { es: 'Hip-Hop', en: 'Hip-Hop' } },
  { id: 'r&b', label: { es: 'R&B', en: 'R&B' } },
  { id: 'jazz', label: { es: 'Jazz', en: 'Jazz' } },
  { id: 'electronic', label: { es: 'Electrónica', en: 'Electronic' } },
  { id: 'classical', label: { es: 'Clásica', en: 'Classical' } },
  { id: 'reggae', label: { es: 'Reggae', en: 'Reggae' } },
  { id: 'reggaeton', label: { es: 'Reggaetón', en: 'Reggaeton' } },
  { id: 'metal', label: { es: 'Metal', en: 'Metal' } },
  { id: 'indie', label: { es: 'Indie', en: 'Indie' } },
  { id: 'folk', label: { es: 'Folk', en: 'Folk' } },
  { id: 'country', label: { es: 'Country', en: 'Country' } },
  { id: 'punk', label: { es: 'Punk', en: 'Punk' } },
  { id: 'latin', label: { es: 'Latina', en: 'Latin' } },
];

// Los "id" de películas son los genre_id oficiales de TMDb.
export const MOVIE_GENRES: Genre[] = [
  { id: '28', label: { es: 'Acción', en: 'Action' } },
  { id: '12', label: { es: 'Aventura', en: 'Adventure' } },
  { id: '16', label: { es: 'Animación', en: 'Animation' } },
  { id: '35', label: { es: 'Comedia', en: 'Comedy' } },
  { id: '80', label: { es: 'Crimen', en: 'Crime' } },
  { id: '99', label: { es: 'Documental', en: 'Documentary' } },
  { id: '18', label: { es: 'Drama', en: 'Drama' } },
  { id: '10751', label: { es: 'Familiar', en: 'Family' } },
  { id: '14', label: { es: 'Fantasía', en: 'Fantasy' } },
  { id: '36', label: { es: 'Historia', en: 'History' } },
  { id: '27', label: { es: 'Terror', en: 'Horror' } },
  { id: '9648', label: { es: 'Misterio', en: 'Mystery' } },
  { id: '10749', label: { es: 'Romance', en: 'Romance' } },
  { id: '878', label: { es: 'Ciencia ficción', en: 'Science Fiction' } },
  { id: '53', label: { es: 'Suspenso', en: 'Thriller' } },
  { id: '10752', label: { es: 'Bélica', en: 'War' } },
];

// Los "id" de libros son subjects/categorías tal como los busca Google Books.
export const BOOK_GENRES: Genre[] = [
  { id: 'fiction', label: { es: 'Ficción', en: 'Fiction' } },
  { id: 'fantasy', label: { es: 'Fantasía', en: 'Fantasy' } },
  { id: 'mystery', label: { es: 'Misterio', en: 'Mystery' } },
  { id: 'romance', label: { es: 'Romance', en: 'Romance' } },
  { id: 'science fiction', label: { es: 'Ciencia ficción', en: 'Science Fiction' } },
  { id: 'thriller', label: { es: 'Suspenso', en: 'Thriller' } },
  { id: 'horror', label: { es: 'Terror', en: 'Horror' } },
  { id: 'biography', label: { es: 'Biografía', en: 'Biography' } },
  { id: 'history', label: { es: 'Historia', en: 'History' } },
  { id: 'self-help', label: { es: 'Autoayuda', en: 'Self-Help' } },
  { id: 'poetry', label: { es: 'Poesía', en: 'Poetry' } },
  { id: 'young adult fiction', label: { es: 'Juvenil', en: 'Young Adult' } },
];

export function genreLabel(list: Genre[], id: string, language: Language): string {
  return list.find((g) => g.id === id)?.label[language] ?? id;
}
