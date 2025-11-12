<template>
  <div
    v-if="avitoCategoriesStore.selectedCategories.length > 0"
    class="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col gap-4"
  >
    <div class="flex items-center justify-between mt-1 flex-wrap">
      <div class="flex items-center flex-wrap">
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
      <Button variant="dark" color="default" @click="handleClearCategories" class="mt-2 text-sm w-fit">
        Сбросить выбор
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useAvitoCategoriesStore } from '@/entities';
import { Button } from '@/shared/components/button';
import { useRouter, useRoute } from 'vue-router';

const avitoCategoriesStore = useAvitoCategoriesStore();
const router = useRouter();
const route = useRoute();

const handleClearCategories = () => {
  avitoCategoriesStore.clearSelectedCategories();
  if (route.path === '/create') {
    router.push('/editor');
  }
};
</script>
