import { useThemeStore } from '@/entities/theme/model';
import { toast as toastLib, type ToastOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Alias toastLib to toast to maintain the existing interface
const toast = toastLib;

// Create the composable
export function useToast() {
 // Get the theme store to access reactive theme value
  const themeStore = useThemeStore();
  
  const success = (message: string, options: ToastOptions = {}) => {
    // Access the reactive theme value at toast creation time
    const currentTheme = themeStore.isDark ? 'dark' : 'light';
    const toastOptions = {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: currentTheme,
      // Allow custom options to override defaults
      ...options,
    };
    return toast.success(message, toastOptions);
  };

  const error = (message: string, options: ToastOptions = {}) => {
    // Access the reactive theme value at toast creation time
    const currentTheme = themeStore.isDark ? 'dark' : 'light';
    const toastOptions = {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: currentTheme,
      // Allow custom options to override defaults
      ...options,
    };
    return toast.error(message, toastOptions);
  };

  const info = (message: string, options: ToastOptions = {}) => {
    // Access the reactive theme value at toast creation time
    const currentTheme = themeStore.isDark ? 'dark' : 'light';
    const toastOptions = {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: currentTheme,
      // Allow custom options to override defaults
      ...options,
    };
    return toast.info(message, toastOptions);
  };

  const warning = (message: string, options: ToastOptions = {}) => {
    // Access the reactive theme value at toast creation time
    const currentTheme = themeStore.isDark ? 'dark' : 'light';
    const toastOptions = {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: currentTheme,
      // Allow custom options to override defaults
      ...options,
    };
    return toast.warning(message, toastOptions);
  };

  const defaultToast = (message: string, options: ToastOptions = {}) => {
    // Access the reactive theme value at toast creation time
    const currentTheme = themeStore.isDark ? 'dark' : 'light';
    const toastOptions = {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: currentTheme,
      // Allow custom options to override defaults
      ...options,
    };
    return toast(message, toastOptions);
  };

  return {
    success,
    error,
    info,
    warning,
    default: defaultToast,
  };
};
