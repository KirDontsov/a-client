<template>
  <!-- This is a headless component that provides WebSocket functionality -->
  <div v-if="false"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { DOMAIN } from '@/shared';

interface Props {
  userId: string;
  enabled?: boolean;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  onMessage: () => {},
  onError: () => {},
  onOpen: () => {},
  onClose: () => {}
});

const wsConnection = ref<WebSocket | null>(null);
const isConnected = ref(false);
const reconnectAttempts = ref(0);
const maxReconnectAttempts = 5;
const reconnectInterval = 3000; // 3 seconds

// Function to establish WebSocket connection
const connect = () => {
  if (!props.enabled || !props.userId) return;

  // Determine if we should use secure websocket protocol
  // For production domains (not localhost or local IPs), use wss://
  const isLocalhost = DOMAIN.startsWith('localhost') || DOMAIN.startsWith('127.');
  const isLocalIP = DOMAIN.startsWith('192.') || DOMAIN.startsWith('10.') || DOMAIN.startsWith('172.');

  const wsProtocol = !isLocalhost && !isLocalIP ? 'wss://' : 'ws://';

  try {
    const wsUrl = `${wsProtocol}${DOMAIN}/api/ws?user_id=${props.userId}`;
    wsConnection.value = new WebSocket(wsUrl);

    wsConnection.value.onopen = () => {
      isConnected.value = true;
      reconnectAttempts.value = 0; // Reset reconnect attempts on successful connection
      props.onOpen?.();
    };

    wsConnection.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        props.onMessage?.(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        // Still pass the raw data if parsing fails
        props.onMessage?.(event.data);
      }
    };

    wsConnection.value.onerror = (error) => {
      console.error('WebSocket error:', error);
      props.onError?.(error);
    };

    wsConnection.value.onclose = (event) => {
      isConnected.value = false;
      props.onClose?.();

      // Attempt to reconnect if not intentional closure and within retry limits
      if (!event.wasClean && reconnectAttempts.value < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.value++;
          connect();
        }, reconnectInterval);
      }
    };
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    props.onError?.(error as Event);
  }
};

// Function to disconnect WebSocket
const disconnect = () => {
 if (wsConnection.value) {
    wsConnection.value.close();
    wsConnection.value = null;
    isConnected.value = false;
  }
};

// Function to send a message
const sendMessage = (message: any) => {
  if (wsConnection.value && isConnected.value) {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    wsConnection.value.send(messageStr);
  } else {
    console.warn('WebSocket is not connected. Cannot send message:', message);
  }
};

// Expose functions to parent components
defineExpose({
  connect,
  disconnect,
  sendMessage,
  isConnected,
});

// Watch for changes in userId or enabled prop to reconnect if needed
watch([() => props.userId, () => props.enabled], ([newUserId, newEnabled]) => {
  if (wsConnection.value) {
    disconnect(); // Disconnect first
  }
  
  if (newEnabled && newUserId) {
    connect(); // Reconnect with new parameters
  }
});

// Establish connection when component is mounted
onMounted(() => {
  if (props.enabled && props.userId) {
    connect();
  }
});

// Clean up when component is unmounted
onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
/* This component has no visual representation */
</style>