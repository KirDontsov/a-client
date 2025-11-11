import { watch } from 'vue';
import { useAvitoAccountsStore } from '@/entities/avito-accounts/model';

// Define the callback type
type AccountChangeCallback = (newAccountId: string | null, oldAccountId: string | null) => void;

// Store the registered callbacks
const accountChangeCallbacks: AccountChangeCallback[] = [];

/**
 * Register a callback to be executed when the account changes
 */
export const onAccountChange = (callback: AccountChangeCallback): (() => void) => {
  accountChangeCallbacks.push(callback);
  
  // Return an unsubscribe function
  return () => {
    const index = accountChangeCallbacks.indexOf(callback);
    if (index > -1) {
      accountChangeCallbacks.splice(index, 1);
    }
  };
};

/**
 * Initialize the global account change watcher
 * This should be called once in the main application setup
 */
export const initAccountChangeWatcher = () => {
  const avitoAccountsStore = useAvitoAccountsStore();
  
  // Watch for changes in the selectedAccountId
  let previousAccountId = avitoAccountsStore.selectedAccountId;
  
  // Using a watcher that tracks changes over time
  const unsubscribe = watch(
    () => avitoAccountsStore.selectedAccountId,
    (newAccountId) => {
      if (newAccountId !== previousAccountId) {
        // Execute all registered callbacks
        accountChangeCallbacks.forEach(callback => {
          callback(newAccountId, previousAccountId);
        });
        previousAccountId = newAccountId;
      }
    },
    { immediate: false }
  );
  
  return unsubscribe;
};

/**
 * Force refresh all pages/components that depend on account_id
 */
export const refreshAccountDependentData = () => {
  const avitoAccountsStore = useAvitoAccountsStore();
  // Execute all callbacks with the current account ID
  accountChangeCallbacks.forEach(callback => {
    callback(avitoAccountsStore.selectedAccountId, avitoAccountsStore.selectedAccountId);
  });
};