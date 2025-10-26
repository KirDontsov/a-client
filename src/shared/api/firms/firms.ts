import { BACKEND_PORT } from '@/shared';

export async function getFirms({ city, category, page, limit }) {
  try {
    const res = await fetch(
      `${BACKEND_PORT}/api/firms_by_abbr?city_id=${city}&category_id=${category}&page=${page}&limit=${limit}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      },
    )
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });
    return res;
  } catch (e) {
    throw e;
  }
}
