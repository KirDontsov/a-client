<template>
  <div :class="{ 'sm:ml-[64px]': !expanded, 'sm:ml-64 p-4 relative top-[78px]': true }">
    <div class="grid grid-cols-1 gap-4">
      <!-- Show loader when analytics are loading -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <span class="ml-2 text-gray-700 dark:text-gray-300">Загрузка...</span>
      </div>
      <slot v-else name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useSidebarState } from '@/entities';

interface Props {
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const { expanded, initialize } = useSidebarState();

onMounted(() => {
  // Initialize the sidebar state management
  const cleanup = initialize();

  // Store cleanup function to run on component unmount
  onUnmounted(() => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  });
});
</script>

<style></style>
