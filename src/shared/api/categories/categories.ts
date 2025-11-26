import { BACKEND_PORT, type CategoriesQueryResult, authenticatedFetch } from '@/shared';

export async function getCategories({ page = 1, limit = 10 }) {
  try {
    const res: CategoriesQueryResult = await authenticatedFetch(`${BACKEND_PORT}/api/categories?page=${page}&limit=${limit}`, {
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
