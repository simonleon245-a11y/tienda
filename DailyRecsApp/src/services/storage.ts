import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenrePreferences } from '@/types';

const KEYS = {
  genrePrefs: 'recos:genrePrefs',
  cachePrefix: 'recos:cache:',
  genreChangeCount: 'recos:genreChangeCount',
};

const DEFAULT_PREFS: GenrePreferences = {
  album: 'rock',
  movie: '18', // Drama
  book: 'fiction',
};

export async function getGenrePreferences(): Promise<GenrePreferences> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.genrePrefs);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export async function setGenrePreference(
  category: keyof GenrePreferences,
  genreId: string
): Promise<GenrePreferences> {
  const current = await getGenrePreferences();
  const next = { ...current, [category]: genreId };
  await AsyncStorage.setItem(KEYS.genrePrefs, JSON.stringify(next));
  return next;
}

/** Cache genérica con expiración, usada para no repetir llamadas a las APIs
 * mientras la recomendación del día/mes siga siendo válida. */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.cachePrefix + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(KEYS.cachePrefix + key, JSON.stringify(value));
}

export async function incrementGenreChangeCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.genreChangeCount);
  const next = (raw ? parseInt(raw, 10) : 0) + 1;
  await AsyncStorage.setItem(KEYS.genreChangeCount, String(next));
  return next;
}
