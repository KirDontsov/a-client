<template>
  <PageContainer :loading="avitoCategoryFieldsStore.categoryFieldsLoading">
    <template #body>
      <div class="w-full flex flex-col gap-8 text-gray-50 dark:text-gray-40 px-4 py-2 sm:px-8 sm:py-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Создание объявления</h2>
        <SelectedCategoryPath />
        <!-- Stepper Navigation -->
        <div class="mb-8">
          <div class="w-full">
            <div class="flex items-center justify-between w-full">
              <div
                v-for="(step, index) in totalSteps"
                :key="index"
                class="flex items-center transition-all duration-300 ease-in-out flex-1 min-w-0 basis-0"
              >
                <button
                  @click="goToStep(index)"
                  :class="[
                    'flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300 ease-in-out',
                    index === currentStep - 1 || index === currentStep || index === currentStep + 1
                      ? 'w-10 h-10 bg-opacity-100' // Active steps (prev, current, next)
                      : 'w-8 h-8 bg-opacity-70', // Collapsed steps
                    index < currentStep
                      ? 'bg-blue-600 text-white'
                      : currentStep === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 !text-gray-800 dark:bg-gray-600 dark:text-gray-300',
                    'cursor-pointer hover:bg-opacity-80',
                  ]"
                >
                  {{ index + 1 }}
                </button>
                <div
                  v-if="index < totalSteps - 1"
                  class="flex-1 mx-1 rounded-full transition-all duration-300 ease-in-out"
                  :class="
                    index === currentStep - 1 || index === currentStep
                      ? index < currentStep
                        ? 'bg-blue-600 h-0.5'
                        : 'bg-gray-50 dark:bg-gray-600 h-1' // Active dividers (prev-current and current-next)
                      : 'bg-gray-50 dark:bg-gray-500 h-0.25' // Collapsed dividers
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Item Form Section -->
        <div
          ref="itemFormSectionRef"
          v-if="avitoCategoryFieldsStore.categoryFields && avitoCategoryFieldsStore.categoryFields.length > 0"
          class="w-full flex flex-col gap-8 h-[calc(100vh-500px)]"
        >
          <div
            ref="formFieldsSectionRef"
            class="relative overflow-x-auto shadow-md sm:rounded-lg w-full p-4 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
          >
            <!-- Form Steps -->
            <form class="space-y-6 max-w-[688px] w-full mx-auto">
              <!-- Render fields for current step -->
              <div v-for="field in getFieldsForCurrentStep()" :key="field.tag" class="p-4">
                <div class="mb-3">
                  <!-- Dependencies info -->
                  <div
                    v-if="field.content[0]?.dependencies_text && field.content[0].dependencies_text.length > 0"
                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-3 text-sm"
                  >
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
                </div>

                <!-- Field input based on type -->
                <div v-if="field.content && field.content.length > 0">
                  <!-- Input field -->
                  <div v-if="field.content[0].field_type === 'input'">
                    <!-- Date field -->
                    <DatePicker
                      v-if="isDateField(field)"
                      :id="field.tag"
                      v-model="avitoCategoryFieldsStore.formData[field.tag]"
                      :required="field.content[0].required"
                      placeholder="Выберите дату"
                    />
                    <!-- Regular input field -->
                    <InputField
                      v-else
                      :id="field.tag"
                      v-model="trimmedFieldValues[field.tag]"
                      :type="getInputType(field.content[0].data_type)"
                      :required="field.content[0].required"
                      :min="field.content[0].values_range?.min"
                      :max="field.content[0].values_range?.max"
                      :isTextarea="field.tag === 'Description'"
                      :helperText="field.tag === 'ImageUrls' ? 'Ссылки на фотографии через запятую' : undefined"
                      class="w-full"
                    />
                  </div>

                  <!-- Select field -->
                  <select
                    v-else-if="field.content[0].field_type === 'select' || field.tag === 'Make'"
                    :id="field.tag"
                    v-model="avitoCategoryFieldsStore.formData[field.tag]"
                    :required="field.content[0].required"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                  >
                    <option value="" disabled>Выберите значение</option>
                    <!-- Special handling for Make field with new structure -->
                    <option
                      v-if="field.tag === 'Make' && isMakeFieldWithNewStructure(field)"
                      v-for="option in field.content[0].values.values"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.value }} <span v-if="option.description">- {{ option.description }}</span>
                    </option>
                    <!-- Regular Make field with old structure -->
                    <option
                      v-else-if="field.tag === 'Make'"
                      v-for="option in getSelectOptions(field.content[0].values)"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.value }} <span v-if="option.description">- {{ option.description }}</span>
                    </option>
                    <!-- Regular select field -->
                    <option
                      v-else
                      v-for="option in getSelectOptions(field.content[0].values)"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.value }} <span v-if="option.description">- {{ option.description }}</span>
                    </option>
                  </select>

                  <!-- Checkbox field -->
                  <div v-else-if="field.content[0].field_type === 'checkbox' && field.tag !== 'Make'" class="space-y-2">
                    <!-- Special handling for fields containing "Days" in the tag (e.g., WorkDays, SmthDays) -->
                    <div v-if="field.tag.includes('Days')" class="flex flex-wrap gap-4">
                      <div v-for="option in field.content[0].values" :key="option.value" class="flex items-center">
                        <input
                          :id="`${field.tag}-${option.value}`"
                          type="checkbox"
                          :value="option.value"
                          v-model="avitoCategoryFieldsStore.formData[field.tag]"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-30 rounded dark:focus:bg-gray-700 dark:focus:ring-gray-600"
                        />
                        <label
                          :for="`${field.tag}-${option.value}`"
                          class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {{ option.value }}
                        </label>
                      </div>
                    </div>
                    <!-- Regular checkbox field -->
                    <div v-else class="space-y-2">
                      <div v-for="option in field.content[0].values" :key="option.value" class="flex items-center">
                        <input
                          :id="`${field.tag}-${option.value}`"
                          type="checkbox"
                          :value="option.value"
                          v-model="avitoCategoryFieldsStore.formData[field.tag]"
                          class="h-4 w-4 text-blue-60 focus:ring-blue-500 border-gray-30 rounded dark:focus:bg-gray-700 dark:focus:ring-gray-600"
                        />
                        <label
                          :for="`${field.tag}-${option.value}`"
                          class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {{ option.value }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Children fields (for complex fields like CompatibleCars) -->
                  <div
                    v-if="field.children && field.children.length > 0"
                    class="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600"
                  >
                    <div v-for="child in field.children.filter((c) => c.tag !== 'Id')" :key="child.tag" class="mb-4">
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
                      <InputField
                        v-if="child.content[0].field_type === 'input'"
                        :id="child.tag"
                        v-model="avitoCategoryFieldsStore.formData[child.tag]"
                        :type="getInputType(child.content[0].data_type)"
                        :required="child.content[0].required"
                        :isTextarea="child.tag === 'Description'"
                        class="w-full"
                      />

                      <!-- Child checkbox field -->
                      <div
                        v-else-if="child.content[0].field_type === 'checkbox' && child.tag !== 'Make'"
                        class="space-y-2"
                      >
                        <!-- Special handling for child fields containing "Days" in the tag (e.g., WorkDays, SmthDays) -->
                        <div v-if="child.tag.includes('Days')" class="flex flex-wrap gap-4">
                          <div v-for="option in child.content[0].values" :key="option.value" class="flex items-center">
                            <input
                              :id="`${child.tag}-${option.value}`"
                              type="checkbox"
                              :value="option.value"
                              v-model="avitoCategoryFieldsStore.formData[child.tag]"
                              class="h-4 w-4 text-blue-60 focus:ring-blue-500 border-gray-30 rounded dark:focus:bg-gray-700 dark:focus:ring-gray-600"
                            />
                            <label
                              :for="`${child.tag}-${option.value}`"
                              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              {{ option.value }}
                            </label>
                          </div>
                        </div>
                        <!-- Regular child checkbox field -->
                        <div v-else class="space-y-2">
                          <div v-for="option in child.content[0].values" :key="option.value" class="flex items-center">
                            <input
                              :id="`${child.tag}-${option.value}`"
                              type="checkbox"
                              :value="option.value"
                              v-model="avitoCategoryFieldsStore.formData[child.tag]"
                              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-30 rounded dark:focus:bg-gray-700 dark:focus:ring-gray-600"
                            />
                            <label
                              :for="`${child.tag}-${option.value}`"
                              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              {{ option.value }}
                            </label>
                          </div>
                        </div>
                      </div>

                      <!-- Child select field -->
                      <select
                        v-else-if="child.content[0].field_type === 'select' || child.tag === 'Make'"
                        :id="child.tag"
                        v-model="avitoCategoryFieldsStore.formData[child.tag]"
                        :required="child.content[0].required"
                        class="w-full px-3 py-2 border border-gray-30 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200"
                      >
                        <option value="" disabled>Выберите значение</option>
                        <!-- Special handling for Make field with new structure -->
                        <option
                          v-if="child.tag === 'Make' && isMakeFieldWithNewStructure(child)"
                          v-for="option in child.content[0].values.values"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.value }}
                        </option>
                        <!-- Regular Make field with old structure -->
                        <option
                          v-else-if="child.tag === 'Make'"
                          v-for="option in getSelectOptions(child.content[0].values)"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.value }}
                        </option>
                        <!-- Regular select field -->
                        <option
                          v-else
                          v-for="option in getSelectOptions(child.content[0].values)"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.value }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <!-- Step Navigation -->
          <div class="flex justify-between pt-4">
            <Button type="button" @click="prevStep" :disabled="currentStep === 0" color="default" variant="dark">
              Назад
            </Button>
            <div class="flex space-x-2">
              <Button
                v-if="currentStep < totalSteps - 1"
                type="button"
                @click="nextStep"
                color="default"
                variant="dark"
              >
                Далее
              </Button>
              <Button
                v-else
                type="button"
                :disabled="avitoCategoryFieldsStore.categoryFieldsLoading"
                color="default"
                variant="dark"
                @click="handleSubmit"
              >
                {{ avitoCategoryFieldsStore.categoryFieldsLoading ? 'Загрузка...' : 'Создать объявление' }}
              </Button>
            </div>
          </div>
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
import { onMounted, ref, computed, nextTick, watch } from 'vue';
import { PageContainer } from '@/features/page-container';
import { SelectedCategoryPath } from '@/features';
import { DatePicker } from '@/shared/components/date-picker';
import { InputField } from '@/shared/components/input-field';
import { Button } from '@/shared/components';

