<template>
  <div
    class="min-h-screen w-full overflow-hidden relative bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <!-- Orb background element -->
    <div class="absolute inset-0 w-full h-full z-0">
      <Orb :hoverIntensity="0.5" :rotateOnHover="true" :hue="0" :forceHoverState="false" />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Создать аккаунт</h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
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
          <InputField
            id="name"
            v-model="name"
            type="text"
            label="Имя"
            placeholder="Введите ваше имя"
            required
            autocomplete="name"
          />

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
            autocomplete="new-password"
          />

          <InputField
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            label="Подтвердите пароль"
            placeholder="Подтвердите ваш пароль"
            required
            autocomplete="new-password"
          />

          <div class="flex items-start">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <Checkbox
                  id="terms"
                  name="terms"
                  v-model="termsAccepted"
                  :required="true"
                  label="Я согласен с "
                />
                <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                  условиями использования
                </a>
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
import { Checkbox } from '@/shared/components';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);
const termsAccepted = ref(false);

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

  if (!termsAccepted.value) {
    errorMessage.value = 'Необходимо согласиться с условиями использования';
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
