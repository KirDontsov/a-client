import { defineStore } from 'pinia';
import { checkAuth, logout as apiLogout } from '@/shared/api/auth/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    checkAuthLoading: true,
    user: null,
  }),
  actions: {
    async checkAuth() {
      try {
        const res = await checkAuth();

        if (res?.status === 'success' && res?.data?.user) {
          // Check if user data exists and if there are differences
          if (this.user) {
            // Compare user data and update if different
            const currentUser = this.user;
            const serverUser = res.data.user;

            // Check if any user properties are different
            const isDifferent =
              currentUser.id !== serverUser.id ||
              currentUser.name !== serverUser.name ||
              currentUser.email !== serverUser.email ||
              currentUser.role !== serverUser.role ||
              currentUser.photo !== serverUser.photo ||
              currentUser.verified !== serverUser.verified ||
              JSON.stringify(currentUser.favourite) !== JSON.stringify(serverUser.favourite);

            if (isDifferent) {
              // Update user info if there are differences
              this.user = { ...serverUser };
            }
          } else {
            // Set user info for the first time
            this.user = { ...res.data.user };
          }

          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
          this.user = null;
        }

        return res;
      } catch (e) {
        console.log('e', e);
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.checkAuthLoading = false;
      }
    },
    
    async logout() {
      try {
        // Call the backend logout endpoint
        await apiLogout();
      } catch (e) {
        console.log('Logout API error:', e);
      } finally {
        // Clear user data from the store regardless of API call success
        this.isAuthenticated = false;
        this.user = null;
        
        // Clear authentication-related cookies
        try {
          const Cookies = await import('js-cookie');
          // Remove common auth-related cookies
          ['token', 'auth_token', 'session', 'refresh_token', 'access_token'].forEach(cookieName => {
            if (Cookies.default.get(cookieName)) {
              Cookies.default.remove(cookieName);
            }
          });
        } catch (cookieError) {
          console.log('Error clearing cookies:', cookieError);
        }
      }
    }
 },
});
