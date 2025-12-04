import { useTheme } from './useTheme';
import toast, { type ToastOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Create the composable
export function useToast() {
  const { isDark } = useTheme();
  
  // Function to get toast options with theme support
 const getToastOptions = (customOptions: ToastOptions = {}): ToastOptions => {
    return {
      // Default options
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: isDark.value ? 'dark' : 'light',
      // Allow custom options to override defaults
      ...customOptions,
    };
  };

  const success = (message: string, options: ToastOptions = {}) => {
    const toastOptions = getToastOptions(options);
    return toast.success(message, toastOptions);
  };

  const error = (message: string, options: ToastOptions = {}) => {
    const toastOptions = getToastOptions(options);
    return toast.error(message, toastOptions);
  };

  const info = (message: string, options: ToastOptions = {}) => {
    const toastOptions = getToastOptions(options);
    return toast.info(message, toastOptions);
  };

  const warning = (message: string, options: ToastOptions = {}) => {
    const toastOptions = getToastOptions(options);
    return toast.warning(message, toastOptions);
  };

  const defaultToast = (message: string, options: ToastOptions = {}) => {
    const toastOptions = getToastOptions(options);
    return toast(message, toastOptions);
  };

  return {
    success,
    error,
    info,
    warning,
    default: defaultToast,
  };
}