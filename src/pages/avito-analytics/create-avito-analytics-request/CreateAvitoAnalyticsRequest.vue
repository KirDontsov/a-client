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
          <InputField
            id="city"
            v-model="formData.city"
            type="text"
            :required="true"
            placeholder="Введите город"
            label="Город *"
            class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
          />

          <!-- Request field -->
          <InputField
            id="request"
            v-model="formData.request"
            type="text"
            :required="true"
            placeholder="Введите запрос, например: ремонт фар"
            label="Запрос *"
            class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
          />

          <!-- Coords field -->
          <InputField
            id="coords"
            v-model="formData.coords"
            type="text"
            placeholder="Введите координаты в формате: широта,долгота"
            label="Координаты"
            class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
          />

          <!-- Radius field -->
          <InputField
            id="radius"
            v-model="formData.radius"
            type="number"
            placeholder="Введите радиус в метрах"
            label="Радиус"
            class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
          />

          <!-- District field -->
          <InputField
            id="district"
            v-model="formData.district"
            type="text"
            placeholder="Введите район"
            label="Район"
            class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
          />

          <!-- Form actions -->
          <div class="flex justify-end space-x-4 pt-4">
            <Button type="button" @click="handleReset" color="default" variant="dark"> Сбросить </Button>
            <Button type="submit" :disabled="loading" color="default" variant="dark">
              {{ loading ? 'Загрузка...' : 'Отправить запрос' }}
            </Button>
          </div>
        </form>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PageContainer } from '@/features/page-container';
import { createAvitoAnalyticsRequest } from '@/shared/api/avito';
import { useRouter } from 'vue-router';
import { InputField } from '@/shared/components/input-field';
import { Button } from '@/shared/components';

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
