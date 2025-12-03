<template>
  <svg
    :class="[
      $attrs.class,
      {
        'text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white':
          !isSelected,
        'text-gray-900 dark:text-white': isSelected,
      },
    ]"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      :stroke="isSelected ? 'currentColor' : 'currentColor'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  isSelected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});

// Use defineOptions to inherit attrs
defineOptions({
  inheritAttrs: false,
});
</script>

<style></style>