const { value: avito_token } = useCookies('avito_token');

const avitoCategoriesStore = useAvitoCategoriesStore();
const avitoCategoryFieldsStore = useAvitoCategoryFieldsStore();
const currentStep = ref(0);
const itemFormSectionRef = ref(null);
const formFieldsSectionRef = ref(null);

// Reactive object to store trimmed values for fields that need trimming
const trimmedFieldValues = ref({});

// Calculate total steps based on fields (2 fields per step, but paired fields stay together)
const calculateTotalSteps = () => {
  const orderedFields = getOrderedFields();
  let stepCount = 0;
  let i = 0;

  while (i < orderedFields.length) {
    // Each step can have up to 2 fields, but paired fields should stay together
    let fieldsInStep = 1;

    // Check if the current field is part of a pair and if the next field is its pair
    if (i + 1 < orderedFields.length) {
      const currentField = orderedFields[i];
      const nextField = orderedFields[i + 1];

      // Check if these are paired fields (e.g., WorkTimeFrom/WorkTimeTo)
      const isPaired = isFieldPaired(currentField, nextField);
      if (isPaired) {
        fieldsInStep = 2;
      } else if (i + 2 < orderedFields.length) {
        // Check if current field and the one after next are paired
        const nextNextField = orderedFields[i + 2];
        const isCurrentPairedWithNextNext = isFieldPaired(currentField, nextNextField);
        if (isCurrentPairedWithNextNext) {
          fieldsInStep = 1; // Current field will be in a step with the one after next
        } else {
          fieldsInStep = 2; // Take up to 2 fields if not paired
        }
      } else {
        fieldsInStep = 2; // Take up to 2 fields if not paired
      }
    }

    stepCount++;
    i += fieldsInStep;
  }

  return stepCount;
};

