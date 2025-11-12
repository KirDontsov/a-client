<!-- components/AvitoAccounts.vue -->
<template>
  <PageContainer :loading="avitoAccountsStore.loading">
    <template #body>
      <div class="w-full px-4 py-2 sm:px-8 sm:py-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Центр управления аккаунтами</h2>
          <Button @click="goToCreateAccount" color="default" variant="dark" class="flex items-center gap-2">
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
            <span>Добавить аккаунт</span>
          </Button>
        </div>

        <!-- Error message -->
        <div
          v-if="avitoAccountsStore.error"
          class="mb-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-90 dark:text-red-100"
        >
          {{ avitoAccountsStore.error }}
        </div>

        <!-- Table to display avito accounts -->
        <div
          v-if="avitoAccountsStore.accounts && avitoAccountsStore.accounts.length > 0"
          class="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-40">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('account_id')"
                >
                  Аккаунт ID
                  <span v-if="sortColumn === 'account_id'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('client_id')"
                >
                  Клиент ID
                  <span v-if="sortColumn === 'client_id'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('is_connected')"
                >
                  Статус
                  <span v-if="sortColumn === 'is_connected'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('createdTs')"
                >
                  Дата создания
                  <span v-if="sortColumn === 'createdTs'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th scope="col" class="px-6 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="account in sortedAccounts"
                :key="account.account_id"
                @click="selectAccount(account.account_id)"
                :class="{
                  'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer': true,
                  'bg-blue-100 dark:bg-blue-90': avitoAccountsStore.selectedAccountId === account.account_id,
                }"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ account.account_id || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ account.client_id || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ account.is_connected ? 'Подключен' : 'Отключен' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ formatDate(account.createdTs) || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <!-- Add actions here if needed -->
                  <Button
                    @click.stop="deleteAccount(account.account_id)"
                    color="default"
                    variant="dark"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Account"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else-if="
            !avitoAccountsStore.loading && avitoAccountsStore.accounts && avitoAccountsStore.accounts.length === 0
          "
          class="text-center py-4 text-gray-50 dark:text-gray-400"
        >
          No accounts available
        </div>

        <div v-else-if="avitoAccountsStore.loading" class="text-center py-4 text-gray-50 dark:text-gray-400">
          Loading accounts...
        </div>

        <!-- Pagination -->
        <div
          v-if="avitoAccountsStore.accounts && avitoAccountsStore.accounts.length > 0"
          class="flex flex-col items-center mt-6"
        >
          <!-- Pagination info -->
          <div class="flex items-center justify-end w-full mb-4">
            <div class="flex items-center justify-between w-full mb-4">
              <div class="text-sm text-gray-700 dark:text-gray-400">
                Показано с
                {{ (avitoAccountsStore.currentPage - 1) * avitoAccountsStore.itemsPerPage + 1 }} по
                {{
                  Math.min(
                    avitoAccountsStore.currentPage * avitoAccountsStore.itemsPerPage,
                    avitoAccountsStore.totalItems,
                  )
                }}
                из {{ avitoAccountsStore.totalItems }} записей
              </div>
              <div class="flex items-center space-x-2">
                <label for="accountsItemsPerPage" class="text-sm text-gray-700 dark:text-gray-400"
                  >Записей на странице:</label
                >
                <select
                  id="accountsItemsPerPage"
                  v-model="itemsPerPage"
                  @change="onItemsPerPageChange"
                  class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-4 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pagination component -->
          <Pagination
            :total-items="avitoAccountsStore.totalItems"
            :items-per-page="avitoAccountsStore.itemsPerPage"
            @page-changed="onPageChanged"
            :loading="avitoAccountsStore.loading"
          />
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAvitoAccountsStore } from '@/entities/avito-accounts';
import { PageContainer } from '@/features/page-container';
import { Pagination } from '@/features/pagination';
import { Button } from '@/shared/components';

const router = useRouter();
const avitoAccountsStore = useAvitoAccountsStore();

const goToCreateAccount = () => {
  router.push('/accounts/create');
};

// Pagination state
const itemsPerPage = ref<number>(avitoAccountsStore.itemsPerPage);

// Sorting state
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const selectAccount = async (accountId: string) => {
  avitoAccountsStore.selectAccount(accountId);
  // Navigate to the edit account page
  router.push(`/avito/accounts/${accountId}`);
};

const deleteAccount = async (accountId: string) => {
  if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
    try {
      await avitoAccountsStore.deleteAccount(accountId);
      // The accounts will be refetched automatically by the store after deletion
    } catch (error) {
      console.error('Error deleting account:', error);
      // The error is already handled in the store, so we don't need additional handling here
    }
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

// Computed property for sorted accounts
const sortedAccounts = computed(() => {
  if (!sortColumn.value) {
    return avitoAccountsStore.accounts;
  }

  return [...avitoAccountsStore.accounts].sort((a, b) => {
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
    if (sortColumn.value === 'createdTs') {
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

    // For boolean comparison
    if (sortColumn.value === 'is_connected' && typeof valA === 'boolean' && typeof valB === 'boolean') {
      if (sortDirection.value === 'asc') {
        return valA === valB ? 0 : valA ? -1 : 1; // false comes first in ascending order
      } else {
        return valA === valB ? 0 : valA ? 1 : -1; // true comes first in descending order
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

// Pagination methods
const onPageChanged = async (page: number) => {
  await avitoAccountsStore.fetchAccounts(page, itemsPerPage.value);
};

const onItemsPerPageChange = async () => {
  // Reset to first page when changing items per page
  await avitoAccountsStore.fetchAccounts(1, itemsPerPage.value);
};

onMounted(async () => {
  await avitoAccountsStore.fetchAccounts(avitoAccountsStore.currentPage, itemsPerPage.value);
});
</script>

<style scoped>
/* Custom styles for the component */
</style>
