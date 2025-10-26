import { defineStore } from "pinia";

export const useCityStore = defineStore('city', {
  state: () => ({
    city: "Выберите город",
  }),

  actions: {
    setCity(value: string) {
      this.city = value;
    }
  },
})