const totalSteps = computed(() => calculateTotalSteps());

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
  // Validate required fields before submitting
  const invalidField = validateRequiredFields();
  if (invalidField) {
    // Scroll to the invalid field
    scrollToInvalidField(invalidField);
    return;
  }

  // Sync trimmed values back to store before submitting
  syncTrimmedValuesToStore();

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

const isDateField = (field: any): boolean => {
  // Check if field tag contains date-related words or if data type is date
  const tag = field.tag.toLowerCase();
  const dataType = field.content[0].data_type?.toLowerCase() || '';

  return (
    tag.includes('date') ||
    tag.includes('beg') ||
    tag.includes('end') ||
    dataType.includes('date') ||
    dataType.includes('time')
  );
};

const getSelectOptions = (values: any) => {
  // Check if values is an object with a nested values array (like WorkTimeFrom/To fields)
  if (values && typeof values === 'object' && Array.isArray(values.values)) {
    return values.values;
  }
  // Otherwise, assume it's a regular array
  return Array.isArray(values) ? values : [];
};

// Function to check if Make field has the new structure with nested values
const isMakeFieldWithNewStructure = (field: any): boolean => {
  // Check if field is Make and has the new structure where values is an object with a values array
  return (
    field.tag === 'Make' &&
    field.content &&
    field.content[0] &&
    field.content[0].values &&
    typeof field.content[0].values === 'object' &&
    Array.isArray(field.content[0].values.values)
  );
};

