import {
  AvitoTokenParams,
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';
import { useAvitoAccountsStore } from '@/entities/avito-accounts/model';

export const getAvitoToken = async (client_id?: string, client_secret?: string) => {
  try {
    const requestBody: any = {
      grant_type: 'client_credentials', // Required field for the backend
    };

    // Only add client_id and client_secret to the request body if both are provided
    if (client_id && client_secret) {
      requestBody.client_id = client_id;
      requestBody.client_secret = client_secret;
    }

    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_token`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });

    console.log('res', res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getAvitoBalance = async ({ avito_token }: AvitoTokenParams) => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_balance`, {
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

    return res || null;
  } catch (e) {
    console.log(e);
 }
};

export const getAvitoProfile = async ({ avito_token }: AvitoTokenParams) => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_user_profile`, {
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

    return res || null;
  } catch (e) {
    console.log(e);
  }
};