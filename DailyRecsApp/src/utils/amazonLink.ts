import { ENV } from './env';

/**
 * Link de búsqueda de un libro en Amazon (departamento de libros), con el
 * tag de Amazon Associates si está configurado (AMAZON_ASSOCIATE_TAG en
 * .env). Como con los links de música, no depende de ninguna API de
 * Amazon: abre la búsqueda con "título + autor" en vez de apuntar al ASIN
 * exacto, así que no requiere credenciales de la Product Advertising API.
 */
export function buildAmazonBookLink(title: string, authors: string[]): string {
  const query = encodeURIComponent([title, ...authors].join(' '));
  const tagParam = ENV.AMAZON_ASSOCIATE_TAG ? `&tag=${ENV.AMAZON_ASSOCIATE_TAG}` : '';
  return `https://www.amazon.com/s?k=${query}&i=stripbooks${tagParam}`;
}
