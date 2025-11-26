import { BACKEND_PORT, authenticatedFetch } from '@/shared';

export const login = async (email: string, password: string) => {
  try {
    // Use regular fetch for login to avoid circular dependency with token
    const res = await fetch(`${BACKEND_PORT}/api/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Check if login was successful and extract token if available
    if (res.ok) {
      // Get the response JSON to extract token from the body
      const data = await res.clone().json(); // clone to avoid "body used already" error
      if (data && data.token) {
        // Store token in sessionStorage for cross-domain access
        if (typeof window !== 'undefined') {
          console.log('auth_token', data.token);
          sessionStorage.setItem('auth_token', data.token);
        }
      }
    }

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/auth/register`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Check if registration was successful and extract token if available
    if (res.ok) {
      // Get the response JSON to extract token from the body
      const data = await res.clone().json(); // clone to avoid "body used already" error
      if (data && data.token) {
        // Store token in sessionStorage for cross-domain access
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth_token', data.token);
        }
      }
    }

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/auth/logout`, {
      method: 'GET',
    });

    // Clear token from sessionStorage after logout
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('token');
    }

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const checkAuth = async () => {
  try {
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/users/me`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error');
      });

    return res || null;
  } catch (e) {
    throw e;
  }
};
