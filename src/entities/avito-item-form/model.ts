import { defineStore } from 'pinia';
import { useAvitoItemsStore } from '@/entities';

export const useAvitoItemFormStore = defineStore('avito-item-form', {
  state: () => ({
    selected: null,
  }),

  actions: {
    setSelected(value: number) {
      this.selected = value;
    },
  },
  getters: {
    getSelectedItem() {
      const itemsStore = useAvitoItemsStore();

      return itemsStore.items?.find((x) => Number(x?.id) === Number(this?.selected));
    },
  },
});
