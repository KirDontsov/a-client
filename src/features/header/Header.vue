<template>
  <nav
    class="fixed top-0 z-50 w-full bg-white border-b dark:bg-gray-700 dark:border-gray-700"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <a href="#" class="flex ms-2 md:me-24">
            <span
              class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
            >ТОП ВЫБОР</span
            >
          </a>
        </div>
        <div class="flex items-center justify-between w-full">
          <div/>
          <div class="flex items-center gap-4 ms-3">
            <div class="text-nowrap">ID: {{ userId ?? '' }}</div>
            <div class="text-nowrap">Баланс: {{ balance ?? '' }} &#8381</div>
            <div class="w-full flex items-center">
              <button
                v-if="authStore.isAuthenticated && authStore.user"
                type="button"
                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <img
                  class="w-8 h-8 rounded-full"
                  :src="authStore.user.photo && authStore.user.photo !== 'default.png' ? authStore.user.photo : 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'"
                  alt="user photo"
                />
              </button>
              <button
                v-if="authStore.isAuthenticated"
                @click="handleLogout"
                type="button"
                class="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAvitoBalance, getAvitoProfile, getAvitoToken } from "@/shared";
import { useCookies } from "@/entities";
import { useAuthStore } from "@/entities/auth/model";
import router from "@/router";
import Cookies from 'js-cookie';

const { set: setToken } = useCookies("token");
const { value: userId, set: setUserId } = useCookies('user_id', null);
const { value: avito_token, set: setAvitoToken } = useCookies("avito_token");

const balance = ref();


const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  // Clear all relevant cookies using js-cookie directly
 Cookies.remove('token');
  Cookies.remove('avito_token');
  Cookies.remove('user_id');
  // Redirect to login page
 await router.push('/login');
};

onMounted(async () => {
  if (!avito_token.value) {
	  const res = await getAvitoToken();
	
	  if (res?.data?.access_token) {
		  setAvitoToken(res?.data?.access_token);

		  const profileRes = await getAvitoProfile({avito_token: res?.data?.access_token})
		  if (profileRes?.data) {
			  setUserId(profileRes?.data?.id || null)
		  }
		  const balanceRes = await getAvitoBalance({avito_token: res?.data?.access_token});
		  if (balanceRes?.data) {
			  balance.value = balanceRes?.data?.balance / 100;
		  }
	  }
  } else {
	  const profileRes = await getAvitoProfile({avito_token: avito_token.value})
	  if (profileRes?.data) {
		  setUserId(profileRes?.data?.id || null)
	  }
	  const balanceRes = await getAvitoBalance({avito_token: avito_token.value});
	  if (balanceRes?.data) {
		  balance.value = balanceRes?.data?.balance / 100;
	  }
  }
});
</script>

<style></style>
