import Cookies from 'js-cookie';

/**
 * Gets the authentication token from cookies
 * @returns The token string or null if not found
 */
export const getAuthToken = (): string | null => {
  try {
    // First, try to get token from sessionStorage (primary method for cross-domain)
    if (typeof window !== 'undefined') {
      const tokenFromSession = sessionStorage.getItem('auth_token') ||
                              sessionStorage.getItem('token');
      if (tokenFromSession) {
        return tokenFromSession;
      }
      
      // Fallback to localStorage
      const tokenFromLocal = localStorage.getItem('auth_token') ||
                            localStorage.getItem('token');
      if (tokenFromLocal) {
        return tokenFromLocal;
      }
    }
    
    // Then, check if document.cookie is accessible (fallback for same-domain)
    if (typeof document !== 'undefined' && document.cookie) {
      // Try different possible cookie names for the token using js-cookie
      const possibleCookieNames = ['token', 'auth_token', 'access_token', 'authorization'];
      
      for (const cookieName of possibleCookieNames) {
        try {
          const token = Cookies.get(cookieName);
          if (token) {
            return token;
          }
        } catch (e) {
          // If js-cookie fails, continue to next cookie name
          continue;
        }
      }
      
      // Fallback: Try to get token directly from document.cookie
      for (const cookieName of possibleCookieNames) {
        const name = cookieName + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            const token = c.substring(name.length, c.length);
            if (token) {
              return token;
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Creates headers object with Authorization header if token exists
 * @param additionalHeaders Additional headers to include
 * @returns Headers object with Authorization header if token exists
 */
export const createAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    ...additionalHeaders,
  };

  const token = getAuthToken();
  console.log('token', token);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Wrapper for fetch that includes authorization token in headers
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to the fetch response
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { headers, ...restOptions } = options;

  const authHeaders = createAuthHeaders(headers as Record<string, string> | undefined);

  // Merge the options while preserving all original properties
  const fetchOptions: RequestInit = {
    ...restOptions,
    headers: authHeaders,
  };

  return fetch(url, fetchOptions);
};
