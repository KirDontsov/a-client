import { defineStore } from 'pinia';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export const usePaginationStore = defineStore('pagination', {
  state: (): PaginationState => ({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  }),

  getters: {
    hasNextPage: (state) => state.currentPage < state.totalPages,
    hasPrevPage: (state) => state.currentPage > 1,
    pageNumbers: (state) => {
      const pages = [];
      for (let i = 1; i <= state.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  actions: {
    setCurrentPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    setItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      // Reset to first page when changing items per page
      this.currentPage = 1;
      this.calculateTotalPages();
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
      this.calculateTotalPages();
    },

    calculateTotalPages() {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      }
    },

    nextPage() {
      if (this.hasNextPage) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.hasPrevPage) {
        this.currentPage--;
      }
    },

    reset() {
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.totalItems = 0;
      this.totalPages = 0;
    },
  },
});