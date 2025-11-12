<template>
  <button
    ref="buttonRef"
    :type="type"
    :disabled="disabled"
    :class="[
      baseClasses,
      sizeClasses,
      colorClasses,
      variantClasses,
      iconClasses,
      buttonClass,
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @click="$emit('click', $event)"
  >
    <!-- Button text -->
    <span v-if="$slots.default" class="flex items-center">
      <slot />
    </span>
    <span v-else>{{ text }}</span>
  </button>

  <!-- Tooltip rendered outside the button's DOM structure to avoid layout issues -->
  <Teleport to="body">
    <div
      v-if="hintText && showTooltip"
      class="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap"
      :style="tooltipPositionStyleString"
    >
      {{ hintText }}
      <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'blue' | 'gray' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'teal';
  variant?: 'light' | 'dark';
  hintText?: string;
  buttonClass?: string | string[];
}

interface Emits {
  (e: 'click', event: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  size: 'md',
  color: 'default',
  variant: 'light',
  iconSize: 'md',
});

defineEmits<Emits>();

// Tooltip functionality
const showTooltip = ref(false);
const buttonRef = ref<HTMLElement | null>(null);

// Calculate tooltip position as a CSS string
const tooltipPositionStyleString = computed(() => {
  if (!buttonRef.value) {
    return 'top: 0px; left: 0px; transform: translateX(-50%); position: fixed; z-index: 999;';
  }

  const buttonRect = buttonRef.value.getBoundingClientRect();
  const top = buttonRect.top - 42; // 10px above the button
  const left = buttonRect.left + buttonRect.width / 2; // Center horizontally

  return `top: ${top}px; left: ${left}px; transform: translateX(-50%); position: fixed; z-index: 999;`;
});

// Base button classes
const baseClasses =
  'rounded-lg font-medium focus:ring-4 focus:outline-none transition-colors duration-200 flex items-center justify-center cursor-pointer flex-nowrap text-nowrap';

// Size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-3 py-1.5';
    case 'lg':
      return 'text-base px-5 py-2.5';
    default: // md
      return 'text-sm px-4 py-2';
  }
});

// Icon size classes
const iconSizeClass = computed(() => {
  switch (props.iconSize) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-6 h-6';
    default: // md
      return 'w-5 h-5';
  }
});

// Color classes based on variant
const colorClasses = computed(() => {
  // Default color classes for light theme
  if (props.variant === 'light') {
    switch (props.color) {
      case 'blue':
        return 'text-gray-900 bg-blue-50 hover:bg-blue-100 focus:ring-blue-200';
      case 'gray':
        return 'text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200';
      case 'red':
        return 'text-gray-900 bg-red-50 hover:bg-red-100 focus:ring-red-200';
      case 'green':
        return 'text-gray-900 bg-green-50 hover:bg-green-100 focus:ring-green-200';
      case 'yellow':
        return 'text-gray-900 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-200';
      case 'indigo':
        return 'text-gray-900 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-200';
      case 'purple':
        return 'text-gray-900 bg-purple-50 hover:bg-purple-100 focus:ring-purple-200';
      case 'pink':
        return 'text-gray-900 bg-pink-50 hover:bg-pink-100 focus:ring-pink-200';
      case 'teal':
        return 'text-gray-900 bg-teal-50 hover:bg-teal-100 focus:ring-teal-200';
      default: // default
        return 'text-gray-900 bg-zinc-700 hover:bg-zinc-800 focus:ring-blue-400';
    }
  }
  // Dark theme variant
  else if (props.variant === 'dark') {
    switch (props.color) {
      case 'blue':
        return 'text-gray-200 bg-blue-700 hover:bg-blue-800 focus:ring-blue-900';
      case 'gray':
        return 'text-gray-200 bg-gray-700 hover:bg-gray-800 focus:ring-gray-900';
      case 'red':
        return 'text-gray-200 bg-red-700 hover:bg-red-800 focus:ring-red-900';
      case 'green':
        return 'text-gray-200 bg-green-700 hover:bg-green-800 focus:ring-green-900';
      case 'yellow':
        return 'text-gray-200 bg-yellow-700 hover:bg-yellow-800 focus:ring-yellow-900';
      case 'indigo':
        return 'text-gray-200 bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-900';
      case 'purple':
        return 'text-gray-200 bg-purple-700 hover:bg-purple-800 focus:ring-purple-900';
      case 'pink':
        return 'text-gray-200 bg-pink-700 hover:bg-pink-800 focus:ring-pink-900';
      case 'teal':
        return 'text-gray-200 bg-teal-700 hover:bg-teal-800 focus:ring-teal-900';
      default: // default
        return 'text-gray-200 bg-zinc-700 hover:bg-zinc-800 focus:ring-blue-400';
    }
  }
  // Default fallback
  return 'text-gray-200 bg-zinc-700 hover:bg-zinc-800 focus:ring-blue-400';
});

// Variant classes (for additional styling)
const variantClasses = computed(() => {
  // Already handled in colorClasses, but can add additional variant-specific styles here if needed
  return '';
});

// Icon classes
const iconClasses = computed(() => {
  return props.prependIcon || props.appendIcon ? 'flex items-center' : '';
});
</script>

<style lang="scss"></style>
