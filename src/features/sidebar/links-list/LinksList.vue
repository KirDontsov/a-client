<template>
  <ul v-if="authStore.isAuthenticated" class="space-y-2 font-medium">
    <li v-for="link in links" :key="link.id">
      <a
        :href="link.url"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        :class="{ 'bg-gray-100 dark:bg-gray-700': isLinkActive(link.url) }"
      >
        <icon :name="link.icon" :isSelected="isLinkActive(link.url)" />
        <span :class="{ hidden: !expanded }" class="ms-3">
          {{ link.name }}
        </span>
      </a>
    </li>
  </ul>
  <a
    v-else
    href="/login"
    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
  >
    <svg
      class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 16"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
      />
    </svg>
    <span :class="{ hidden: !expanded }" class="flex-1 ms-3 whitespace-nowrap bg-negroni-400"> Log In </span>
  </a>
</template>

<script setup>
import { onMounted, computed, onUnmounted } from 'vue';
import { useAuthStore } from '@/entities/index.js';
import { useSidebarState } from '@/entities/sidebar/index.js';
import Icon from '@/shared/icons/icon/index.ts';
import { createSidebarLinks } from '@/shared/config/index.js';

const links = createSidebarLinks();

const authStore = useAuthStore();
const { expanded, initialize } = useSidebarState();

const currentPath = computed(() => window.location.pathname);

const isLinkActive = (url) => {
  // For the home route, we only want it active when the path is exactly "/"
  if (url === '/') {
    return currentPath.value === url;
  }
  // For other routes, check if the current path starts with the link url
  return currentPath.value.startsWith(url);
};

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
