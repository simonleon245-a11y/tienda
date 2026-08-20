import type { VercelRequest, VercelResponse } from '@vercel/node';

/** La llave pública de Wompi es, por diseño, segura para usar desde el
 * navegador (solo sirve para tokenizar tarjetas, no para cobrar) — pero
 * como este proyecto no compila variables de entorno dentro de los
 * archivos estáticos de /public, se la servimos a la página de
 * suscripción a través de este endpoint. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const env = process.env.WOMPI_ENV === 'production' ? 'production' : 'sandbox';
  res.status(200).json({
    publicKey: process.env.WOMPI_PUBLIC_KEY || '',
    baseUrl: env === 'production' ? 'https://production.wompi.co/v1' : 'https://sandbox.wompi.co/v1',
    monthlyAmountCop: Number(process.env.WOMPI_MONTHLY_AMOUNT_COP || 9900),
    annualAmountCop: Number(process.env.WOMPI_ANNUAL_AMOUNT_COP || 71900),
  });
}
