import {
  AVITO_ITEMS_PAGINATION_LIMIT,
  AvitoTokenParams,
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';
import { useAvitoAccountsStore } from '@/entities/avito-accounts/model';

export const getAvitoItems = async ({ page, limit }) => {
  try {
    const avitoAccountsStore = useAvitoAccountsStore();
    const account_id = avitoAccountsStore.selectedAccountId;

    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_feed`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        page,
        limit,
        account_id,
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

export const getAvitoItemsFromAvitoApi = async ({ avito_token, page }: AvitoTokenParams) => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_items`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        avito_token,
        page,
        per_page: AVITO_ITEMS_PAGINATION_LIMIT,
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

// Removed ad-related functions to ads.ts file