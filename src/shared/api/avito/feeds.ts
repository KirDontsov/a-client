import {
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';

export async function getAvitoFeeds(account_id: string) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/feeds`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ account_id }),
    });
    return res;
  } catch (e) {
    throw e;
 }
}

export async function getAvitoFeedById(feed_id: string, page: number = 1, limit: number = 10) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/feeds/${feed_id}?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
    return res;
  } catch (e) {
    throw e;
 }
}

export async function importAvitoXml(data: { account_id: string; xml_url: string }) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/import-xml`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
 } catch (e) {
    throw e;
 }
}