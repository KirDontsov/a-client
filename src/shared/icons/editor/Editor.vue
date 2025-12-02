<template>
  <svg
    :class="{
      'w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white': !isSelected,
      'w-5 h-5 text-white': isSelected
    }"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      :stroke="isSelected ? 'white' : 'currentColor'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
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