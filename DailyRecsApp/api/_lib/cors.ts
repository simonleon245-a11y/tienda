import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Estos endpoints los llama el navegador directo (desde suscribirse.html
 * o desde la app corriendo en local con `expo start`, que sirve en un
 * origen distinto al de este backend) — sin estos headers, el navegador
 * bloquea la respuesta aunque el servidor sí haya procesado todo bien. */
export function allowCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
