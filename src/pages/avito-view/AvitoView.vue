<template>
  <PageContainer :loading="avitoItemsStore.itemsLoading">
    <template #body>
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
  useAvitoAccountsStore,
} from '@/entities';
import { PageContainer } from '@/features/page-container';
import { Pagination } from '@/features/pagination';
import { onMounted } from 'vue';
import { ItemCard } from '@/features/item-card';
import { ItemForm } from '@/features/item-form';
import { onAccountChange } from '@/shared/lib';

const { value: avito_token } = useCookies('avito_token');
const { value: account_id } = useCookies('account_id');

const avitoItemsStore = useAvitoItemsStore();
const avitoItemFormStore = useAvitoItemFormStore();
const avitoCategoryFieldsStore = useAvitoCategoryFieldsStore();
const avitoAccountsStore = useAvitoAccountsStore();

const ITEMS_PER_PAGE = 10;

onMounted(async () => {
  if (avito_token.value && (account_id.value || avitoAccountsStore.selectedAccountId)) {
    await loadItems(1);
  }

  // Subscribe to account changes and reload items when account changes
  onAccountChange((newAccountId) => {
    console.log('Account changed in AvitoView.vue, reloading items...');
    if (avito_token.value && newAccountId) {
      loadItems(1);
    }
  });
});

const loadItems = async (page) => {
  await avitoItemsStore.getAvitoItems({ page, limit: ITEMS_PER_PAGE });

  // Fetch category fields for the first item's category as an example
  // In a real implementation, you might want to fetch category fields for each unique category
  if (avitoItemsStore.items && avitoItemsStore.items.length > 0 && !avitoCategoryFieldsStore.categoryFields) {
    // For now, we'll use a placeholder category slug
    // In a real implementation, you would determine the actual category slug for each item

    await avitoCategoryFieldsStore.getAvitoCategoryFields({
      avito_token: avito_token.value,
      avito_slug: avitoItemsStore.category, // This should be replaced with actual category slug
    });
  }

  // Load analytics only on the first page
  if (page === 1) {
    const accountId = avitoAccountsStore.selectedAccountId || account_id.value;
    if (accountId) {
      await avitoItemsStore.getItemsAnalytics({
        avito_token: avito_token.value,
        account_id: `${accountId}`,
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
