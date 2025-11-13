<template>
  <div
    class="min-h-screen w-full overflow-hidden relative bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <!-- Orb background element -->
    <div class="absolute inset-0 w-full h-full z-0">
      <Orb :hoverIntensity="0.5" :rotateOnHover="true" :hue="0" :forceHoverState="false" />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Вход в аккаунт</h2>
      <p class="mt-2 text-center text-sm text-gray-400">
        Или
        <router-link
          to="/register"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          зарегистрируйтесь
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email адрес</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Пароль</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Запомнить меня
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Забыли пароль?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/shared/api';
import Orb from '@/features/orb/Orb.vue';

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

<style scoped>
/* Add some additional styling to ensure the orbs don't interfere with content */
.min-h-screen {
  min-height: 100vh;
  position: relative;
}
</style>
