import { defineStore } from 'pinia';
import {
  getAvitoAccounts,
  getAvitoAccountById,
  updateAvitoAccount,
  deleteAvitoAccount,
} from '@/shared/api/avito/avito';
import Cookies from 'js-cookie';
import { useCookies } from '@/entities';

export interface AvitoAccount {
  account_id: string;
  user_id: string;
  client_id: string;
  avito_client_secret: string;
  avito_client_id: string;
  is_connected: boolean;
  createdTs: string;
  updatedTs: string;
  // Add other account fields as needed
}

export interface AvitoAccountsState {
  accounts: AvitoAccount[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  selectedAccountId: string | null;
}

export const useAvitoAccountsStore = defineStore('avitoAccounts', {
  state: (): AvitoAccountsState => {
    const { value: selectedAccountId } = useCookies('account_id', null);
    console.log('selectedAccountId', selectedAccountId);
    return {
      accounts: [],
      loading: false,
      error: null,
      totalItems: 0,
      currentPage: 1,
      itemsPerPage: 10,
      selectedAccountId: selectedAccountId.value,
    };
  },

  actions: {
    async fetchAccounts(page: number = 1, limit: number = 10) {
      this.loading = true;
      this.error = null;

      try {
        const response = await getAvitoAccounts(page, limit);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        // Handle the API response format
        this.accounts = data?.avito_accounts ?? [];
        this.currentPage = page;
        this.itemsPerPage = limit;
      } catch (error) {
        console.error('Error fetching avito accounts:', error);
        this.error = error instanceof Error ? error.message : 'Failed to fetch accounts';
        this.accounts = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchAccount(accountId: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await getAvitoAccountById(accountId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Handle different possible response formats from the API
        const account = data.data?.avito_account || data.data || data.avito_account || data;

        // Update the accounts array with the fetched account
        const existingIndex = this.accounts.findIndex((acc) => acc.account_id === accountId);
        if (existingIndex !== -1) {
          this.accounts[existingIndex] = account;
        } else {
          // Make sure the account has the account_id field
          if (!account.account_id) {
            account.account_id = accountId;
          }
          this.accounts.push(account);
        }
      } catch (error) {
        console.error('Error fetching avito account:', error);
        this.error = error instanceof Error ? error.message : 'Failed to fetch account';
        throw error; // Re-throw to be handled by the component
      } finally {
        this.loading = false;
      }
    },

    getAccountById(accountId: string) {
      return this.accounts.find((account) => account.account_id === accountId);
    },

    selectAccount(accountId: string) {
      console.log('accountId', accountId);
      this.selectedAccountId = accountId;
      const { set: setSelectedAccountId } = useCookies('account_id', null);
      setSelectedAccountId(accountId);
    },

    clearSelectedAccount() {
      this.selectedAccountId = null;
      const { set: setSelectedAccountId } = useCookies('account_id', null);
      setSelectedAccountId(null);
    },

    async createAccount(accountData: { avito_client_id: string; avito_client_secret: string }) {
      this.loading = true;
      this.error = null;

      try {
        const { createAvitoAccount } = await import('@/shared/api/avito/avito');
        const authStore = await import('@/entities/auth/model').then((m) => m.useAuthStore());
        const userId = authStore.user?.id;

        if (!userId) {
          throw new Error('User not authenticated');
        }

        // Prepare the data to send to the API
        const requestData = {
          avito_client_id: accountData.avito_client_id,
          avito_client_secret: accountData.avito_client_secret,
          user_id: userId,
        };

        const response = await createAvitoAccount(requestData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the account list after creating a new one
        await this.fetchAccounts(this.currentPage, this.itemsPerPage);
      } catch (error) {
        console.error('Error creating avito account:', error);
        this.error = error instanceof Error ? error.message : 'Failed to create account';
        throw error; // Re-throw to be handled by the component
      } finally {
        this.loading = false;
      }
    },

    async updateAccount(accountId: string, accountData: { avito_client_id: string; avito_client_secret: string }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await updateAvitoAccount(accountId, accountData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the account list after updating
        await this.fetchAccounts(this.currentPage, this.itemsPerPage);
      } catch (error) {
        console.error('Error updating avito account:', error);
        this.error = error instanceof Error ? error.message : 'Failed to update account';
        throw error; // Re-throw to be handled by the component
      } finally {
        this.loading = false;
      }
    },

    async deleteAccount(accountId: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await deleteAvitoAccount(accountId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove the deleted account from the local array
        this.accounts = this.accounts.filter((account) => account.account_id !== accountId);

        // If the deleted account was the selected one, clear the selection
        if (this.selectedAccountId === accountId) {
          this.clearSelectedAccount();
          // Clear related cookies
          Cookies.remove('account_id');
          Cookies.remove('avito_token');
        }

        // Update total items count
        this.totalItems = Math.max(0, this.totalItems - 1);
      } catch (error) {
        console.error('Error deleting avito account:', error);
        this.error = error instanceof Error ? error.message : 'Failed to delete account';
        throw error; // Re-throw to be handled by the component
      } finally {
        this.loading = false;
      }
    },
  },
});
