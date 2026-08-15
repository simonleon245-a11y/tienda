/** Paleta de acentos "vivos" para darle personalidad a cada recomendación,
 * elegida de forma determinista según su id/título — misma recomendación,
 * mismo color siempre, sin necesidad de analizar la portada. */
const PALETTE = ['#8B5CF6', '#D4AF37', '#10B981', '#F472B6', '#38BDF8', '#FB923C'];

function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

export function colorForItem(key: string): string {
  if (!key) return PALETTE[0];
  return PALETTE[hashString(key) % PALETTE.length];
}
