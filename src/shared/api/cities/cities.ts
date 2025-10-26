import { BACKEND_PORT, type CitiesQueryResult } from '@/shared';

export async function getCities({ page = 1, limit = 10 }) {
  try {
    const res: CitiesQueryResult = await fetch(`${BACKEND_PORT}/api/cities?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });
    return res;
  } catch (e) {
    throw e;
  }
}
