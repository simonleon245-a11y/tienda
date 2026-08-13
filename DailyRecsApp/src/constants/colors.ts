export interface AccentColor {
  id: string;
  label: string;
  hex: string;
}

export const FREE_ACCENT_COLORS: AccentColor[] = [
  { id: 'violet', label: 'Violeta', hex: '#8B5CF6' },
  { id: 'blue', label: 'Azul', hex: '#3B82F6' },
  { id: 'green', label: 'Verde', hex: '#22C55E' },
  { id: 'pink', label: 'Rosa', hex: '#EC4899' },
  { id: 'orange', label: 'Naranja', hex: '#F97316' },
];

export const PREMIUM_ACCENT_COLORS: AccentColor[] = [
  { id: 'gold', label: 'Oro', hex: '#D4AF37' },
  { id: 'emerald', label: 'Esmeralda', hex: '#0FA968' },
  { id: 'ruby', label: 'Rubí', hex: '#E11D48' },
  { id: 'sapphire', label: 'Zafiro', hex: '#1D4ED8' },
  { id: 'amethyst', label: 'Amatista', hex: '#7C3AED' },
  { id: 'neon', label: 'Neón', hex: '#00E5FF' },
  { id: 'bronze', label: 'Bronce', hex: '#B45309' },
  { id: 'crimson', label: 'Carmesí', hex: '#BE123C' },
];

export const DEFAULT_ACCENT_COLOR = FREE_ACCENT_COLORS[0].hex;

export function isPremiumColor(hex: string): boolean {
  return PREMIUM_ACCENT_COLORS.some((c) => c.hex === hex);
}
