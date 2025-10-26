<template>
  <nav aria-label="Page navigation example">
    <ul class="flex items-center -space-x-px h-8 text-sm gap-2">
      <!-- Previous button -->
      <li>
        <button
          @click="prevPage"
          :disabled="!hasPrevPage || loading"
          class="flex items-center justify-center px-3 h-8 ms-0 leading-tight"
          :class="{
            'text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
              !(!hasPrevPage || loading),
            'text-gray-300 bg-gray-100 dark:bg-gray-70 dark:border-gray-600 dark:text-gray-500 cursor-not-allowed':
              !hasPrevPage || loading,
          }"
        >
          <span class="sr-only">Previous</span>
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </button>
      </li>

      <!-- Page numbers -->
      <li v-for="page in visiblePages" :key="page">
        <button
          @click="setCurrentPage(page)"
          :aria-current="page === currentPage ? 'page' : undefined"
          class="flex items-center justify-center px-3 h-8 leading-tight"
          :class="{
            'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-70 dark:text-white':
              page === currentPage,
            'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
              page !== currentPage,
          }"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next button -->
      <li>
        <button
          @click="nextPage"
          :disabled="!hasNextPage || loading"
          class="flex items-center justify-center px-3 h-8 leading-tight rounded-e-lg"
          :class="{
            'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
              !(!hasNextPage || loading),
            'text-gray-300 bg-gray-100 dark:bg-gray-70 dark:border-gray-600 dark:text-gray-500 cursor-not-allowed':
              !hasNextPage || loading,
          }"
        >
          <span class="sr-only">Next</span>
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePaginationStore } from '@/entities/pagination/model';

interface Props {
  loading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  totalItems: 0,
  itemsPerPage: 10,
});

const emit = defineEmits<{
  (e: 'page-changed', page: number): void;
  (e: 'items-per-page-changed', itemsPerPage: number): void;
}>();

const paginationStore = usePaginationStore();

// Watch for changes in props and update the store accordingly
watch(
  () => props.totalItems,
  (newTotalItems) => {
    paginationStore.setTotalItems(newTotalItems);
  },
  { immediate: true },
);

watch(
  () => props.itemsPerPage,
  (newItemsPerPage) => {
    // Only update items per page if it's actually changing
    if (newItemsPerPage !== paginationStore.itemsPerPage) {
      paginationStore.setItemsPerPage(newItemsPerPage);
    }
  },
  { immediate: true },
);

// Computed properties from the store
const currentPage = computed(() => paginationStore.currentPage);
const totalPages = computed(() => paginationStore.totalPages);
const hasNextPage = computed(() => paginationStore.hasNextPage);
const hasPrevPage = computed(() => paginationStore.hasPrevPage);
const pageNumbers = computed(() => paginationStore.pageNumbers);

// Visible pages (show first, last, and pages around current page)
const visiblePages = computed(() => {
  const pages = [];
  const pageCount = totalPages.value;
  const current = currentPage.value;

  // If there are no pages, return empty array
  if (pageCount <= 0) {
    return [];
  }

  if (pageCount <= 7) {
    // Show all pages if 7 or fewer
    return pageNumbers.value;
  }

  // Always show first page
  pages.push(1);

  if (current > 4) {
    // Show ellipsis if current page is far from start
    pages.push('...');
  }

  // Show pages around current page
  const start = Math.max(2, current - 1);
  const end = Math.min(pageCount - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < pageCount - 3) {
    // Show ellipsis if current page is far from end
    pages.push('...');
  }

  // Always show last page
  if (pageCount > 1) {
    pages.push(pageCount);
  }

  return pages;
});

// Navigation methods
function setCurrentPage(page: number) {
  if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
    paginationStore.setCurrentPage(page);
    emit('page-changed', page);
  }
}

function nextPage() {
  if (hasNextPage.value) {
    paginationStore.nextPage();
    emit('page-changed', paginationStore.currentPage);
  }
}

function prevPage() {
  if (hasPrevPage.value) {
    paginationStore.prevPage();
    emit('page-changed', paginationStore.currentPage);
  }
}
</script>

<style></style>
