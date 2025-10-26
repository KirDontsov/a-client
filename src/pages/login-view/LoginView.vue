<template>
  <div class="sm:ml-64 p-4 relative top-[78px]">
    <div class="flex items-center justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">Login</div>
    <div class="flex items-center px-8 py-4 mb-4 gap-4 rounded-sm bg-gray-50 dark:bg-gray-700">
      <input
        type="text"
        id="email"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="email@email.ru"
        v-model="email"
      />
      <input
        type="password"
        id="firm_name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <div class="flex items-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
      <button @click="handleSubmit">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/shared/api';

const router = useRouter();
const email = ref();
const password = ref();

const handleSubmit = async () => {
  const res = await login(email.value, password.value);

  if (res?.ok) {
    await router.push('/');
  } else {
    console.warn('Ошибка HTTP: ' + res.status);
  }
};
</script>

<style></style>
