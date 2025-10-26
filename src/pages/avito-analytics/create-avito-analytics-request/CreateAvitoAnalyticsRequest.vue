<!-- components/AvitoCompetitorsAnalytics.vue -->
<template>
  <PageContainer :loading="loading">
    <template #body>
      <div
        class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <h2 class="text-xl font-semibold text-gray-80 dark:text-white mb-6">Анализ конкурентов Avito</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- City field -->
          <div class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
            <div class="mb-3">
              <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Город <span class="text-red-500">*</span>
              </label>
            </div>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-50 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
              placeholder="Введите город"
            />
          </div>

          <!-- Request field -->
          <div class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
            <div class="mb-3">
              <label for="request" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Запрос <span class="text-red-500">*</span>
              </label>
            </div>
            <input
              id="request"
              v-model="formData.request"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
              placeholder="Введите запрос, например: ремонт фар"
            />
          </div>

          <!-- Coords field -->
          <div class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
            <div class="mb-3">
              <label for="coords" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Координаты
              </label>
            </div>
            <input
              id="coords"
              v-model="formData.coords"
              type="text"
              class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
              placeholder="Введите координаты в формате: широта,долгота"
            />
          </div>

          <!-- Radius field -->
          <div class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
            <div class="mb-3">
              <label for="radius" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Радиус </label>
            </div>
            <input
              id="radius"
              v-model="formData.radius"
              type="number"
              class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-50 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
              placeholder="Введите радиус в метрах"
            />
          </div>

          <!-- District field -->
          <div class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
            <div class="mb-3">
              <label for="district" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Район </label>
            </div>
            <input
              id="district"
              v-model="formData.district"
              type="text"
              class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-50 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
              placeholder="Введите район"
            />
          </div>

          <!-- Form actions -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="handleReset"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:bg-gray-700 transition-colors duration-200"
            >
              Сбросить
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ loading ? 'Загрузка...' : 'Отправить запрос' }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/features/page-container';
import { createAvitoAnalyticsRequest } from '@/shared/api/avito';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormData {
  request: string;
  city: string;
  coords: string;
  radius: string;
  district: string;
}

const initialFormData: FormData = {
  request: '',
  city: '',
  coords: '',
  radius: '',
  district: '',
};

const formData = ref<FormData>({ ...initialFormData });
const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    // Send the POST request to the backend
    const response = await createAvitoAnalyticsRequest(formData.value);

    if (response && response.status === 'success') {
      await router.push(`/avito-analytics/${response?.data?.avito_request?.request_id}`);
    } else {
      alert('Произошла ошибка при отправке запроса');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.');
    loading.value = false;
  }
};

const handleReset = () => {
  formData.value = { ...initialFormData };
};
</script>

<style scoped>
/* Custom styles for form elements */
</style>
