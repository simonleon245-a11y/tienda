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

export const PREMIUM_ACCENT_COLORS: AccentColor[] = [
  { id: 'gold', label: { es: 'Oro', en: 'Gold' }, hex: '#D4AF37' },
  { id: 'emerald', label: { es: 'Esmeralda', en: 'Emerald' }, hex: '#0FA968' },
  { id: 'ruby', label: { es: 'Rubí', en: 'Ruby' }, hex: '#E11D48' },
  { id: 'sapphire', label: { es: 'Zafiro', en: 'Sapphire' }, hex: '#1D4ED8' },
  { id: 'amethyst', label: { es: 'Amatista', en: 'Amethyst' }, hex: '#7C3AED' },
  { id: 'neon', label: { es: 'Neón', en: 'Neon' }, hex: '#00E5FF' },
  { id: 'bronze', label: { es: 'Bronce', en: 'Bronze' }, hex: '#B45309' },
  { id: 'crimson', label: { es: 'Carmesí', en: 'Crimson' }, hex: '#BE123C' },
];

export const DEFAULT_ACCENT_COLOR = FREE_ACCENT_COLORS[0].hex;

export function isPremiumColor(hex: string): boolean {
  return PREMIUM_ACCENT_COLORS.some((c) => c.hex === hex);
}
