import {
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';

export async function createAvitoAccount(accountData: {
  user_id: string;
  avito_client_id: string;
  avito_client_secret: string;
}) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/accounts`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(accountData),
    });
    return res;
 } catch (e) {
    throw e;
 }
}

export async function getAvitoAccounts(page: number = 1, limit: number = 10) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/accounts?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
    return res;
  } catch (e) {
    throw e;
 }
}

export async function getAvitoAccountById(accountId: string) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/accounts/${accountId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
    return res;
  } catch (e) {
    throw e;
 }
}

export async function updateAvitoAccount(
 accountId: string,
 accountData: {
    avito_client_id: string;
    avito_client_secret: string;
  },
) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/accounts/${accountId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT', // or 'PATCH' depending on your backend implementation
      body: JSON.stringify(accountData),
    });
    return res;
 } catch (e) {
    throw e;
  }
}

export async function deleteAvitoAccount(accountId: string) {
 try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/accounts/${accountId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
    return res;
  } catch (e) {
    throw e;
 }
}