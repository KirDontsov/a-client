<template>
  <td class="relative px-3 py-2 font-medium text-gray-900 dark:text-white truncate relative !max-w-xs" ref="triggerRef">
    <div class="flex items-center justify-between">
      <span
        :class="['truncate cursor-pointer inline-block', { 'max-w-xs': customClass.includes('max-w') }]"
        :title="textValue"
        @click="togglePopup"
      >
        {{ displayText }}
      </span>
      <button
        v-if="showCopyButton"
        @click="copyToClipboard"
        class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
        :title="isCopied ? 'Скопировано в буфер обмена' : 'Скопировать в буфер обмена'"
      >
        <svg
          v-if="!isCopied"
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
            clip-rule="evenodd"
          />
          <path
            fill-rule="evenodd"
            d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-green-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
            clip-rule="evenodd"
          />
          <path
            fill-rule="evenodd"
            d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <Teleport to="body" v-if="showPopup && shouldShowPopup">
      <div
        ref="popupRef"
        class="fixed z-[9999] p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
        :class="popupClass"
        :style="computedPopupStyle"
      >
        <div class="max-h-60 overflow-y-auto pr-2">
          <div class="flex justify-between items-start">
            <strong v-if="title" class="block mb-1 text-gray-900 dark:text-white">{{ title }}:</strong>
          </div>
          <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ textValue }}</p>
        </div>
      </div>
    </Teleport>
  </td>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  textValue: string;
  maxLength?: number;
  title?: string;
  popupClass?: string;
  popupStyle?: Record<string, string | number>;
  customClass?: string;
  showCopyButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 50,
  title: '',
  popupClass: 'w-96', // Increased width from w-80 to w-96
  popupStyle: () => ({}),
  customClass: '',
  showCopyButton: true,
});

const showPopup = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);
const isCopied = ref(false);
let isOpen = false;

const displayText = computed(() => {
  if (!props.textValue) return 'N/A';
  return props.textValue.length > props.maxLength
    ? props.textValue.substring(0, props.maxLength) + '...'
    : props.textValue;
});

const shouldShowPopup = computed(() => {
  return props.textValue && props.textValue.length > props.maxLength;
});

// Calculate position based on trigger element
const computedPopupStyle = computed(() => {
  if (!triggerRef.value || !showPopup.value) {
    return { ...props.popupStyle, display: 'none' };
  }

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Calculate position - above the trigger element with more offset
  let top = triggerRect.top + scrollTop - 20; // Increased offset to 20px above the trigger
  let left = triggerRect.left + scrollLeft;

  // Ensure the popup stays within the viewport
  const popupHeight = 250; // Increased estimated height of the popup
  const popupWidth = 384; // Updated estimated width of the popup (w-96 = 24rem = ~384px)

  // Adjust top position if popup would go above the viewport
  if (top < 20) {
    top = triggerRect.bottom + scrollTop + 20; // Position below the trigger instead with more offset
  }

  // Adjust left position if popup would go outside the viewport
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  if (left + popupWidth > windowWidth) {
    left = Math.max(20, windowWidth - popupWidth - 20); // Position at right edge of viewport, with margin
  }

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    ...props.popupStyle,
  };
});

// Custom event for closing other popups
const closeOtherPopupsEvent = new CustomEvent('close-other-popups');

// Close all other popups
const closeOtherPopups = () => {
  // Dispatch event to close other popups
  window.dispatchEvent(closeOtherPopupsEvent);
};

// Copy text to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.textValue);
    isCopied.value = true;
    // Reset the icon after 2 seconds
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
    // Optional: Show a visual feedback that the text was copied
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

// Close this popup
const closeThisPopup = () => {
  if (isOpen) {
    showPopup.value = false;
    isOpen = false;
  }
};

// Toggle popup visibility
const togglePopup = (event: Event) => {
  event.stopPropagation();
  if (shouldShowPopup.value) {
    // If this popup is already open, close it
    if (isOpen) {
      closeThisPopup();
    } else {
      // Close any other open popups first
      closeOtherPopups();

      // Open this popup
      showPopup.value = true;
      isOpen = true;
    }
  }
};

// Close popup when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    isOpen &&
    showPopup.value &&
    triggerRef.value &&
    popupRef.value &&
    !triggerRef.value.contains(event.target as Node) &&
    !popupRef.value.contains(event.target as Node)
  ) {
    closeThisPopup();
  }
};

// Listen for close-other-popups events
const handleCloseOtherPopups = () => {
  if (isOpen) {
    closeThisPopup();
  }
};

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('close-other-popups', handleCloseOtherPopups);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('close-other-popups', handleCloseOtherPopups);

  // Clean up if this popup was open
  if (isOpen) {
    closeThisPopup();
  }
});
</script>

<style scoped>
.truncate {
  max-width: inherit;
}
</style>
