<template>
  <aside
    id="cta-button-sidebar"
    :class="{
      'translate-x-0': avitoItemFormStore.selected,
      'translate-x-full': !avitoItemFormStore.selected,
    }"
    class="fixed top-[78px] right-0 z-40 h-[calc(100svh-78px)] w-[768px] transition-transform duration-300 ease-in-out"
    aria-label="Sidebar"
  >
    <div class="h-full px-4 pt-10 pb-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 relative flex flex-col gap-4">
      <!-- Rest of your content remains exactly the same -->
      <div role="button" class="absolute top-1 right-1 cursor-pointer" @click="handleClose">
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </div>
      <div class="flex flex-col gap-4">
        <p class="text-base text-gray-900 dark:text-white">ID: {{ avitoItemFormStore.getSelectedItem?.id }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3">
          <p class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ avitoItemFormStore.getSelectedItem?.title }}
          </p>
          <p class="text-base text-gray-900 dark:text-white text-right">
            {{ avitoItemFormStore.getSelectedItem?.price }} &#8381;
          </p>
        </div>
        <p class="text-base text-gray-900 dark:text-white">Адрес: {{ avitoItemFormStore.getSelectedItem?.address }}</p>
        <a
          :href="avitoItemFormStore.getSelectedItem?.url"
          class="text-base text-gray-900 dark:text-white"
          target="_blank"
          >{{ avitoItemFormStore.getSelectedItem?.url }}</a
        >

        <p class="text-base text-gray-900 dark:text-white">
          Категория: {{ avitoItemFormStore.getSelectedItem?.category?.name }}
        </p>
        <p class="text-base text-gray-900 dark:text-white">Статус: {{ avitoItemFormStore.getSelectedItem?.status }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3">
        <div class="flex flex-col gap-2 mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Цена</label>
          <input
            type="text"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Цена"
            required
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Продвижение</label>
          <input
            type="text"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="button"
        @click="handleSubmit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Сохранить
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAvitoItemFormStore } from '@/entities';

const avitoItemFormStore = useAvitoItemFormStore();

const handleClose = () => avitoItemFormStore.setSelected(null);

const handleSubmit = () => {
  avitoItemFormStore.setSelected(null);
};
</script>
