import {
  AvitoCategoryFieldsParams,
  AvitoTokenParams,
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';

export const getAvitoCategories = async ({ avito_token }: AvitoTokenParams) => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_categories_tree`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        avito_token,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getAvitoCategoryFields = async ({ avito_token, avito_slug }: AvitoCategoryFieldsParams) => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_category_fields`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        avito_token,
        avito_slug,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });

    return res;
  } catch (e) {
    console.log(e);
  }
};