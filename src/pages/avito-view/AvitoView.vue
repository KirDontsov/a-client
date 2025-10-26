<template>
  <PageContainer :loading="avitoItemsStore.itemsLoading">
    <template #body>
      <CsvExporter
        v-if="avitoItemsStore.items?.length > 0 && !avitoItemsStore.itemsLoading"
        :items="avitoItemsStore.items"
      />
      <div
        v-if="avitoItemsStore.items?.length > 0 && !avitoItemsStore.itemsLoading"
        class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full"
      >
        <ItemCard
          :item="item"
          :analytics-data="avitoItemsStore.analyticsData"
          :analytics-loading="avitoItemsStore.analyticsLoading"
          :category-fields="avitoCategoryFieldsStore.categoryFields"
          :key="item.ad_id"
          v-for="item in avitoItemsStore.items"
          @select="handleSelect"
        />
      </div>

      <!-- Pagination -->
      <div v-if="avitoItemsStore.pagination" class="flex justify-center mt-4">
        <Pagination
          :loading="avitoItemsStore.itemsLoading"
          :total-items="avitoItemsStore.pagination.total_items || 0"
          :items-per-page="avitoItemsStore.pagination.per_page || ITEMS_PER_PAGE"
          @page-changed="handlePageChange"
        />
      </div>

      <ItemForm />
    </template>
  </PageContainer>
</template>

<script setup>
import {
  useAvitoItemFormStore,
 useAvitoItemsStore,
  useCookies,
  useAvitoCategoryFieldsStore,
} from '@/entities';
import PageContainer from '@/features/page-container';
import Pagination from '@/features/pagination';
import { onMounted } from 'vue';
import { getAvitoToken } from '@/shared/api/avito';
import ItemCard from '@/features/item-card';
import CsvExporter from '@/features/csv-exporter';
import ItemForm from '@/features/item-form/index.js';

const { value: avito_token } = useCookies('avito_token');
const { value: user_id } = useCookies('user_id');

const avitoItemsStore = useAvitoItemsStore();
const avitoItemFormStore = useAvitoItemFormStore();
const avitoCategoryFieldsStore = useAvitoCategoryFieldsStore();

const ITEMS_PER_PAGE = 10;

onMounted(async () => {
  if (!avito_token.value) {
    await getAvitoToken();
  } else {
    if (avito_token.value && user_id.value) {
      await loadItems(1);
    }
  }
});

const loadItems = async (page) => {
  await avitoItemsStore.getAvitoItems({ page, limit: ITEMS_PER_PAGE });

  // Fetch category fields for the first item's category as an example
  // In a real implementation, you might want to fetch category fields for each unique category
  if (avitoItemsStore.items && avitoItemsStore.items.length > 0 && !avitoCategoryFieldsStore.categoryFields) {
    // For now, we'll use a placeholder category slug
    // In a real implementation, you would determine the actual category slug for each item

    console.log('avitoItemsStore', avitoItemsStore);
    await avitoCategoryFieldsStore.getAvitoCategoryFields({
      avito_token: avito_token.value,
      avito_slug: avitoItemsStore.category, // This should be replaced with actual category slug
    });
  }

  // Load analytics only on the first page
  if (page === 1) {
    await avitoItemsStore.getItemsAnalytics({
      avito_token: avito_token.value,
      account_id: `${user_id.value}`,
      dateFrom: '2025-08-01',
      dateTo: '2025-08-31',
      grouping: 'item',
      limit: 100,
      metrics: [
        'views',
        'contacts',
        'favorites',
        'viewsToContactsConversion',
        'averageViewCost',
        'averageContactCost',
        'impressions',
        'impressionsToViewsConversion',
        'spending',
      ],
      offset: 0,
    });
  }

  avitoItemsStore.setItemsLoading(false);
};

const handlePageChange = async (page) => {
  avitoItemsStore.setItemsLoading(true);
  await loadItems(page);
};

const handleSelect = (value) => {
  avitoItemFormStore.setSelected(value);
};
</script>

<style></style>
