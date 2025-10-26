import { defineStore } from "pinia";

export const useCategoryStore = defineStore('category', {
  state: () => ({
    category: "Выберите категорию",
  }),

  actions: {
    setCategory(value: string) {
      this.category = value;
    }
  },
})