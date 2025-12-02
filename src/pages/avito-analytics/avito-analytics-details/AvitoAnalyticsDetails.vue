<!-- components/AvitoAnalyticsDetails.vue -->
<template>
  <PageContainer>
    <template #body>
      <div class="w-full flex flex-col gap-8 px-4 py-2 sm:px-8 sm:py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-80 dark:text-white">
              {{ selectedRequest?.createdTs ? formatDate(selectedRequest.createdTs) : '' }}
            </h2>
            <h2 class="text-xl font-semibold text-gray-80 dark:text-white">
              {{ selectedRequest?.city }}
            </h2>
            <h2 class="text-xl font-semibold text-gray-80 dark:text-white">
              {{ selectedRequest?.request }}
            </h2>
          </div>
          <CsvDownloadButton
            :request-id="route.params.id as string"
            button-class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          />
        </div>

        <!-- Error message -->
        <div
          v-if="avitoAnalyticsAdsStore.error"
          class="mb-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-90 dark:text-red-100"
        >
          {{ avitoAnalyticsAdsStore.error }}
        </div>

        <!-- Table to display ads data -->
        <div
          v-if="avitoAnalyticsAdsStore.ads && avitoAnalyticsAdsStore.ads.length > 0"
          class="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 bg-gray-50 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-3 py-3 font-medium">ID</th>
                <th
                  v-for="header in tableHeaders"
                  :key="header.key"
                  scope="col"
                  class="px-3 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-nowrap"
                  @click="sortTable(header.key)"
                >
                  {{ header.title }}
                  <span v-if="sortColumn === header.key" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ad in avitoAnalyticsAdsStore.ads"
                :key="ad.ad_id"
                :class="[
                  'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
                  ad.my_ad === '*' ? 'bg-blue-50 dark:bg-green-900 dark:hover:bg-green-800' : '',
                ]"
              >
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate" :title="ad.ad_id">
                  <a
                    :href="ad.link"
                    target="_blank"
                    class="text-blue-600 hover:underline dark:text-blue-50 truncate max-w-xs inline-block"
                    :title="ad.link"
                  >
                    {{ ad.avito_ad_id || 'N/A' }}
                  </a>
                </td>
                <TextPopup :text-value="ad.title || 'N/A'" :max-length="40" title="Название" custom-class="max-w-xs" />
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.price || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.position || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.views || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                  <PromotionDisplay :promotion-value="ad.promotion || 'N/A'" />
                </td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.city_query || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.ad_date || 'N/A' }}</td>
                <td
                  class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate"
                  :title="ad.categories"
                >
                  {{ ad.categories || 'N/A' }}
                </td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">
                  <a
                    :href="ad.seller_id"
                    target="_blank"
                    class="text-blue-600 hover:underline dark:text-blue-50 truncate max-w-xs inline-block"
                    :title="ad.seller_id"
                  >
                    {{ ad.seller_name || 'N/A' }}
                  </a>
                </td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.seller_type || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.rating || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.reviews_count || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.photo_count || 'N/A' }}</td>
                <TextPopup
                  :text-value="ad.address || 'N/A'"
                  :max-length="40"
                  :showCopyButton="false"
                  title="Адрес"
                  custom-class="max-w-xs"
                />
                <TextPopup
                  :text-value="ad.description || 'N/A'"
                  :max-length="50"
                  title="Описание"
                  custom-class="max-w-xs"
                />
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.delivery || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.ads_count || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.closed_ads_count || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">
                  {{ ad.createdTs ? formatDate(ad.createdTs) : 'N/A' }}
                </td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.answer_time || 'N/A' }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ ad.register_date || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else-if="
            !avitoAnalyticsAdsStore.loading && avitoAnalyticsAdsStore.ads && avitoAnalyticsAdsStore.ads.length === 0
          "
          class="text-center py-4 text-gray-50 dark:text-gray-400"
        >
          Нет данных для отображения
        </div>

        <!-- Pagination -->
        <div
          v-if="avitoAnalyticsAdsStore.ads && avitoAnalyticsAdsStore.ads.length > 0"
          class="flex flex-col items-center w-full relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <!-- Pagination info -->
          <div class="flex items-center justify-between w-full mb-4">
            <div class="text-sm text-gray-700 dark:text-gray-400">
              Показано с
              {{ (avitoAnalyticsAdsStore.currentAdsPage - 1) * avitoAnalyticsAdsStore.adsItemsPerPage + 1 }} по
              {{
                Math.min(
                  avitoAnalyticsAdsStore.currentAdsPage * avitoAnalyticsAdsStore.adsItemsPerPage,
                  avitoAnalyticsAdsStore.totalAdsItems,
                )
              }}
              из {{ avitoAnalyticsAdsStore.totalAdsItems }} записей
            </div>
            <div class="flex items-center space-x-2">
              <label for="adsItemsPerPage" class="text-sm text-gray-700 dark:text-gray-400">Записей на странице:</label>
              <select
                id="adsItemsPerPage"
                v-model="adsItemsPerPage"
                @change="onAdsItemsPerPageChange"
                class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <!-- Pagination component -->
          <Pagination
            :total-items="avitoAnalyticsAdsStore.totalAdsItems"
            :items-per-page="avitoAnalyticsAdsStore.adsItemsPerPage"
            @page-changed="onAdsPageChanged"
            :loading="avitoAnalyticsAdsStore.loading"
          />
        </div>

        <ProgressDisplay :request-id="route.params.id as string" @data-update="handleDataUpdate" />
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useAvitoAnalyticsAdsStore } from '@/entities/avito-analytics-ads';
import { CsvDownloadButton } from '@/features';
import { PageContainer } from '@/features/page-container';
import { TextPopup } from '@/shared/components/text-popup';
import PromotionDisplay from '@/shared/components/promotion-display/PromotionDisplay.vue';
import { Pagination } from '@/features/pagination';

