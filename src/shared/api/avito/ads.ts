import {
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';

export async function avitoCreateAd(formData: Record<string, any>, account_id?: string) {
  try {
    const requestBody: any = {
      account_id: account_id || '', // Use provided account_id or empty string
      fields: {
        ...formData,
      },
    };
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/create-ad`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error('Error creating Avito ad:', e);
    throw e;
 }
}

export async function getAvitoAdById(feed_id: string, ad_id: string, account_id: string) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/feed/${feed_id}/ad/${ad_id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ account_id }),
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

export async function avitoUpdateAd(
  ad_id: string,
  feed_id: string,
  formData: Record<string, any>,
  account_id?: string,
) {
  try {
    const requestBody: any = {
      ad_id: ad_id, // Include ad_id in the request body as per backend schema
      account_id: account_id || '', // Use provided account_id or empty string
      fields: {
        ...formData,
      },
    };

    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/update-ad`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error('Error updating Avito ad:', e);
    throw e;
 }
}

export async function avitoDeleteAd(ad_id: string, account_id?: string) {
  try {
    const requestBody: any = {
      ad_id: ad_id,
      account_id: account_id || null, // Use provided account_id or null
    };

    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/delete-ad`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error('Error deleting Avito ad:', e);
    throw e;
  }
}