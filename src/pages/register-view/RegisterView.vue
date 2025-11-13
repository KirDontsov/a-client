<template>
  <div
    class="min-h-screen w-full overflow-hidden relative bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <!-- Orb background element -->
    <div class="absolute inset-0 w-full h-full z-0">
      <Orb :hoverIntensity="0.5" :rotateOnHover="true" :hue="0" :forceHoverState="false" />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Создать аккаунт</h2>
      <p class="mt-2 text-center text-sm text-gray-400">
        Или
        <router-link
          to="/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          войдите в существующий аккаунт
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="name"
                type="text"
                autocomplete="name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

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
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Подтвердите пароль</label
            >
            <div class="mt-1">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">
                  Я согласен с
                  <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    условиями использования
                  </a>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              :disabled="loading"
            >
              <span v-if="loading">Загрузка...</span>
              <span v-else>Зарегистрироваться</span>
            </button>
          </div>
        </form>

        <div v-if="errorMessage" class="mt-4 w-full p-2 bg-red-500 text-white text-sm rounded text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/shared/api/auth/auth';
import Orb from '@/features/orb/Orb.vue';
import InputField from '@/shared/components/input-field/InputField.vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);

const validateForm = () => {
  if (!name.value.trim()) {
    errorMessage.value = 'Имя обязательно для заполнения';
    return false;
  }

  if (!email.value.trim()) {
    errorMessage.value = 'Email обязателен для заполнения';
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Некорректный формат email';
    return false;
  }

  if (!password.value) {
    errorMessage.value = 'Пароль обязателен для заполнения';
    return false;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Пароль должен содержать не менее 6 символов';
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const userData = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    const res = await register(userData);

    if (res?.ok) {
      console.log('Регистрация успешна');
      await router.push('/login');
    } else {
      const errorData = await res.json().catch(() => ({}));
      errorMessage.value = errorData.message || `Ошибка регистрации: ${res?.status}`;
      console.warn('Ошибка регистрации: ' + res?.status + ' ' + res?.message);
    }
  } catch (error) {
    errorMessage.value = 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.';
    console.error('Ошибка при регистрации:', error);
  } finally {
    loading.value = false;
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