// Function to group paired fields together (e.g., WorkTimeFrom/WorkTimeTo, ContactTimeFrom/ContactTimeTo)
const groupPairedFields = (fields) => {
  // Create a map to group fields by their prefix (e.g., WorkTime, ContactTime)
  const prefixMap = new Map();

  fields.forEach((field) => {
    const tag = field.tag;
    // Check if field tag ends with "From" or "To"
    if (tag.endsWith('From')) {
      const prefix = tag.slice(0, -4); // Remove "From" to get the prefix
      if (!prefixMap.has(prefix)) {
        prefixMap.set(prefix, { from: field, to: null });
      } else {
        prefixMap.get(prefix).from = field;
      }
    } else if (tag.endsWith('To')) {
      const prefix = tag.slice(0, -2); // Remove "To" to get the prefix
      if (!prefixMap.has(prefix)) {
        prefixMap.set(prefix, { from: null, to: field });
      } else {
        prefixMap.get(prefix).to = field;
      }
    }
  });

  // Create the result array with paired fields together
  const result = [];
  const processedPrefixes = new Set();

  fields.forEach((field) => {
    const tag = field.tag;

    if (tag.endsWith('From')) {
      const prefix = tag.slice(0, -4);
      if (!processedPrefixes.has(prefix)) {
        const pair = prefixMap.get(prefix);
        if (pair && pair.to) {
          result.push(pair.from, pair.to); // Add both From and To fields
          processedPrefixes.add(prefix);
        } else {
          result.push(field); // Add only the From field if no To field exists
          processedPrefixes.add(prefix);
        }
      }
    } else if (tag.endsWith('To')) {
      const prefix = tag.slice(0, -2);
      if (!processedPrefixes.has(prefix)) {
        const pair = prefixMap.get(prefix);
        if (pair && pair.from) {
          result.push(pair.from, pair.to); // Add both From and To fields
          processedPrefixes.add(prefix);
        } else {
          result.push(field); // Add only the To field if no From field exists
          processedPrefixes.add(prefix);
        }
      }
    } else {
      // For non-paired fields, just add them
      if (!tag.endsWith('From') && !tag.endsWith('To')) {
        result.push(field);
      }
    }
  });

  return result;
};

// Check if two fields are paired (e.g., WorkTimeFrom/WorkTimeTo)
const isFieldPaired = (field1: any, field2: any) => {
  const tag1 = field1.tag;
  const tag2 = field2.tag;

  // Check if they have the same prefix and one ends with 'From' and the other with 'To'
  if (tag1.endsWith('From') && tag2.endsWith('To')) {
    return tag1.slice(0, -4) === tag2.slice(0, -2); // Remove 'From' and 'To' and compare
  } else if (tag1.endsWith('To') && tag2.endsWith('From')) {
    return tag1.slice(0, -2) === tag2.slice(0, -4); // Remove 'To' and 'From' and compare
  }

  return false;
};

