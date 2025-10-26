import { defineStore } from 'pinia';
import type { CategoriesQueryResult, Category } from '@/shared';
import { getCategories } from '@/shared/api/categories';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: null as Category[] | null,
    categoriesLoading: true,
  }),

  actions: {
    async getCategories(): Promise<Category[] | null> {
      try {
        const categories: CategoriesQueryResult = await getCategories({});

        this.categories = categories?.data?.categories?.filter((x) => x?.is_active === 'true') || null;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.categoriesLoading = false;
      }
    },
  },
});
