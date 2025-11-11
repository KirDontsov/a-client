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
        <InputField id="price" v-model="localPrice" type="text" placeholder="Цена" label="Цена" required />
        <InputField id="promotion" v-model="localPromotion" type="text" label="Продвижение" required />
      </div>
      <Button type="button" @click="handleSubmit" color="default" variant="dark"> Сохранить </Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAvitoItemFormStore } from '@/entities';
import { InputField } from '@/shared/components/input-field';
import { computed } from 'vue';
import { Button } from '@/shared/components';

const avitoItemFormStore = useAvitoItemFormStore();

// Create local reactive variables for the input fields
const localPrice = computed({
  get: () => avitoItemFormStore.getSelectedItem?.price || '',
  set: (value) => {
    if (avitoItemFormStore.getSelectedItem) {
      avitoItemFormStore.getSelectedItem.price = value;
    }
  },
});

const localPromotion = computed({
  get: () => avitoItemFormStore.getSelectedItem?.promotion || '',
  set: (value) => {
    if (avitoItemFormStore.getSelectedItem) {
      avitoItemFormStore.getSelectedItem.promotion = value;
    }
  },
});

const handleClose = () => avitoItemFormStore.setSelected(null);

const handleSubmit = () => {
  avitoItemFormStore.setSelected(null);
};
</script>