// Get fields for the current step - MODIFIED: Show all fields from step 0 up to current step
const getFieldsForCurrentStep = () => {
  const orderedFields = getOrderedFields();
  let currentIndex = 0;
  let currentStepIndex = 0;

  // Navigate to the end of the current step to get all fields up to this point
  while (currentStepIndex <= currentStep.value && currentIndex < orderedFields.length) {
    if (currentStepIndex < currentStep.value) {
      // For previous steps, we need to skip all fields in that step
      let fieldsInThisStep = 1;

      // Check if we can add another field to this step
      if (currentIndex + 1 < orderedFields.length) {
        // Check if the current and next field are paired
        if (isFieldPaired(orderedFields[currentIndex], orderedFields[currentIndex + 1])) {
          fieldsInThisStep = 2;
        } else if (currentIndex + 2 < orderedFields.length) {
          // Check if current field and the one after next are paired
          const nextNextField = orderedFields[currentIndex + 2];
          const isCurrentPairedWithNextNext = isFieldPaired(orderedFields[currentIndex], nextNextField);
          if (isCurrentPairedWithNextNext) {
            fieldsInThisStep = 1; // Current field will be in a step with the one after next
          } else {
            fieldsInThisStep = 2; // Take up to 2 fields if not paired
          }
        } else {
          fieldsInThisStep = 2; // Take up to 2 fields if not paired
        }
      }

      currentIndex += fieldsInThisStep;
      currentStepIndex++;
    } else {
      // For the current step, we return all fields up to this point plus the fields in this step
      break;
    }
  }

  // Now calculate the fields for the current step (the last step we're showing)
  if (currentStepIndex === currentStep.value && currentIndex < orderedFields.length) {
    let fieldsInThisStep = 1;

    // Check if we can add another field to this step
    if (currentIndex + 1 < orderedFields.length) {
      // Check if the current and next field are paired
      if (isFieldPaired(orderedFields[currentIndex], orderedFields[currentIndex + 1])) {
        fieldsInThisStep = 2;
      } else if (currentIndex + 2 < orderedFields.length) {
        // Check if current field and the one after next are paired
        const nextNextField = orderedFields[currentIndex + 2];
        const isCurrentPairedWithNextNext = isFieldPaired(orderedFields[currentIndex], nextNextField);
        if (isCurrentPairedWithNextNext) {
          fieldsInThisStep = 1; // Current field will be in a step with the one after next
        } else {
          fieldsInThisStep = 2; // Take up to 2 fields if not paired
        }
      } else {
        fieldsInThisStep = 2; // Take up to 2 fields if not paired
      }
    }

    // Ensure we don't go beyond the array bounds
    fieldsInThisStep = Math.min(fieldsInThisStep, orderedFields.length - currentIndex);

    // Return all fields from the beginning up to and including the current step
    return orderedFields.slice(0, currentIndex + fieldsInThisStep);
  }

  // Return all fields up to the current step index
  return orderedFields.slice(0, currentIndex);
};

// Navigation methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++;

    // Scroll to the item form section after a small delay to ensure DOM is updated
    nextTick(() => {
      if (formFieldsSectionRef.value) {
        // Scroll to the bottom of the section
        formFieldsSectionRef.value.scroll({ top: formFieldsSectionRef.value.scrollHeight, behavior: 'smooth' });
      }
    });
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;

    // Scroll to the item form section after a small delay to ensure DOM is updated
    nextTick(() => {
      if (formFieldsSectionRef.value) {
        // Scroll to the bottom of the section
        formFieldsSectionRef.value.scroll({ top: formFieldsSectionRef.value.scrollHeight, behavior: 'smooth' });
      }
    });
  }
};

const goToStep = (stepIndex: number) => {
  // Allow navigation to any step since all fields are cumulative
  if (stepIndex >= 0 && stepIndex < totalSteps.value) {
    currentStep.value = stepIndex;

    // Scroll to the item form section after a small delay to ensure DOM is updated
    nextTick(() => {
      if (formFieldsSectionRef.value) {
        // Scroll to the bottom of the section
        formFieldsSectionRef.value.scroll({ top: formFieldsSectionRef.value.scrollHeight, behavior: 'smooth' });
      }
    });
  }
};

const getOrderedFields = () => {
  if (!avitoCategoryFieldsStore.categoryFields) {
    return [];
  }

  // Filter out the Id field and the fields that shouldn't be rendered
  const fields = avitoCategoryFieldsStore.categoryFields.filter(
    (f) =>
      f.tag !== 'Id' &&
      f.tag !== 'Category' &&
      f.tag !== 'ServiceType' &&
      f.tag !== 'ServiceSubtype' &&
      f.tag !== 'AutoserviceServiceType' &&
      f.tag !== 'AvitoId' &&
      f.tag !== 'CallsDevices' &&
      f.tag !== 'Latitude' &&
      f.tag !== 'Longitude' &&
      f.tag !== 'Images' &&
      f.tag !== 'ImageNames',
  );

  // Define the specific order for required fields
  const specificRequiredOrder = ['Title', 'Description', 'Price', 'ImageUrls'];

  // Separate fields into categories
  const specificRequiredFields = [];
  const otherRequiredFields = [];
  const optionalFields = [];

  fields.forEach((field) => {
    const isRequired = field.content && field.content[0] && field.content[0].required;

    if (isRequired) {
      const specificIndex = specificRequiredOrder.indexOf(field.tag);
      if (specificIndex !== -1) {
        // Add to specific required fields at the correct position
        specificRequiredFields[specificIndex] = field;
      } else {
        otherRequiredFields.push(field);
      }
    } else {
      optionalFields.push(field);
    }
  });

  // Filter out undefined values and combine in the required order
  const orderedSpecificRequired = specificRequiredOrder
    .map((tag) => specificRequiredFields[specificRequiredOrder.indexOf(tag)])
    .filter((field) => field !== undefined);

  // Group paired fields (e.g., WorkTimeFrom/WorkTimeTo, ContactTimeFrom/ContactTimeTo)
  const groupedOtherRequired = groupPairedFields(otherRequiredFields);
  const groupedOptional = groupPairedFields(optionalFields);

  // Combine all fields in the correct order
  return [...orderedSpecificRequired, ...groupedOtherRequired, ...groupedOptional];
};

