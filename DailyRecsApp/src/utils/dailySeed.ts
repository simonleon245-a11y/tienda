/**
 * Selección determinista: la misma fecha + mismo género siempre produce
 * el mismo índice, así que la recomendación no cambia si se reabre la
 * app el mismo día (o el mismo mes, para libros), pero sí rota al
 * cambiar de día/mes o de género.
 */

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function monthKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// djb2 hash, suficiente para distribuir índices, no para seguridad.
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

export function pickIndex(seed: string, poolSize: number): number {
  if (poolSize <= 0) return 0;
  return hashString(seed) % poolSize;
}

export function dailySeed(genreId: string, date: Date = new Date()): string {
  return `${todayKey(date)}::${genreId}`;
}

export function monthlySeed(genreId: string, date: Date = new Date()): string {
  return `${monthKey(date)}::${genreId}`;
}
