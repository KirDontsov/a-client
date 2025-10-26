import { defineStore } from "pinia";
import { checkAuth } from "@/shared";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    checkAuthLoading: true,
  }),
  actions: {
    async checkAuth() {
      try {
        const res = await checkAuth();

        this.isAuthenticated = !!res?.data?.user?.id || false;
        return res;
      } catch (e) {
        console.log("e", e);
      } finally {
        this.checkAuthLoading = false;
      }
    },
  },
});
