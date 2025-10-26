<template>
  <PageContainer :loading="avitoCategoriesStore.categoriesLoading">
    <template #body>
      <div
        v-if="!avitoCategoriesStore.categoriesLoading"
        class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Выберите категории</h2>
        </div>

        <!-- Category selection tree -->
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
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
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

        <!-- Selected category path -->
        <div
          v-if="avitoCategoriesStore.selectedCategories.length > 0"
          class="mt-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg flex flex-col gap-4"
        >
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Выбранный путь:</h2>
          <div class="flex items-center mt-1 flex-wrap">
            <span
              v-for="(category, index) in avitoCategoriesStore.selectedCategories"
              :key="index"
              class="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center"
            >
              {{ category?.name }}
              <span
                v-if="index < avitoCategoriesStore.selectedCategories.length - 1"
                class="mx-2 text-gray-400 dark:text-gray-500"
                >/</span
              >
            </span>
          </div>
          <button @click="avitoCategoriesStore.clearSelectedCategories()" class="mt-2 text-sm w-fit">
            Сбросить выбор
          </button>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup>
import { useCookies, useAvitoCategoriesStore } from '@/entities';
import { onMounted } from 'vue';
import { getAvitoToken } from '@/shared/api/avito';
import { useRouter } from 'vue-router';
import PageContainer from '@/features/page-container';

const router = useRouter();

const { value: avito_token } = useCookies('avito_token');
const { value: user_id } = useCookies('user_id');

const avitoCategoriesStore = useAvitoCategoriesStore();

const handleSelectCategory = (levelIndex, category) => {
  avitoCategoriesStore.selectCategory(levelIndex, category);

  if (!category?.nested && !category?.nested) {
    router.push('/create');
  }
};

onMounted(async () => {
  if (!avito_token.value) {
    await getAvitoToken();
  } else {
    if (avito_token.value && user_id.value) {
      await avitoCategoriesStore.getAvitoCategories({ avito_token: avito_token.value });
    }
  }
});
</script>

<style scoped></style>
