import { BACKEND_PORT } from '@/shared';

export async function updateFirm(id, firm) {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/firm_by_url/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        ...firm,
        floor: firm?.floor ? firm?.floor : '',
        default_email: firm?.default_email ? firm?.default_email : '',
        title: firm?.title ? firm?.title : '',
      }),
    });
    return res;
  } catch (e) {
    throw e;
  }
}

export async function getFirmByUrl(id) {
  try {
    const res = await fetch(`${BACKEND_PORT}/api/firm_by_url/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
      .then((res) => res.json())
      .catch(() => {
        console.warn('error getFirm');
      });
    return res;
  } catch (e) {
    throw e;
  }
}
