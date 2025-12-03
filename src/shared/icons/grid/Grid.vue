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
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      :fill="isSelected ? 'currentColor' : 'currentColor'"
      fill-rule="evenodd"
      d="M4.857 3C3.831 3 3 3.831 3 4.857V9.143C3 10.169 3.831 11 4.857 11H9.143C10.169 11 11 10.169 11 9.143V4.857C11 3.831 10.169 3 9.143 3H4.857ZM14.857 3C13.831 3 13 3.831 13 4.857V9.143C13 10.169 13.831 11 14.857 11H19.143C20.169 11 21 10.169 21 9.143V4.857C21 3.831 20.169 3 19.143 3H14.857ZM4.857 13C3.831 13 3 13.831 3 14.857V19.143C3 20.169 3.831 21 4.857 21H9.143C10.169 21 11 20.169 11 19.143V14.857C11 13.831 10.169 13 9.143 13H4.857ZM14.857 13C13.831 13 13 13.831 13 14.857V19.143C13 20.169 13.831 21 14.857 21H19.143C20.169 21 21 20.169 21 19.143V14.857C21 13.831 20.169 13 19.143 13H14.857Z"
      clip-rule="evenodd"
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
