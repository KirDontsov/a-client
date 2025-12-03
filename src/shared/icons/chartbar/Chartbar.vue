<template>
  <svg
    :class="{
      'text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white': !isSelected,
      'text-gray-900 dark:text-white': isSelected
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
      d="M9 19v-6a2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 02 2h2a2 2 0 002-2m0 0V5a2 2 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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