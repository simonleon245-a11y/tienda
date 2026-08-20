import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenrePreferences, SavedItem } from '@/types';
import { DEFAULT_ACCENT_COLOR } from '@/constants/colors';
import { Language } from '@/i18n/translations';

const KEYS = {
  genrePrefs: 'recos:genrePrefs',
  cachePrefix: 'recos:cache:',
  genreChangeCount: 'recos:genreChangeCount',
  isPremium: 'recos:isPremium',
  premiumEmail: 'recos:premiumEmail',
  rerollPrefix: 'recos:reroll:',
  accentColor: 'recos:accentColor',
  language: 'recos:language',
  savedItems: 'recos:savedItems',
  cookieConsent: 'recos:cookieConsent',
};

const MAX_SAVED_ITEMS = 100;

const DEFAULT_LANGUAGE: Language = 'es';

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

// El correo con el que la persona confirmó su suscripción — no hay
// cuentas/login, así que esto es lo único que identifica "quién es
// premium" entre reinicios de la app o si cambia de dispositivo (con el
// botón "Restaurar compra").
export async function getPremiumEmail(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.premiumEmail);
}

export async function setPremiumEmail(email: string | null): Promise<void> {
  if (email) await AsyncStorage.setItem(KEYS.premiumEmail, email);
  else await AsyncStorage.removeItem(KEYS.premiumEmail);
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

export async function getSavedItems(): Promise<SavedItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.savedItems);
    if (!raw) return [];
    return JSON.parse(raw) as SavedItem[];
  } catch {
    return [];
  }
}

function savedItemKey(category: string, id: string): string {
  return `${category}:${id}`;
}

export async function isItemSaved(category: string, id: string): Promise<boolean> {
  const items = await getSavedItems();
  const key = savedItemKey(category, id);
  return items.some((item) => savedItemKey(item.category, item.id) === key);
}

export async function saveItem(item: SavedItem): Promise<SavedItem[]> {
  const items = await getSavedItems();
  const key = savedItemKey(item.category, item.id);
  const withoutExisting = items.filter((existing) => savedItemKey(existing.category, existing.id) !== key);
  // Los más nuevos primero; recorta la lista para no crecer sin límite.
  const next = [item, ...withoutExisting].slice(0, MAX_SAVED_ITEMS);
  await AsyncStorage.setItem(KEYS.savedItems, JSON.stringify(next));
  return next;
}

export async function removeSavedItem(category: string, id: string): Promise<SavedItem[]> {
  const items = await getSavedItems();
  const key = savedItemKey(category, id);
  const next = items.filter((existing) => savedItemKey(existing.category, existing.id) !== key);
  await AsyncStorage.setItem(KEYS.savedItems, JSON.stringify(next));
  return next;
}

// Solo se usa la primera vez que alguien abre la app (sin preferencia
// guardada todavía). En web lee el idioma del navegador para no mostrarle
// español por defecto a un visitante de habla inglesa; en nativo no hay
// forma fiable de leer el idioma del dispositivo sin agregar una librería
// nueva, así que se mantiene el español como opción por defecto.
function detectBrowserLanguage(): Language {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const lower = candidate.toLowerCase();
    if (lower.startsWith('en')) return 'en';
    if (lower.startsWith('es')) return 'es';
  }
  return DEFAULT_LANGUAGE;
}

export async function getLanguage(): Promise<Language> {
  const raw = await AsyncStorage.getItem(KEYS.language);
  if (raw === 'en' || raw === 'es') return raw;
  return detectBrowserLanguage();
}

export async function setLanguage(language: Language): Promise<void> {
  await AsyncStorage.setItem(KEYS.language, language);
}

export type CookieConsent = 'accepted' | 'rejected' | null;

// Solo relevante en web: si es "accepted", se puede cargar AdSense (el
// único script de terceros que corre dentro de la app). Sin respuesta
// (null) o "rejected", nunca se carga — no hay anuncios sin consentimiento
// explícito, y no se vuelve a preguntar una vez la persona elige.
export async function getCookieConsent(): Promise<CookieConsent> {
  const raw = await AsyncStorage.getItem(KEYS.cookieConsent);
  return raw === 'accepted' || raw === 'rejected' ? raw : null;
}

export async function setCookieConsent(value: 'accepted' | 'rejected'): Promise<void> {
  await AsyncStorage.setItem(KEYS.cookieConsent, value);
}
