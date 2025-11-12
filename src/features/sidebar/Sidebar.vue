<template>
  <aside
    v-if="authStore.isAuthenticated"
    id="cta-button-sidebar"
    :class="{
      'w-[64px]': !expanded,
      'w-64': expanded,
    }"
    class="fixed top-[72px] left-0 z-40 h-[calc(100svh-78px)] transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div :class="{ 'px-1': !expanded }" class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 relative">
      <LinksList />

      <div
        id="dropdown-cta"
        :class="{ hidden: !expanded }"
        class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-90"
        role="alert"
      >
        <div class="flex items-center mb-3">
          <span
            class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-orange-200 dark:text-orange-900"
          >
            Beta
          </span>
        </div>
        <p class="mb-3 text-sm text-blue-800 dark:text-blue-40">
          Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your
          profile.
        </p>
        <a
          class="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          href="#"
          >Turn new navigation off</a
        >
      </div>

      <Button
        @click="handleToggleExpanded"
        type="button"
        color="default"
        variant="dark"
        button-class="absolute bottom-10 right-1 !p-2.5 me-2"
      >
        <svg
          class="w-4 h-4 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
        <span class="sr-only">Свернуть</span>
      </Button>
    </div>
  </aside>
</template>

<script setup>
import { useSidebarState } from '@/entities';
import { onMounted, onUnmounted } from 'vue';
import { LinksList } from './links-list';
import { useAuthStore } from '@/entities/auth/model';
import { Button } from '@/shared/components';

const { expanded, initialize, toggleExpanded } = useSidebarState();
const authStore = useAuthStore();

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

// Handle toggle expanded
const handleToggleExpanded = () => {
  toggleExpanded();
};
</script>

<style></style>
