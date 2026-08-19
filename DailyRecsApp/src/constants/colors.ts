import { Language } from '@/i18n/translations';

export interface AccentColor {
  id: string;
  label: Record<Language, string>;
  hex: string;
}

export const FREE_ACCENT_COLORS: AccentColor[] = [
  { id: 'violet', label: { es: 'Violeta', en: 'Violet' }, hex: '#8B5CF6' },
  { id: 'blue', label: { es: 'Azul', en: 'Blue' }, hex: '#3B82F6' },
  { id: 'green', label: { es: 'Verde', en: 'Green' }, hex: '#22C55E' },
  { id: 'pink', label: { es: 'Rosa', en: 'Pink' }, hex: '#EC4899' },
  { id: 'orange', label: { es: 'Naranja', en: 'Orange' }, hex: '#F97316' },
];

// Los 8 tonos están espaciados ~40-45° en el círculo de matices (hue) a
// propósito, para que sean distinguibles entre sí de un vistazo en un
// círculo pequeño — no solo distintos "en teoría de nombre" (el Oro/Bronce
// y Rubí/Carmesí originales eran casi el mismo color en la práctica).
// Verificado con la fórmula de contraste WCAG contra el fondo de tarjeta:
// los 8 pasan >=4:1 (nivel AA para texto), ya que estos colores también se
// usan como color de texto en botones de acción.
export const PREMIUM_ACCENT_COLORS: AccentColor[] = [
  { id: 'ruby', label: { es: 'Rubí', en: 'Ruby' }, hex: '#E7404E' },
  { id: 'gold', label: { es: 'Oro', en: 'Gold' }, hex: '#E8B730' },
  { id: 'peridot', label: { es: 'Peridoto', en: 'Peridot' }, hex: '#70E236' },
  { id: 'emerald', label: { es: 'Esmeralda', en: 'Emerald' }, hex: '#1B986A' },
  { id: 'neon', label: { es: 'Neón', en: 'Neon' }, hex: '#00E4F5' },
  { id: 'sapphire', label: { es: 'Zafiro', en: 'Sapphire' }, hex: '#5A71E2' },
  { id: 'amethyst', label: { es: 'Amatista', en: 'Amethyst' }, hex: '#915CD6' },
  { id: 'tourmaline', label: { es: 'Turmalina', en: 'Tourmaline' }, hex: '#DA3ECB' },
];

export const DEFAULT_ACCENT_COLOR = FREE_ACCENT_COLORS[0].hex;

export function isPremiumColor(hex: string): boolean {
  return PREMIUM_ACCENT_COLORS.some((c) => c.hex === hex);
}
