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
          <InputField
            id="firm_name"
            v-model="firm.name"
            type="text"
            placeholder="Firm name"
            label="Firm Name"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_address"
            v-model="firm.address"
            type="text"
            placeholder="Firm address"
            label="Firm Address"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_floor"
            v-model="firm.floor"
            type="text"
            placeholder="Firm floor"
            label="Firm Floor"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-3">
          <InputField
            id="firm_default_phone"
            v-model="firm.default_phone"
            type="text"
            placeholder="Firm default_phone"
            label="Firm Phone"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_default_email"
            v-model="firm.default_email"
            type="text"
            placeholder="Firm default_email"
            label="Firm Email"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_site"
            v-model="firm.site"
            type="text"
            placeholder="Firm site"
            label="Firm Site"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_coords"
            v-model="firm.coords"
            type="text"
            placeholder="Firm coords"
            label="Firm Coords"
            class="px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />
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
          <InputField
            id="firm_rating"
            v-model="firm.rating"
            type="text"
            placeholder="Firm rating"
            label="Firm Rating"
            class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />

          <InputField
            id="firm_reviews_count"
            v-model="firm.reviews_count"
            type="text"
            placeholder="Firm reviews_count"
            label="Firm Reviews count"
            class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <InputField
          id="firm_title"
          v-model="firm.title"
          type="text"
          placeholder="Firm title"
          label="Firm Title"
          class="flex flex-col gap-2 justify-center px-8 py-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-700"
        />

        <Button @click="handleSubmit" color="default" variant="dark">Сохранить</Button>
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
import { PageContainer } from '@/features/page-container';
import { InputField } from '@/shared/components/input-field';
import { Button } from '@/shared/components';

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
