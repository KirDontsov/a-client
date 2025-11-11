<!-- components/AvitoFeedsDetails.vue -->
<template>
  <PageContainer>
    <template #body>
      <div
        class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-80 dark:text-white">
              Feed ID: {{ feedDetails?.feed_id || 'N/A' }}
            </h2>
            <h2 class="text-xl font-semibold text-gray-80 dark:text-white">
              Category: {{ feedDetails?.category || 'N/A' }}
            </h2>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
          {{ error }}
        </div>

        <!-- Table to display feed ads data -->
        <div v-if="feedAds && feedAds.length > 0" class="relative overflow-x-auto shadow-md sm:rounded-lg max-w-full">
          <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 bg-gray-50 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-3 py-3 font-medium">Ad ID</th>
                <th scope="col" class="px-3 py-3 font-medium">Avito Ad ID</th>
                <th
                  v-for="fieldKey in fieldKeys"
                  :key="fieldKey"
                  scope="col"
                  class="px-3 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-nowrap"
                  @click="sortTable(fieldKey)"
                >
                  {{ fieldKey }}
                  <span v-if="sortColumn === fieldKey" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ad in feedAds"
                :key="ad.ad_id"
                :class="[
                  'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
                ]"
              >
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate" :title="ad.ad_id">
                  {{ ad.ad_id || 'N/A' }}
                </td>
                <td
                  class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate"
                  :title="ad.avito_ad_id"
                >
                  <a
                    :href="ad.avito_ad_id ? 'https://www.avito.ru/' + ad.avito_ad_id : '#'"
                    target="_blank"
                    class="text-blue-600 hover:underline dark:text-blue-50 truncate max-w-xs inline-block"
                    :title="ad.avito_ad_id || 'N/A'"
                  >
                    {{ ad.avito_ad_id || 'N/A' }}
                  </a>
                </td>
                <td
                  v-for="fieldKey in fieldKeys"
                  :key="fieldKey"
                  class="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate"
                  :title="ad[fieldKey] || 'N/A'"
                >
                  <TextPopup
                    v-if="['title', 'description', 'address'].includes(fieldKey)"
                    :text-value="ad[fieldKey] || 'N/A'"
                    :max-length="40"
                    :title="fieldKey"
                    custom-class="max-w-xs"
                  />
                  <PromotionDisplay v-else-if="fieldKey === 'promotion'" :promotion-value="ad[fieldKey] || 'N/A'" />
                  <span v-else>{{ ad[fieldKey] || 'N/A' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else-if="!loading && feedAds && feedAds.length === 0"
          class="text-center py-4 text-gray-50 dark:text-gray-400"
        >
          Нет данных для отображения
        </div>

        <!-- Loading indicator -->
        <div v-if="loading" class="text-center py-4 text-gray-50 dark:text-gray-400">Загрузка данных...</div>

        <!-- Pagination -->
        <div v-if="feedAds && feedAds.length > 0" class="flex flex-col items-center mt-6">
          <!-- Pagination info -->
          <div class="flex items-center justify-between w-full mb-4">
            <div class="text-sm text-gray-700 dark:text-gray-400">
              Показано с
              {{ (currentPage - 1) * itemsPerPage + 1 }} по
              {{ Math.min(currentPage * itemsPerPage, totalItems) }}
              из {{ totalItems }} записей
            </div>
            <div class="flex items-center space-x-2">
              <label for="itemsPerPage" class="text-sm text-gray-700 dark:text-gray-400">Записей на странице:</label>
              <select
                id="itemsPerPage"
                v-model="itemsPerPage"
                @change="onItemsPerPageChange"
                class="bg-gray-50 border-gray-30 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            :total-items="totalItems"
            :items-per-page="itemsPerPage"
            @page-changed="onPageChanged"
            :loading="loading"
          />
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PageContainer } from '@/features/page-container';
import { TextPopup } from '@/shared/components/text-popup';
import { PromotionDisplay } from '@/shared/components/promotion-display';
import { Pagination } from '@/features/pagination';
import { getAvitoFeedById } from '@/shared/api/avito/avito';

const route = useRoute();

// State
const feedDetails = ref<any>(null);
const feedAds = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Sorting state
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Computed property to get all unique field keys from the ads data
const fieldKeys = computed(() => {
  if (!feedAds.value || feedAds.value.length === 0) return [];

  // Get all unique keys from all ads, excluding the basic fields
  const allKeys = new Set<string>();
  feedAds.value.forEach((ad) => {
    Object.keys(ad).forEach((key) => {
      // Exclude basic fields that are already handled separately
      if (!['ad_id', 'avito_ad_id', 'parsed_id', 'is_active', 'status', 'created_ts'].includes(key)) {
        allKeys.add(key);
      }
    });
  });

  return Array.from(allKeys);
});

onMounted(async () => {
  const feedId = route.params.id as string;
  if (feedId) {
    await fetchFeedDetails(feedId, currentPage.value, itemsPerPage.value);
  }
});

const fetchFeedDetails = async (feedId: string, page: number = 1, limit: number = 10) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getAvitoFeedById(feedId, page, limit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different possible response formats from the API
    if (data && data.data) {
      feedDetails.value = data.data;
      // Transform the ads data to match the expected table structure
      const transformedAds = data.data.ads.map((ad: any) => {
        // Create a flat object with field values mapped to their tags
        const transformedAd: any = {
          ad_id: ad.ad_id,
          avito_ad_id: ad.avito_ad_id,
          parsed_id: ad.parsed_id,
          is_active: ad.is_active,
          status: ad.status,
          created_ts: ad.created_ts,
        };

        // Process fields array and add each field's value to the ad object
        if (ad.fields && Array.isArray(ad.fields)) {
          ad.fields.forEach((field: any) => {
            // Get the first value if available, otherwise use 'N/A'
            const value = field.values && field.values.length > 0 ? field.values[0].value : 'N/A';
            transformedAd[field.tag] = value;
          });
        }

        return transformedAd;
      });

      feedAds.value = transformedAds;

      // Update pagination info if available in response
      if (data.pagination) {
        totalItems.value = data.pagination.total;
        itemsPerPage.value = data.pagination.limit;
        currentPage.value = data.pagination.page;
      } else {
        totalItems.value = transformedAds.length;
      }
    } else if (data && Array.isArray(data)) {
      feedAds.value = data;
      totalItems.value = data.length;
    } else {
      feedAds.value = [];
      totalItems.value = 0;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch feed details';
    console.error('Error fetching feed details:', err);
    feedAds.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// Pagination methods
const onPageChanged = async (page: number) => {
  currentPage.value = page;
  const feedId = route.params.id as string;
  if (feedId) {
    await fetchFeedDetails(feedId, page, itemsPerPage.value);
  }
};

const onItemsPerPageChange = async () => {
  // Reset to first page when changing items per page
  currentPage.value = 1;
  const feedId = route.params.id as string;
  if (feedId) {
    await fetchFeedDetails(feedId, 1, itemsPerPage.value);
  }
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

  // Sort the feed ads data
  if (feedAds.value) {
    feedAds.value.sort((a, b) => {
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
      } else if (column === 'ad_date' || column === 'created_ts' || column === 'register_date') {
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
