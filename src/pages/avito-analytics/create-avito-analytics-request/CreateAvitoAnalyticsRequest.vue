<!-- components/AvitoCompetitorsAnalytics.vue -->
<template>
  <PageContainer :loading="loading">
    <template #body>
      <div class="w-full flex flex-col gap-8 px-4 py-2 sm:px-8 sm:py-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Анализ конкурентов Avito</h2>

        <form
          class="space-y-6 relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <!-- City field -->
          <InputField
            id="city"
            v-model="formData.city"
            type="text"
            :required="true"
            placeholder="Введите город"
            label="Город *"
          />

          <!-- Request field -->
          <InputField
            id="request"
            v-model="formData.request"
            type="text"
            :required="true"
            placeholder="Введите запрос, например: ремонт фар"
            label="Запрос *"
          />

          <!-- Coords field -->
          <InputField
            id="coords"
            v-model="formData.coords"
            type="text"
            placeholder="Введите координаты в формате: широта,долгота"
            label="Координаты"
          />

          <!-- Radius field -->
          <InputField
            id="radius"
            v-model="formData.radius"
            type="number"
            placeholder="Введите радиус в метрах"
            label="Радиус"
          />

          <!-- District field -->
          <InputField id="district" v-model="formData.district" type="text" placeholder="Введите район" label="Район" />
        </form>

        <!-- Form actions -->
        <div class="flex justify-end space-x-4 pt-4">
          <Button type="button" @click="handleReset" color="default" variant="dark"> Сбросить </Button>
          <Button type="button" @click="handleSubmit" :disabled="loading" color="default" variant="dark">
            {{ loading ? 'Загрузка...' : 'Отправить запрос' }}
          </Button>
        </div>
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
import { useToast } from '@/shared/composables/useToast';

const router = useRouter();
const { error: toastError } = useToast();

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
      await router.push(`/analytics/${response?.data?.avito_request?.request_id}`);
    } else {
      toastError('Произошла ошибка при отправке запроса');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toastError('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.');
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