onMounted(async () => {
  if (avito_token.value) {
    await avitoCategoryFieldsStore.getAvitoCategoryFields({
      avito_token: avito_token.value,
      avito_slug: avitoCategoriesStore.selectedFinalCategory,
    });
  }
});

// Function to sync trimmed values to the store
const syncTrimmedValuesToStore = () => {
  Object.keys(trimmedFieldValues.value).forEach((key) => {
    if (key === 'ImageUrls') {
      // For ImageUrls, apply trim to each URL in the comma-separated list
      const urls = trimmedFieldValues.value[key] || '';
      const trimmedUrls = urls
        .split(',')
        .map((url) => url.trim())
        .join(',');
      avitoCategoryFieldsStore.formData[key] = trimmedUrls;
    } else {
      avitoCategoryFieldsStore.formData[key] = trimmedFieldValues.value[key];
    }
  });
};

// Watch for changes in the form data from the store and update trimmed values
watch(
  () => avitoCategoryFieldsStore.formData,
  (newFormData) => {
    Object.keys(newFormData).forEach((key) => {
      if (key === 'ImageUrls') {
        // For ImageUrls, apply trim to each URL in the comma-separated list
        const urls = newFormData[key] || '';
        if (urls) {
          const trimmedUrls = urls
            .split(',')
            .map((url) => url.trim())
            .join(',');
          trimmedFieldValues.value[key] = trimmedUrls;
        } else {
          trimmedFieldValues.value[key] = newFormData[key];
        }
      } else {
        trimmedFieldValues.value[key] = newFormData[key];
      }
    });
  },
  { deep: true, immediate: true },
);

// Function to validate required fields
const validateRequiredFields = () => {
  if (!avitoCategoryFieldsStore.categoryFields) {
    return null;
  }

  // Get all fields that are required
  const orderedFields = getOrderedFields();
  for (const field of orderedFields) {
    const isRequired = field.content && field.content[0] && field.content[0].required;
    if (isRequired) {
      // Check if the field has a value
      const fieldValue = avitoCategoryFieldsStore.formData[field.tag];
      if (!fieldValue || fieldValue.toString().trim() === '') {
        // Return the field element that needs to be scrolled to
        const fieldElement = document.getElementById(field.tag);
        if (fieldElement) {
          return fieldElement;
        }
      }
    }

    // Also check child fields if they exist
    if (field.children && field.children.length > 0) {
      for (const child of field.children.filter((c) => c.tag !== 'Id')) {
        const isChildRequired = child.content && child.content[0] && child.content[0].required;
        if (isChildRequired) {
          const childFieldValue = avitoCategoryFieldsStore.formData[child.tag];
          if (!childFieldValue || childFieldValue.toString().trim() === '') {
            const childElement = document.getElementById(child.tag);
            if (childElement) {
              return childElement;
            }
          }
        }
      }
    }
  }

  // If all required fields are filled, return null
  return null;
};

// Function to scroll to the invalid field
const scrollToInvalidField = (fieldElement: HTMLElement) => {
  if (itemFormSectionRef.value && fieldElement) {
    // Scroll the container to bring the field into view
    itemFormSectionRef.value.scrollTo({
      top: fieldElement.offsetTop - itemFormSectionRef.value.offsetTop - 100,
      behavior: 'smooth'
    });

    // Add visual indication to the field
    fieldElement.focus();
  }
};
</script>

<style scoped>
/* Custom styles for form elements */
</style>
