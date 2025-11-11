# Account Change Handler

## Overview
This module provides a centralized system for handling account changes across the application. When the selected account is changed in the header, all components that depend on the account ID will be notified and can refresh their data accordingly.

## How it Works

### 1. Initialization
The account change watcher is initialized in `src/main.ts` using the `initAccountChangeWatcher()` function. This sets up a global watcher on the `avitoAccountsStore.selectedAccountId` state.

### 2. Registration
Components that need to respond to account changes can register a callback using the `onAccountChange()` function. This callback will be executed whenever the account ID changes.

### 3. Notification
When the account ID changes, all registered callbacks are executed with the new and old account IDs as parameters.

## Usage

### In Components
To register a callback in a component:

```javascript
import { onAccountChange } from '@/shared/lib/account-change-handler';

onMounted(async () => {
 // Load initial data
  await loadData();
  
  // Subscribe to account changes
  onAccountChange((newAccountId, oldAccountId) => {
    console.log(`Account changed from ${oldAccountId} to ${newAccountId}`);
    // Refresh data based on new account
    loadData();
  });
});
```

### Example Implementation
See the implementation in:
- `src/pages/avito-feeds/AvitoFeeds.vue`
- `src/pages/avito-view/AvitoView.vue`
- `src/pages/avito-editor/AvitoEditor.vue`

## Files Modified
- `src/main.ts` - Initialize the account change watcher
- `src/shared/lib/account-change-handler.ts` - Core functionality
- `src/pages/avito-feeds/AvitoFeeds.vue` - Implementation example
- `src/pages/avito-view/AvitoView.vue` - Implementation example
- `src/pages/avito-editor/AvitoEditor.vue` - Implementation example

## Benefits
1. **Centralized Logic**: Account change handling is managed in one place
2. **Consistency**: All components respond to account changes in a uniform way
3. **Maintainability**: Easy to add new components that need to respond to account changes
4. **Performance**: Only components that need to refresh data will do so