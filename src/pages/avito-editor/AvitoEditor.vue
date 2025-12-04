<template>
  <PageContainer :loading="avitoCategoriesStore.categoriesLoading">
    <template #body>
      <div
        v-if="!avitoCategoriesStore.categoriesLoading"
        class="w-full flex flex-col gap-8 text-gray-500 dark:text-gray-40 px-4 py-2 sm:px-8 sm:py-4"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Выберите категории</h2>

        <SelectedCategoryPath />
        <!-- Category selection tree -->
        <div
          class="relative overflow-x-auto shadow-md sm:rounded-lg max-w-full p-4 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
        >
          <div class="flex overflow-x-auto rounded-lg flex gap-4 py-4">
            <!-- Column for each level -->
            <div
              v-for="(levelCategories, levelIndex) in avitoCategoriesStore.visibleLevels"
              :key="levelIndex"
              class="min-w-[290px]"
            >
              <ul class="border border-gray-200 dark:border-gray-500 rounded-lg">
                <li
                  v-for="category in levelCategories"
                  :key="category?.slug"
                  class="p-3 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer transition-colors rounded-lg"
                  :class="{
                    'bg-blue-100 dark:bg-gray-600 font-medium': avitoCategoriesStore.isCategorySelected(
                      levelIndex,
                      category,
                    ),
                    'bg-white dark:bg-gray-700': !avitoCategoriesStore.isCategorySelected(levelIndex, category),
                  }"
                  @click="handleSelectCategory(levelIndex, category)"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-gray-800 dark:text-white">{{ category?.name }}</span>
                    <svg
                      v-if="category?.nested && category?.nested?.length > 0"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-gray-50 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup>
import { useCookies, useAvitoCategoriesStore, useAvitoAccountsStore } from '@/entities';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PageContainer } from '@/features/page-container';
import { SelectedCategoryPath } from '@/features';
import { onAccountChange } from '@/shared/lib';

const router = useRouter();

const { value: avito_token } = useCookies('avito_token');
const { value: account_id } = useCookies('account_id');

const avitoCategoriesStore = useAvitoCategoriesStore();
const avitoAccountsStore = useAvitoAccountsStore();

const handleSelectCategory = (levelIndex, category) => {
  avitoCategoriesStore.selectCategory(levelIndex, category);

  if (!category?.nested && !category?.nested) {
    router.push('/create');
  }
};

onMounted(async () => {
  if (avito_token.value) {
    if (avito_token.value && (account_id.value || avitoAccountsStore.selectedAccountId)) {
      await avitoCategoriesStore.getAvitoCategories({ avito_token: avito_token.value });
    }
  }

  // Subscribe to account changes and reload categories when account changes
  onAccountChange((newAccountId) => {
    console.log('Account changed in AvitoEditor.vue, reloading categories...');
    if (avito_token.value && newAccountId) {
      avitoCategoriesStore.getAvitoCategories({ avito_token: avito_token.value });
    }
  });
});
</script>

<style scoped></style>