const ProgressDisplay = defineAsyncComponent(() => import('@/features/progress-display/ProgressDisplay.vue'));

const route = useRoute();
const avitoAnalyticsAdsStore = useAvitoAnalyticsAdsStore();

// Define table headers with titles and keys for sorting
const tableHeaders = [
  { key: 'title', title: 'Название' },
  { key: 'price', title: 'Цена' },
  { key: 'position', title: 'Поз.' },
  { key: 'views', title: 'Просмотры' },
  { key: 'promotion', title: 'Продвижение' },
  { key: 'city_query', title: 'Город' },
  { key: 'ad_date', title: 'Дата' },
  { key: 'categories', title: 'Категории' },
  { key: 'seller_name', title: 'Имя продавца' },
  { key: 'seller_type', title: 'Тип продавца' },
  { key: 'rating', title: 'Рейтинг' },
  { key: 'reviews_count', title: '# отзывов' },
  { key: 'photo_count', title: '# фото' },
  { key: 'address', title: 'Адрес' },
  { key: 'description', title: 'Описание' },
  { key: 'delivery', title: 'Доставка' },
  { key: 'ads_count', title: '# об.' },
  { key: 'closed_ads_count', title: '# закрытых об.' },
  { key: 'created_ts', title: 'Дата создания' },
  { key: 'answer_time', title: 'Время ответа' },
  { key: 'register_date', title: 'Дата регистрации' },
];

// Pagination state
const adsItemsPerPage = ref<number>(avitoAnalyticsAdsStore.adsItemsPerPage);

// Sorting state
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Find the selected request from the store requests
const selectedRequest = computed(() => {
  const requestId = route.params.id as string;
  return avitoAnalyticsAdsStore.requests.find((req) => req.request_id === requestId) || null;
});

onMounted(async () => {
  const requestId = route.params.id as string;
  if (requestId) {
    // Fetch ads data with pagination
    await avitoAnalyticsAdsStore.fetchAdsData(requestId, avitoAnalyticsAdsStore.currentAdsPage, adsItemsPerPage.value);

    // Try to fetch requests if they're not already loaded
    if (avitoAnalyticsAdsStore.requests.length === 0) {
      await avitoAnalyticsAdsStore.fetchRequests();
    }
  }
});

const handleDataUpdate = async () => {
  const requestId = route.params.id as string;
  await avitoAnalyticsAdsStore.fetchAdsData(requestId, avitoAnalyticsAdsStore.currentAdsPage, adsItemsPerPage.value);
};

// Pagination methods
const onAdsPageChanged = async (page: number) => {
  const requestId = route.params.id as string;
  await avitoAnalyticsAdsStore.fetchAdsData(requestId, page, adsItemsPerPage.value);
};

const onAdsItemsPerPageChange = async () => {
  // Reset to first page when changing items per page
  const requestId = route.params.id as string;
  await avitoAnalyticsAdsStore.fetchAdsData(requestId, 1, adsItemsPerPage.value);
};

const formatDate = (dateString: string) => {
  // Convert the date string to a more readable format
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
  // If clicking the same column, toggle direction; otherwise, set to ascending
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  // Sort the ads data
  if (avitoAnalyticsAdsStore.ads) {
    avitoAnalyticsAdsStore.ads.sort((a, b) => {
      // Get the values to compare based on the column
      let valA: any = a[column];
      let valB: any = b[column];

      // Handle special cases for different data types
      if (
        column === 'price' ||
        column === 'position' ||
        column === 'views' ||
        column === 'rating' ||
        column === 'reviews_count' ||
        column === 'photo_count' ||
        column === 'ads_count' ||
        column === 'closed_ads_count' ||
        column === 'answer_time'
      ) {
        // Convert to numbers for numeric comparison
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else if (column === 'ad_date' || column === 'createdTs' || column === 'register_date') {
        // Convert to dates for date comparison
        valA = new Date(valA) || new Date(0);
        valB = new Date(valB) || new Date(0);
      } else {
        // For string values, ensure they're strings
        valA = valA ? String(valA).toLowerCase() : '';
        valB = valB ? String(valB).toLowerCase() : '';
      }

      // Perform comparison based on sort direction
      if (sortDirection.value === 'asc') {
        if (valA < valB) return -1;
        if (valA > valB) return 1;
      } else {
        if (valA > valB) return -1;
        if (valA < valB) return 1;
      }
      return 0;
    });
  }
};
</script>

<style scoped>
/* Custom styles for the component */
</style>
