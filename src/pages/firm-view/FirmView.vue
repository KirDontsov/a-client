<template>
  <PageContainer :loading="selectedFirmStore.firmLoading && !firm">
    <template #body>
      <div v-if="firm?.name">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex items-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            {{ $route.params.id }}
          </div>
          <div class="flex items-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            {{ firm?.firm_id }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-3">
          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Firm Name</label
            >
            <input
              type="text"
              id="firm_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:bg-gray-700"
              placeholder="Firm name"
              v-model="firm.name"
            />
          </div>
          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Address
            </label>
            <input
              type="text"
              id="firm_address"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm address"
              v-model="firm.address"
            />
          </div>

          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_floor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Floor</label
            >
            <input
              type="text"
              id="firm_floor"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm floor"
              v-model="firm.floor"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-3">
          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_default_phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Phone
            </label>
            <input
              type="text"
              id="firm_default_phone"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm default_phone"
              v-model="firm.default_phone"
            />
          </div>

          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_default_email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Email
            </label>
            <input
              type="text"
              id="firm_default_email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm default_email"
              v-model="firm.default_email"
            />
          </div>

          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_site" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Firm Site</label
            >
            <input
              type="text"
              id="firm_site"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm site"
              v-model="firm.site"
            />
          </div>

          <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_coords" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Coords
            </label>
            <input
              type="text"
              id="firm_coords"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm coords"
              v-model="firm.coords"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
          <label for="firm_description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Firm Description
          </label>
          <textarea
            v-model="firm.description"
            id="firm_description"
            rows="20"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_rating" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Rating
            </label>
            <input
              type="text"
              id="firm_rating"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm rating"
              v-model="firm.rating"
            />
          </div>

          <div class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
            <label for="firm_reviews_count" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Firm Reviews count
            </label>
            <input
              type="text"
              id="firm_reviews_count"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Firm reviews_count"
              v-model="firm.reviews_count"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700">
          <label for="firm_title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Firm Title
          </label>
          <input
            type="text"
            id="firm_title"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Firm title"
            v-model="firm.title"
          />
        </div>

        <button @click="handleSubmit">Сохранить</button>
      </div>
    </template>
  </PageContainer>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSelectedFirmStore } from '@/entities';
import { storeToRefs } from 'pinia';
import { updateFirm } from '@/shared/api';
import PageContainer from '@/features/page-container';

const route = useRoute();
const selectedFirmStore = useSelectedFirmStore();

const { firm } = storeToRefs(selectedFirmStore);

onMounted(() => {
  selectedFirmStore.getFirm(route.params.id);
});

const handleSubmit = async () => {
  try {
    const res = await updateFirm(route.params.id, firm.value);
    if (res?.ok) {
      console.log(res);
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<style></style>
