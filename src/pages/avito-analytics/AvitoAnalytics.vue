<!-- components/AvitoAnalytics.vue -->
<template>
  <PageContainer :loading="avitoAnalyticsAdsStore.loading">
    <template #body>
      <div
        class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Аналитика Avito</h2>
          <button
            @click="navigateToNewRequest"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:bg-blue-800 transition-colors duration-200"
          >
            <svg
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
              ></path>
            </svg>
            Создать новый запрос
          </button>
        </div>

        <!-- Error message -->
        <div
          v-if="avitoAnalyticsAdsStore.error"
          class="mb-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100"
        >
          {{ avitoAnalyticsAdsStore.error }}
        </div>

        <!-- Table to display avito requests -->
        <div
          v-if="avitoAnalyticsAdsStore.requests && avitoAnalyticsAdsStore.requests.length > 0"
          class="relative overflow-x-auto shadow-md sm:rounded-lg"
        >
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('createdTs')"
                >
                  Дата сканирования
                  <span v-if="sortColumn === 'createdTs'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('request')"
                >
                  Запрос
                  <span v-if="sortColumn === 'request'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('city')"
                >
                  Город
                  <span v-if="sortColumn === 'city'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('coords')"
                >
                  Координаты
                  <span v-if="sortColumn === 'coords'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('radius')"
                >
                  Радиус
                  <span v-if="sortColumn === 'radius'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortTable('district')"
                >
                  Район
                  <span v-if="sortColumn === 'district'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th scope="col" class="px-6 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="request in sortedRequests"
                :key="request.request_id"
                @click="selectRequest(request.request_id)"
                :class="{
                  'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer': true,
                  'bg-blue-100 dark:bg-blue-900': avitoAnalyticsAdsStore.selectedRequestId === request.request_id,
                }"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ formatDate(request.createdTs) || 'N/A' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ request.request || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ request.city || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ request.coords || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ request.radius || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ request.district || 'N/A' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <CsvDownloadButton :request-id="request.request_id" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else-if="
            !avitoAnalyticsAdsStore.loading &&
            avitoAnalyticsAdsStore.requests &&
            avitoAnalyticsAdsStore.requests.length === 0
          "
          class="text-center py-4 text-gray-50 dark:text-gray-400"
        >
          Нет данных для отображения
        </div>

        <div v-else-if="avitoAnalyticsAdsStore.loading" class="text-center py-4 text-gray-50 dark:text-gray-400">
          Загрузка данных...
        </div>

        <!-- Pagination -->
        <div
          v-if="avitoAnalyticsAdsStore.requests && avitoAnalyticsAdsStore.requests.length > 0"
          class="flex flex-col items-center mt-6"
        >
          <!-- Pagination info -->
          <div class="flex items-center justify-end w-full mb-4">
            <div class="flex items-center justify-between w-full mb-4">
              <div class="text-sm text-gray-700 dark:text-gray-400">
                Показано с
                {{ (avitoAnalyticsAdsStore.currentPage - 1) * avitoAnalyticsAdsStore.itemsPerPage + 1 }} по
                {{
                  Math.min(
                    avitoAnalyticsAdsStore.currentPage * avitoAnalyticsAdsStore.itemsPerPage,
                    avitoAnalyticsAdsStore.totalItems,
                  )
                }}
                из {{ avitoAnalyticsAdsStore.totalItems }} записей
              </div>
              <div class="flex items-center space-x-2">
                <label for="adsItemsPerPage" class="text-sm text-gray-700 dark:text-gray-400"
                  >Записей на странице:</label
                >
                <select
                  id="adsItemsPerPage"
                  v-model="itemsPerPage"
                  @change="onItemsPerPageChange"
                  class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            :total-items="avitoAnalyticsAdsStore.totalItems"
            :items-per-page="avitoAnalyticsAdsStore.itemsPerPage"
            @page-changed="onPageChanged"
            :loading="avitoAnalyticsAdsStore.loading"
          />
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAvitoAnalyticsAdsStore } from '@/entities/avito-analytics-ads';
import PageContainer from '@/features/page-container';
import { CsvDownloadButton } from '@/features/csv-download-button';
import Pagination from '@/features/pagination/Pagination.vue';

const router = useRouter();
const avitoAnalyticsAdsStore = useAvitoAnalyticsAdsStore();

// Pagination state
const itemsPerPage = ref<number>(avitoAnalyticsAdsStore.itemsPerPage);

// Sorting state
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const selectRequest = async (requestId: string) => {
  avitoAnalyticsAdsStore.selectRequest(requestId);
  router.push(`/avito-analytics/${requestId}`);
};

const navigateToNewRequest = () => {
  router.push('/avito-analytics/create');
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

// Computed property for sorted requests
const sortedRequests = computed(() => {
  if (!sortColumn.value) {
    return avitoAnalyticsAdsStore.requests;
  }

  return [...avitoAnalyticsAdsStore.requests].sort((a, b) => {
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
  await avitoAnalyticsAdsStore.fetchRequests(page, itemsPerPage.value);
};

const onItemsPerPageChange = async () => {
  // Reset to first page when changing items per page
  await avitoAnalyticsAdsStore.fetchRequests(1, itemsPerPage.value);
};

onMounted(async () => {
  await avitoAnalyticsAdsStore.fetchRequests(avitoAnalyticsAdsStore.currentPage, itemsPerPage.value);
});
</script>

<style scoped>
/* Custom styles for the component */
</style>
