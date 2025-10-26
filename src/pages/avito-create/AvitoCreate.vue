<!-- components/AvitoItemForm.vue -->
<template>
  <PageContainer :loading="avitoCategoryFieldsStore.categoryFieldsLoading">
    <template #body>
      <div
        class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <!-- Item Form Section -->
        <div v-if="avitoCategoryFieldsStore.categoryFields && avitoCategoryFieldsStore.categoryFields.length > 0">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Создание объявления</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Render each field -->
            <div
              v-for="field in avitoCategoryFieldsStore.categoryFields"
              :key="field.tag"
              class="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
            >
              <div class="mb-3">
                <div class="flex items-center gap-2 mb-1">
                  <label :for="field.tag" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ field.label }}
                    <span v-if="field.content[0]?.required" class="text-red-500">*</span>
                  </label>

                  <!-- Tooltip for field description -->
                  <div v-if="field.descriptions" class="relative flex flex-col items-center group">
                    <svg
                      class="w-4 h-4 text-gray-400 hover:text-gray-500 cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="absolute bottom-0 left-0 flex flex-col items-center hidden mb-6 group-hover:flex">
                      <span
                        class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md min-w-[300px] w-fit max-w-[752px] text-center"
                      >
                        {{ field.descriptions }}
                      </span>
                      <div class="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
                    </div>
                  </div>
                </div>

                <!-- Warnings -->
                <div
                  v-if="field.content[0]?.warnings && field.content[0].warnings.length > 0"
                  class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-3"
                >
                  <div
                    v-for="(warning, idx) in field.content[0].warnings"
                    :key="idx"
                    class="text-yellow-700 dark:text-yellow-300 text-sm"
                  >
                    <strong class="block">{{ warning.title }}</strong>
                    {{ warning.content }}
                  </div>
                </div>

                <!-- Dependencies info -->
                <div
                  v-if="field.content[0]?.dependencies_text && field.content[0].dependencies_text.length > 0"
                  class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-3 text-sm"
                >
                  <p class="text-blue-700 dark:text-blue-300 font-medium mb-1">Условия применения:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li
                      v-for="(text, idx) in field.content[0].dependencies_text"
                      :key="idx"
                      class="text-blue-600 dark:text-blue-300"
                    >
                      {{ text }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Field input based on type -->
              <div v-if="field.content && field.content.length > 0">
                <!-- Input field -->
                <input
                  v-if="field.content[0].field_type === 'input'"
                  :id="field.tag"
                  v-model="avitoCategoryFieldsStore.formData[field.tag]"
                  :type="getInputType(field.content[0].data_type)"
                  :required="field.content[0].required"
                  :min="field.content[0].values_range?.min"
                  :max="field.content[0].values_range?.max"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                />

                <!-- Select field -->
                <select
                  v-else-if="field.content[0].field_type === 'select'"
                  :id="field.tag"
                  v-model="avitoCategoryFieldsStore.formData[field.tag]"
                  :required="field.content[0].required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                >
                  <option v-for="option in field.content[0].values" :key="option.value" :value="option.value">
                    {{ option.value }} <span v-if="option.description">- {{ option.description }}</span>
                  </option>
                </select>

                <!-- Checkbox field -->
                <div v-else-if="field.content[0].field_type === 'checkbox'" class="space-y-2">
                  <div v-for="option in field.content[0].values" :key="option.value" class="flex items-center">
                    <input
                      :id="`${field.tag}-${option.value}`"
                      type="checkbox"
                      :value="option.value"
                      v-model="avitoCategoryFieldsStore.formData[field.tag]"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:focus:bg-gray-700 dark:focus:ring-gray-600"
                    />
                    <label
                      :for="`${field.tag}-${option.value}`"
                      class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ option.value }}
                    </label>
                  </div>
                </div>

                <!-- Children fields (for complex fields like CompatibleCars) -->
                <div
                  v-if="field.children && field.children.length > 0"
                  class="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600"
                >
                  <div v-for="child in field.children" :key="child.tag" class="mb-4">
                    <div class="flex items-center gap-2 mb-1">
                      <label :for="child.tag" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ child.label }}
                      </label>

                      <!-- Tooltip for child description -->
                      <div v-if="child.descriptions" class="relative flex flex-col items-center group">
                        <svg
                          class="w-4 h-4 text-gray-400 hover:text-gray-500 cursor-pointer"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <div class="absolute bottom-0 left-0 flex flex-col items-center hidden mb-6 group-hover:flex">
                          <span
                            class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md w-fit max-w-[752px] text-center"
                          >
                            {{ child.descriptions }}
                          </span>
                          <div class="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Child input field -->
                    <input
                      v-if="child.content[0].field_type === 'input'"
                      :id="child.tag"
                      v-model="avitoCategoryFieldsStore.formData[child.tag]"
                      :type="getInputType(child.content[0].data_type)"
                      :required="child.content[0].required"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                    />

                    <!-- Child select field -->
                    <select
                      v-else-if="child.content[0].field_type === 'select'"
                      :id="child.tag"
                      v-model="avitoCategoryFieldsStore.formData[child.tag]"
                      :required="child.content[0].required"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                    >
                      <option value="">Выберите значение</option>
                      <option v-for="option in child.content[0].values" :key="option.value" :value="option.value">
                        {{ option.value }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form actions -->
            <div class="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                @click="handleReset"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:bg-gray-700 transition-colors duration-200"
              >
                Сбросить
              </button>
              <button
                type="submit"
                :disabled="avitoCategoryFieldsStore.categoryFieldsLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {{ avitoCategoryFieldsStore.categoryFieldsLoading ? 'Загрузка...' : 'Создать объявление' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Empty state when no category selected -->
        <div v-else-if="!avitoCategoriesStore.selectedCategories.length" class="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Выберите категорию</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Пожалуйста, выберите категорию для создания объявления.
          </p>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { useCookies, useAvitoCategoriesStore, useAvitoCategoryFieldsStore } from '@/entities';
import { onMounted } from 'vue';
import { getAvitoToken } from '@/shared/api/avito';
import PageContainer from '@/features/page-container';

const { value: avito_token } = useCookies('avito_token');
const { value: user_id } = useCookies('user_id');

const avitoCategoriesStore = useAvitoCategoriesStore();
const avitoCategoryFieldsStore = useAvitoCategoryFieldsStore();

const handleSelectCategory = (levelIndex: number, category: any) => {
  avitoCategoriesStore.selectCategory(levelIndex, category);
};

const getInputType = (dataType: string) => {
  switch (dataType) {
    case 'integer':
    case 'float':
      return 'number';
    default:
      return 'text';
  }
};

const handleSubmit = async () => {
  try {
    await avitoCategoryFieldsStore.submitForm();
    // Show success message
    alert('Объявление успешно создано!');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Произошла ошибка при создании объявления. Пожалуйста, проверьте заполнение полей.');
  }
};

const handleReset = () => {
  avitoCategoryFieldsStore.initializeFormData();
};

onMounted(async () => {
  if (!avito_token.value) {
    await getAvitoToken();
  } else if (avito_token.value) {
    console.log('avito_token.value', avito_token.value);
    await avitoCategoryFieldsStore.getAvitoCategoryFields({
      avito_token: avito_token.value,
      avito_slug: avitoCategoriesStore.selectedFinalCategory,
    });
  }
});
</script>

<style scoped>
/* Custom styles for form elements */
</style>
