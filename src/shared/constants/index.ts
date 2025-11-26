// Use environment-specific domain
export const DOMAIN =
  process.env.NODE_ENV === 'production'
    ? 'sunseven.ru' // Production domain
    : 'localhost:8081';
export const BACKEND_PORT = process.env.NODE_ENV === 'production' ? `https://${DOMAIN}` : `http://${DOMAIN}`;

export const AVITO_ITEMS_PAGINATION_LIMIT = 100;
