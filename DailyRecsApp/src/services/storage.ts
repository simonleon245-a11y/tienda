import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenrePreferences } from '@/types';
import { DEFAULT_ACCENT_COLOR } from '@/constants/colors';

const KEYS = {
  genrePrefs: 'recos:genrePrefs',
  cachePrefix: 'recos:cache:',
  genreChangeCount: 'recos:genreChangeCount',
  isPremium: 'recos:isPremium',
  rerollPrefix: 'recos:reroll:',
  accentColor: 'recos:accentColor',
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

export async function getIsPremium(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.isPremium);
  return raw === 'true';
}

export async function setIsPremium(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.isPremium, value ? 'true' : 'false');
}

/** `scopeKey` debe incluir el período (día o mes) para que el contador se
 * reinicie solo al cambiar de período, ej. "album:rock:2026-08-13". */
export async function getRerollCount(scopeKey: string): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.rerollPrefix + scopeKey);
  return raw ? parseInt(raw, 10) : 0;
}

export async function incrementRerollCount(scopeKey: string): Promise<number> {
  const next = (await getRerollCount(scopeKey)) + 1;
  await AsyncStorage.setItem(KEYS.rerollPrefix + scopeKey, String(next));
  return next;
}

export async function getAccentColor(): Promise<string> {
  const raw = await AsyncStorage.getItem(KEYS.accentColor);
  return raw || DEFAULT_ACCENT_COLOR;
}

export async function setAccentColor(hex: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.accentColor, hex);
}
