<template>
  <svg
    :class="{
      'text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white':
        !isSelected,
      'text-gray-900 dark:text-white': isSelected,
    }"
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
      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  isSelected: boolean;
}

defineProps<Props>();
</script>

<style></style>
