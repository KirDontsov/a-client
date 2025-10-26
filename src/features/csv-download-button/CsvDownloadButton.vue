<template>
  <button @click.stop="downloadCsv" :class="buttonClass" :disabled="loading">
    <span v-if="!loading">Скачать CSV</span>
    <span v-else class="flex items-center">
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BACKEND_PORT } from '@/shared/constants';
import { useAvitoAnalyticsAdsStore } from '@/entities/avito-analytics-ads';

interface Props {
  requestId: string;
  buttonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonClass:
    'px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500',
});

const loading = ref(false);
const avitoAnalyticsAdsStore = useAvitoAnalyticsAdsStore();

const downloadCsv = async () => {
  if (!props.requestId) {
    console.error('No request ID found');
    return;
  }

  try {
    loading.value = true;

    // Call the API to get CSV data
    const response = await fetch(`${BACKEND_PORT}/api/avito_requests/${props.requestId}/ads/csv`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the CSV content from the response
    const csvContent = await response.text();

    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Set the filename from the Content-Disposition header or use a default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `ads_${props.requestId}.csv`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    avitoAnalyticsAdsStore.setError('Ошибка при загрузке CSV файла');
  } finally {
    loading.value = false;
  }
};
</script>
