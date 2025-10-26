import { defineStore } from 'pinia';
import type { Firm } from '@/shared';
import { getFirmByUrl } from '@/shared/api';

export const useSelectedFirmStore = defineStore('selectedFirm', {
  state: () => ({
    firm: null as Firm | null,
    firmLoading: false,
  }),
  actions: {
    async getFirm(firm_id): Promise<Firm[] | null> {
      try {
        this.firmLoading = true;

        const firm = await getFirmByUrl(firm_id);

        this.firm = firm?.data?.firm || null;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.firmLoading = false;
      }
    },
  },
});
