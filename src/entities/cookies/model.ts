import { ref } from 'vue';
import Cookies from 'js-cookie';

export function useCookies<T>(name: string, defaultValue?: T) {
  // Read and parse the cookie value initially
  const readValue = (): T => {
    const cookieValue = Cookies.get(name);
    if (cookieValue === undefined) return defaultValue ?? '';

    try {
      return JSON.parse(cookieValue) as T;
    } catch {
      return cookieValue as unknown as T;
    }
  };

  const value = ref<T>(readValue());

  // Set method to update cookie and ref value
  const set = (newValue: T, options?: Cookies.CookieAttributes) => {
    try {
      const serializedValue = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
      Cookies.set(name, serializedValue, options);
      value.value = newValue;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  };

  return {
    value,
    set,
  };
}
