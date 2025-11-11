// Use environment-specific domain
export const DOMAIN =
  process.env.NODE_ENV === 'production'
    ? 'xn--90ab9accji9e.xn--p1ai' // Production domain
    : 'localhost:8080';
export const BACKEND_PORT = process.env.NODE_ENV === 'production' ? `https://${DOMAIN}` : `http://${DOMAIN}`;

export const AVITO_ITEMS_PAGINATION_LIMIT = 100;
