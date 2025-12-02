import {
  AvitoItemAnalyticsParams,
  BACKEND_PORT,
  authenticatedFetch,
} from '@/shared';
import { useAuthStore } from '@/entities/auth/model';

export const getAvitoItemAnalytics = async (params: AvitoItemAnalyticsParams, retryCount = 0): Promise<any> => {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second base delay

  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito/get_item_analytics`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(params),
    });

    // Check for 429 status code
    if (res.status === 429) {
      // Check if we've exceeded max retries
      if (retryCount >= maxRetries) {
        throw new Error('Maximum retry attempts exceeded');
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, retryCount) + Math.random() * 1000 * 60;

      // Check for Retry-After header
      const retryAfter = res.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 * 60 : delay;

      console.warn(`Rate limited. Retrying in ${waitTime}ms (attempt ${retryCount + 1}/${maxRetries})`);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // Retry the request
      return getAvitoItemAnalytics(params, retryCount + 1);
    }

    // Check for other non-20 status codes
    if (!res?.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse and return the response
    return await res.json();
  } catch (e) {
    console.error('Error fetching analytics:', e);

    // Only throw error if we're not going to retry
    if (retryCount >= maxRetries) {
      throw e;
    }

    // For network errors, retry with exponential backoff
    const delay = baseDelay * Math.pow(2, retryCount) + Math.random() * 1000 * 60;
    console.warn(`Network error. Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

    await new Promise((resolve) => setTimeout(resolve, delay));
    return getAvitoItemAnalytics(params, retryCount + 1);
  }
};

export async function createAvitoAnalyticsRequest(data) {
  try {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito_requests/${userId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        request: data.request,
        city: data.city,
        coords: data.coords || '',
        radius: data.radius || '',
        district: data.district || '',
      }),
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

export async function getAvitoAnalyticsAds(avitoRequestId: string) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito_requests/${avitoRequestId}/ads`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
    return res;
  } catch (e) {
    throw e;
  }
}

export async function getAvitoAnalyticsAdsWithPagination(avitoRequestId: string, page: number = 1, limit: number = 10) {
  try {
    const res = await authenticatedFetch(
      `${BACKEND_PORT}/api/avito_requests/${avitoRequestId}/ads?page=${page}&limit=${limit}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        credentials: 'include',
      },
    );
    return res;
  } catch (e) {
    throw e;
  }
}

export async function getAvitoRequests(page: number = 1, limit: number = 10) {
  const authStore = useAuthStore();
  const userId = authStore.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const res = await authenticatedFetch(
      `${BACKEND_PORT}/api/avito_requests/user/${userId}?page=${page}&limit=${limit}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        credentials: 'include',
      },
    );
    return res;
 } catch (e) {
    throw e;
  }
}

export async function downloadAvitoRequestCsv(avitoRequestId: string) {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/avito_requests/${avitoRequestId}/ads/csv`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
    return res;
  } catch (e) {
    throw e;
 }
}