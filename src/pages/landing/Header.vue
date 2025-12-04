<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="absolute top-4 right-4 z-50">
      <ThemeToggle />
    </div>
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">A</span>
        </div>
        <span class="text-xl font-bold text-gray-800 dark:text-white text-nowrap">Avito Manager</span>
      </div>

      <nav class="hidden md:flex space-x-8">
        <a
          href="#features"
          class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >Функции</a
        >
        <a
          href="#benefits"
          class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >Преимущества</a
        >
        <a
          href="#cta"
          class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >Начать</a
        >
      </nav>

      <div class="flex items-center space-x-4">
        <button
          @click="goToLogin"
          class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          Войти
        </button>
        <button
          @click="goToRegister"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Регистрация
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ThemeToggle from '@/shared/components/theme-toggle/ThemeToggle.vue';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
