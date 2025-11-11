<!-- features/ProgressDisplay.vue -->
<template>
  <div
    v-if="showProgress || progressData"
    class="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">Прогресс обработки</h3>

    <div v-if="progressData" class="space-y-4">
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-blue-700 dark:text-white">Прогресс</span>
          <span class="text-sm font-medium text-blue-700 dark:text-white">{{ calculateProgressPercentage() }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            class="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out dark:bg-blue-50"
            :style="{ width: calculateProgressPercentage() + '%' }"
          ></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Обработано</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ progressData.current_ads }} / {{ progressData.total_ads }}
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Статус</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ progressData.status }}</div>
          </div>
        </div>

        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">ID задачи</div>
            <div class="text-sm text-gray-50 dark:text-gray-400 break-all">{{ progressData.task_id }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-gray-700 dark:text-gray-400">Ожидание данных о прогрессе...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { DOMAIN } from '@/shared';
import { useAuthStore } from '@/entities/auth/model';
import { useAvitoAnalyticsAdsStore } from '@/entities/avito-analytics-ads/model';

// WebSocket connection
let ws: WebSocket | null = null;
// Determine if we should use secure websocket protocol
// For production domains (not localhost or local IPs), use wss://
const isLocalhost = DOMAIN.startsWith('localhost') || DOMAIN.startsWith('127.');
const isLocalIP = DOMAIN.startsWith('192.') || DOMAIN.startsWith('10.') || DOMAIN.startsWith('172.');

const wsProtocol = !isLocalhost && !isLocalIP ? 'wss://' : 'ws://';

const authStore = useAuthStore();
const avitoAnalyticsAdsStore = useAvitoAnalyticsAdsStore();

// Counter to track messages and update table every 2 messages
let messageCounter = 0;

// Progress tracking
interface ProgressData {
  task_id: string;
  user_id: string;
  progress: number;
  total_ads: number;
  current_ads: number;
  status: string;
  message: string;
  timestamp: string;
}

const progressData = ref<ProgressData | null>(null);
const showProgress = ref(false);

// Props to receive requestId and control WebSocket connection
interface Props {
  requestId?: string;
  shouldShowProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shouldShowProgress: true,
});

// Emits to notify parent component about progress updates and task completion
interface Emits {
  (e: 'progressUpdate', data: ProgressData): void;
  (e: 'taskComplete', data: ProgressData): void;
  (e: 'dataUpdate', requestId: string): void;
}

const emit = defineEmits<Emits>();

onMounted(() => {
  if (props.requestId) {
    connectWebSocket(props.shouldShowProgress);
  }
});

const connectWebSocket = (shouldShowProgress = true) => {
  try {
    // Check if there's already an open WebSocket connection
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket connection already open');
      // If we should show progress and it's not already shown, show it
      if (shouldShowProgress && !showProgress.value) {
        showProgress.value = true;
      }
      return;
    }

    // Close any existing connection before creating a new one
    if (ws) {
      ws.close();
    }

    // Get current user_id and request_id when establishing connection
    const currentUserId = authStore.user?.id || '';
    const currentRequestId = props.requestId || avitoAnalyticsAdsStore.selectedRequestId || '';

    // Validate that we have both required parameters
    if (!currentUserId) {
      console.error('Cannot connect to WebSocket: user_id is missing');
      return;
    }

    if (!currentRequestId) {
      console.error('Cannot connect to WebSocket: request_id is missing');
      return;
    }

    const currentWsUrl = `${wsProtocol}${DOMAIN}/api/ws?user_id=${currentUserId}&request_id=${currentRequestId}`;

    console.log('Connecting to WebSocket:', currentWsUrl);

    ws = new WebSocket(currentWsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      if (shouldShowProgress) {
        showProgress.value = true;
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);

        progressData.value = message;
        emit('progressUpdate', message);

        // Increment message counter
        messageCounter++;

        // Update table data every 2 messages
        if (messageCounter % 2 === 0 && message.task_id) {
          emit('dataUpdate', message.task_id);
        }

        // If the task is complete, close the connection
        if (message.status === 'completed' || message.status === 'failed') {
          closeWebSocket();
          emit('taskComplete', message);
          // Fetch final data when task is complete
          if (message.task_id) {
            emit('dataUpdate', message.task_id);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.error('Raw message data:', event.data);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Try to get more specific error information if possible
      if (error instanceof Event) {
        console.error('WebSocket connection error event:', error.type);
      } else {
        console.error('WebSocket connection error:', error);
      }
      closeWebSocket();
    };
  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
  }
};

const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

const calculateProgressPercentage = () => {
  if (!progressData.value) return 0;

  // Use current_ads and total_ads to calculate percentage to ensure it stays within 0-100%
  if (progressData.value.total_ads > 0) {
    const calculatedPercentage = (progressData.value.current_ads / progressData.value.total_ads) * 100;
    return Math.round(calculatedPercentage);
  }

  // Fallback to the progress field if total_ads is 0 or invalid, but cap it at 10%
  const progressPercentage = progressData.value.progress * 100;
  return Math.min(Math.round(progressPercentage), 100);
};

onUnmounted(() => {
  // Close WebSocket connection when component is unmounted
  closeWebSocket();
});
</script>

<style scoped>
/* Custom styles for the component */
</style>
