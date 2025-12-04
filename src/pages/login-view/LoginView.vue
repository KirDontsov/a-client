<template>
  <div
    class="min-h-screen w-full overflow-hidden relative bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <!-- Orb background element -->
    <div class="absolute inset-0 w-full h-full z-0">
      <Orb :hoverIntensity="0.5" :rotateOnHover="true" :hue="0" :forceHoverState="false" />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Вход в аккаунт</h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
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
          <InputField
            id="email"
            v-model="email"
            type="email"
            label="Email адрес"
            placeholder="Введите ваш email"
            required
            autocomplete="email"
          />

          <InputField
            id="password"
            v-model="password"
            type="password"
            label="Пароль"
            placeholder="Введите ваш пароль"
            required
            autocomplete="current-password"
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox
                id="remember-me"
                name="remember-me"
                v-model="rememberMe"
                label="Запомнить меня"
              />
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
import { Checkbox } from '@/shared/components';
import InputField from '@/shared/components/input-field/InputField.vue';

const router = useRouter();
const email = ref();
const password = ref();
const rememberMe = ref(false);

const handleSubmit = async () => {
  const res = await login(email.value, password.value);

  if (res?.ok) {
    await router.push('/accounts');
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

/* Custom checkbox styling to show checkmark */
input[type="checkbox"] {
  @apply relative;
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 5px;
  height: 10px;
  border: solid white;
 border-width: 0 2px 2px 0;
}
</style>
