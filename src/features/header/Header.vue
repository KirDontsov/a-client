<template>
  <nav
    v-if="authStore.isAuthenticated"
    class="fixed top-0 z-50 w-full bg-white dark:bg-gray-700 "
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <a href="#" class="flex ms-2 md:me-24">
            <span
              class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
            >SUN7</span
            >
          </a>
        </div>
        <div class="flex items-center justify-between w-full">
          <div/>
          <div class="flex items-center gap-4 ms-3">

	          <div class="flex items-center flex-nowrap text-nowrap gap-2">
		          Аккаунт ID:
		          <select
		            id="avito-accounts-select"
		            :value="avitoAccountsStore.selectedAccountId"
		            @change="handleAccountChange"
		            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full min-w-[130px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
		          >
		           <option value="" disabled>Выберите аккаунт</option>
		           <option
		             v-for="account in avitoAccountsStore.accounts"
		             :key="account.account_id"
		             :value="account.account_id"
		           >
		            {{ account.client_id }}
		           </option>
		          </select>
	          </div>
            <div v-if="!!avitoAccountsStore.selectedAccountId" class="text-nowrap">Баланс: {{ balance ?? '' }} &#8381</div>
            <div class="w-full flex items-center">
              <Button
                v-if="authStore.isAuthenticated && authStore.user"
                type="button"
                variant="dark"
                color="default"
                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <img
                  class="w-8 h-8 rounded-full"
                  :src="authStore.user.photo && authStore.user.photo !== 'default.png' ? authStore.user.photo : 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'"
                  alt="user photo"
                />
              </Button>
              <Button
                v-if="authStore.isAuthenticated"
                @click="handleLogout"
                type="button"
                color="default"
                variant="dark"
                class="ml-4"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getAvitoBalance, getAvitoProfile, getAvitoToken } from "@/shared";
import { useCookies } from "@/entities";
import { useAuthStore } from "@/entities/auth/model";
import { useAvitoAccountsStore } from "@/entities/avito-accounts/model";
import router from "@/router";
import Cookies from 'js-cookie';
import { Button } from '@/shared/components';

const { value: token, set: setToken } = useCookies("token");
const { value: accountId } = useCookies('account_id', null);
const { value: avito_token, set: setAvitoToken } = useCookies("avito_token");

const balance = ref();

const authStore = useAuthStore();
const avitoAccountsStore = useAvitoAccountsStore();

// Fetch avito accounts when component mounts
onMounted(async () => {
	// Fetch accounts only if user is authenticated
	if (authStore.isAuthenticated) {
		await avitoAccountsStore.fetchAccounts();

		if (!avito_token.value) {
			// If no avito_token in cookies, try to get a new one
			// This likely happens when there's a selected account
			if (avitoAccountsStore.selectedAccountId) {
				const selectedAccount = avitoAccountsStore.accounts.find(account => account.account_id === avitoAccountsStore.selectedAccountId);
				if (selectedAccount) {
					const res = await getAvitoToken(selectedAccount.avito_client_id, selectedAccount.avito_client_secret);
					if (res?.data?.access_token) {
						setAvitoToken(res?.data?.access_token);

						const balanceRes = await getAvitoBalance({avito_token: res?.data?.access_token});
						if (balanceRes?.data) {
							balance.value = balanceRes?.data?.balance / 100;
						}
					}
				}
			}
		} else {
			const balanceRes = await getAvitoBalance({avito_token: avito_token.value});
			if (balanceRes?.data) {
				balance.value = balanceRes?.data?.balance / 100;
			}
		}
	}
});

// Watch for authentication changes and fetch accounts when user logs in
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
	if (isAuthenticated) {
		// User just logged in, fetch accounts
		await avitoAccountsStore.fetchAccounts();

		if (!avito_token.value) {
			// If no avito_token in cookies, try to get a new one
			// This likely happens when there's a selected account
			if (avitoAccountsStore.selectedAccountId) {
				const selectedAccount = avitoAccountsStore.accounts.find(account => account.account_id === avitoAccountsStore.selectedAccountId);
				if (selectedAccount) {
					const res = await getAvitoToken(selectedAccount.avito_client_id, selectedAccount.avito_client_secret);
					if (res?.data?.access_token) {
						setAvitoToken(res?.data?.access_token);

						const balanceRes = await getAvitoBalance({avito_token: res?.data?.access_token});
						if (balanceRes?.data) {
							balance.value = balanceRes?.data?.balance / 100;
						}
					}
				}
			}
		} else {
			const balanceRes = await getAvitoBalance({avito_token: avito_token.value});
			if (balanceRes?.data) {
				balance.value = balanceRes?.data?.balance / 100;
			}
		}
	}
}, { immediate: true });


const handleAccountChange = async (event) => {
  const selectedAccountId = event.target.value;
  avitoAccountsStore.selectAccount(selectedAccountId);

	const selectedAccount = avitoAccountsStore.accounts?.find(account => account.account_id === selectedAccountId);

	if (selectedAccount) {
		// Call the modified getAvitoToken function with client_id and client_secret
		const res = await getAvitoToken(selectedAccount.avito_client_id, selectedAccount.avito_client_secret);

		if (res?.data?.access_token) {
			setAvitoToken(res?.data?.access_token);

			const balanceRes = await getAvitoBalance({avito_token: res?.data?.access_token});
			if (balanceRes?.data) {
				balance.value = balanceRes?.data?.balance / 100;
			}
		}
	}
};

const handleLogout = async () => {
  await authStore.logout();
  // Clear all relevant cookies using js-cookie directly
	Cookies.remove('token');
  Cookies.remove('avito_token');
  Cookies.remove('account_id');
  // Redirect to login page
 await router.push('/login');
};
</script>

<style></style>
