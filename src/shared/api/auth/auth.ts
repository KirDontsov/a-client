import { BACKEND_PORT } from '@/shared';

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

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
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const checkAuth = async () => {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/users/me`, {
      method: 'GET',
      credentials: 'include',
    }).then((res) => res.json())
      .catch(() => {
        console.warn("error");
      });

    return res || null;
  } catch (e) {
    throw e;
  }
};
