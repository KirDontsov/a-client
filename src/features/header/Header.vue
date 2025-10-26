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
                type="button"
                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <img
                  class="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
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

const { value: avito_token } = useCookies("avito_token");

const balance = ref();

const { value: userId, set: setUserId } = useCookies('user_id', null);

onMounted(async () => {
  if (!avito_token.value) {
    getAvitoToken();
  } else {

    const profileRes = await getAvitoProfile({ avito_token: avito_token.value })
    if (profileRes?.data) {
      setUserId(profileRes?.data?.id || null)
    }
    const balanceRes = await getAvitoBalance({ avito_token: avito_token.value });
    if (balanceRes?.data) {
      balance.value = balanceRes?.data?.balance / 100;
    }
  }
});
</script>

<style></style>
