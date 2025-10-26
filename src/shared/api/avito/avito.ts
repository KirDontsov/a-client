import {
  AVITO_ITEMS_PAGINATION_LIMIT,
  AvitoCategoryFieldsParams,
  AvitoItemAnalyticsParams,
  AvitoTokenParams,
  BACKEND_PORT,
} from '@/shared';

export const getAvitoToken = async () => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_token`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
    });

    return res;
  } catch (e) {
    console.log(e);
  }
};


export const getAvitoBalance = async ({
                                        avito_token,
                                      }: AvitoTokenParams): Promise<AvitoGetBalanceResponse | null> => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_balance`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        avito_token,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn("error");
      });

    return res || null;
  } catch (e) {
    console.log(e);
  }
};

export const getAvitoProfile = async ({
                                        avito_token,
                                      }: AvitoTokenParams): Promise<AvitoGetProfileResponse | null> => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_user_profile`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        avito_token,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn("error");
      });

    return res || null;
  } catch (e) {
    console.log(e);
  }
};

export const getAvitoItems = async ({ page, limit }) => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_feed?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
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
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_items`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
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

export const getAvitoItemAnalytics = async (params: AvitoItemAnalyticsParams, retryCount = 0): Promise<any> => {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second base delay

  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_item_analytics`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
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

    // Check for other non-200 status codes
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

export const getAvitoCategories = async ({ avito_token }: AvitoTokenParams) => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_categories_tree`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
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
    const res = await fetch(`${BACKEND_PORT}/api/avito/get_category_fields`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
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

export async function createAvitoAnalyticsRequest(data) {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito_requests/6a9a4e3c-dbbe-44af-ba17-aeeff601226d`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
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
    const res = await fetch(`${BACKEND_PORT}/api/avito_requests/${avitoRequestId}/ads`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
    });
    return res;
  } catch (e) {
    throw e;
  }
}

export async function getAvitoRequests() {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito_requests`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
    });
    return res;
  } catch (e) {
    throw e;
  }
}

export async function downloadAvitoRequestCsv(avitoRequestId: string) {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/avito_requests/${avitoRequestId}/ads/csv`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
    });
    return res;
  } catch (e) {
    throw e;
  }
}
