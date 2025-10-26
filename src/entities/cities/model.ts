import { defineStore } from 'pinia';
import type { CitiesQueryResult, City } from '@/shared';
import { getCities } from '@/shared/api/cities/cities';

export const useCitiesStore = defineStore('cities', {
  state: () => ({
    cities: null as City[] | null,
    citiesLoading: true,
  }),
  actions: {
    async getCities(): Promise<City[] | null> {
      try {
        const cities: CitiesQueryResult = await getCities({});

        this.cities = cities?.data?.cities?.filter((x) => x?.is_active === 'true') || null;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.citiesLoading = false;
      }
    },
  },
});
