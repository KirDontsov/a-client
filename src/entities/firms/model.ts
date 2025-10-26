import { defineStore } from 'pinia';
import { useCityStore } from '../city';
import { useCategoryStore } from '@/entities';
import type { Firm } from '@/shared';
import { getFirms } from '@/shared/api/firms';

export const useFirmsStore = defineStore('firms', {
  state: () => ({
    firms: null as Firm[] | null,
    firmsLoading: true,
  }),

  actions: {
    async getFirms(page, limit): Promise<Firm[] | null> {
      const cityStore = useCityStore();
      const categoryStore = useCategoryStore();
      try {
        if (
          !cityStore.city ||
          ['Выберите город'].indexOf(cityStore.city) !== -1 ||
          !categoryStore.category ||
          ['Выберите категорию'].indexOf(categoryStore.category) !== -1
        ) {
          return null;
        }

        const firms = await getFirms({ city: cityStore.city, category: categoryStore.category, page, limit });

        this.firms = firms?.data?.firms || null;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.firmsLoading = false;
      }
    },
  },
});
