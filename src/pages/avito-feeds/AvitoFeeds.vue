<template>
  <PageContainer :loading="loading">
    <template #body>
      <div class="px-4 py-2 sm:px-8 sm:py-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-80 dark:text-white">Фиды</h2>
          <div class="flex items-center space-x-4">
            <Button @click="importFeed" variant="dark" color="default" class="flex items-center">
              <span class="mr-2"
                ><svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path></svg
              ></span>
              Загрузить новый фид
            </Button>
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="error && avitoAccountsStore.selectedAccountId"
          class="mb-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100"
        >
          {{ error }}
        </div>

        <!-- Table to display feeds -->
        <div
          v-if="feeds && feeds.length > 0 && avitoAccountsStore.selectedAccountId"
          class="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('feed_id')"
                >
                  Фид ID
                  <span v-if="sortColumn === 'feed_id'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('account_id')"
                >
                  Аккаунт ID
                  <span v-if="sortColumn === 'account_id'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('category')"
                >
                  Категория
                  <span v-if="sortColumn === 'category'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('created_ts')"
                >
                  Дата создания
                  <span v-if="sortColumn === 'created_ts'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th scope="col" class="px-6 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="feed in sortedFeeds"
                :key="feed.feed_id"
                @click="selectFeed(feed.feed_id)"
                :class="{
                  'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer': true,
                  'bg-blue-100 dark:bg-blue-900': selectedFeedId === feed.feed_id,
                }"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ feed.feed_id || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ feed.account_id || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ feed.category || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ formatDate(feed.created_ts) || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <!-- Details view is now accessible by clicking the row -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else-if="!loading && feeds && feeds.length === 0 && avitoAccountsStore.selectedAccountId"
          class="text-center py-4 text-gray-500 dark:text-gray-400"
        >
          Не выбран аккаунт. Пожалуйста выберите или зарегистрируйте авито аккаунт
        </div>

        <div v-else-if="loading" class="text-center py-4 text-gray-500 dark:text-gray-400">Загружаем фиды...</div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAvitoAccountsStore } from '@/entities/avito-accounts';
import { PageContainer } from '@/features/page-container';
import { Button } from '@/shared/components';
import { getAvitoFeeds } from '@/shared/api/avito/avito';
import { useRouter } from 'vue-router';
import { onAccountChange } from '@/shared/lib';

// Stores
const avitoAccountsStore = useAvitoAccountsStore();
const router = useRouter();

// State
const feeds = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedFeedId = ref<string | null>(null);

// Sorting state
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Computed property for sorted feeds
const sortedFeeds = computed(() => {
  if (!sortColumn.value) {
    return feeds.value;
  }

  return [...feeds.value].sort((a, b) => {
    // Get the values to compare
    let valA = a[sortColumn.value as keyof typeof a];
    let valB = b[sortColumn.value as keyof typeof b];

    // Handle null values
    if (valA === null && valB === null) return 0;
    if (valA === null) return sortDirection.value === 'asc' ? 1 : -1;
    if (valB === null) return sortDirection.value === 'asc' ? -1 : 1;

    // Convert to string for comparison if not already
    if (typeof valA !== 'string' && typeof valA !== 'number') valA = String(valA);
    if (typeof valB !== 'string' && typeof valB !== 'number') valB = String(valB);

    // For date comparison
    if (sortColumn.value === 'created_ts') {
      const dateA = new Date(valA as string);
      const dateB = new Date(valB as string);
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        // If dates are invalid, compare as strings
        valA = String(valA);
        valB = String(valB);
      } else {
        if (sortDirection.value === 'asc') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      }
    }

    // String comparison
    if (typeof valA === 'string' && typeof valB === 'string') {
      const comparison = valA.localeCompare(valB, undefined, { numeric: true });
      return sortDirection.value === 'asc' ? comparison : -comparison;
    }

    // Number comparison
    if (typeof valA === 'number' && typeof valB === 'number') {
      if (sortDirection.value === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    }

    // Fallback to string comparison
    const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

// Methods
const fetchFeeds = async () => {
  if (!avitoAccountsStore.selectedAccountId) {
    feeds.value = [];
    error.value = null; // Don't set error when no account is selected, since we show the centered message
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await getAvitoFeeds(avitoAccountsStore.selectedAccountId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different possible response formats from the API
    if (data && Array.isArray(data)) {
      feeds.value = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      feeds.value = data.data;
    } else if (data && data.feeds && Array.isArray(data.feeds)) {
      feeds.value = data.feeds;
    } else {
      feeds.value = [];
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch feeds';
    console.error('Error fetching feeds:', err);
    feeds.value = [];
  } finally {
    loading.value = false;
  }
};

// Sorting function
const sortTable = (column: string) => {
  if (sortColumn.value === column) {
    // If clicking the same column, toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If clicking a new column, set it as the sort column with ascending direction
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const selectFeed = async (feedId: string) => {
  selectedFeedId.value = feedId;
  router.push(`/feeds/${feedId}`);
};

const viewFeedDetails = (feedId: string) => {
  // This could navigate to a feed details page if needed
  console.log('View feed details:', feedId);
};

const importFeed = () => {
  router.push('/feeds/import');
};

// Lifecycle
onMounted(async () => {
  // Load accounts first if not already loaded
  if (avitoAccountsStore.accounts.length === 0) {
    await avitoAccountsStore.fetchAccounts(1, 100); // Load all accounts
  }

  // Fetch feeds for the selected account
  await fetchFeeds();

  // Subscribe to account changes and refetch feeds when account changes
  onAccountChange(() => {
    console.log('Account changed in AvitoFeeds.vue, refetching feeds...');
    fetchFeeds();
  });
});
</script>

<style scoped>
/* Custom styles for the component */
</style>
