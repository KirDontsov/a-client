<template>
  <PageContainer :loading="avitoCategoryFieldsStore.categoryFieldsLoading">
    <template #body>
      <div class="w-full flex flex-col gap-8 text-gray-50 dark:text-gray-40 px-4 py-2 sm:px-8 sm:py-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Создание объявления</h2>
        <SelectedCategoryPath />
        <Stepper />

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
                      <div class="absolute bottom-0 left-0 flex flex-col items-center mb-6 group-hover:flex">
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
                      v-model="trimmedFieldValues[field.tag]"
                      :required="field.content[0].required"
                      :error="avitoCategoryFieldsStore.getFieldError(field.tag)"
                      placeholder="Выберите дату"
                    />
                    <!-- Regular input field -->
                    <InputField
                      v-else
                      :id="field.tag"
                      v-model="trimmedFieldValues[field.tag]"
                      :type="getInputType(field.content[0].data_type)"
                      :required="field.content[0].required"
                      :isTextarea="field.tag === 'Description'"
                      :helperText="field.tag === 'ImageUrls' ? 'Ссылки на фотографии через запятую' : undefined"
                      :error="avitoCategoryFieldsStore.getFieldError(field.tag)"
                      class="w-full"
                    />
                  </div>
                  <!-- Select field -->
                  <div v-else-if="field.content[0].field_type === 'select' || field.tag === 'Make'" class="relative">
                    <SelectField
                      :id="field.tag"
                      v-model="trimmedFieldValues[field.tag]"
                      :required="field.content[0].required"
                      :error="avitoCategoryFieldsStore.getFieldError(field.tag)"
                      :placeholder="'Выберите значение'"
                      :options="getSelectOptionsForField(field)"
                    />
                  </div>

                  <!-- Checkbox field -->
                  <div v-else-if="field.content[0].field_type === 'checkbox' && field.tag !== 'Make'" class="space-y-2">
                    <!-- Special handling for fields containing "Days" in the tag (e.g., WorkDays, SmthDays) -->
                    <div v-if="field.tag.includes('Days')" class="flex flex-wrap gap-4">
                      <div v-for="option in field.content[0].values" :key="option.value" class="flex items-center">
                        <Checkbox
                          :id="`${field.tag}-${option.value}`"
                          :name="`${field.tag}-${option.value}`"
                          :value="option.value"
                          v-model="trimmedFieldValues[field.tag]"
                          :label="option.value"
                        />
                      </div>
                    </div>
                    <!-- Regular checkbox field -->
                    <div v-else class="space-y-2">
                      <div v-for="option in field.content[0].values" :key="option.value" class="flex items-center">
                        <Checkbox
                          :id="`${field.tag}-${option.value}`"
                          :name="`${field.tag}-${option.value}`"
                          :value="option.value"
                          v-model="trimmedFieldValues[field.tag]"
                          :label="option.value"
                        />
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
                          <div class="absolute bottom-0 left-0 flex flex-col items-center mb-6 group-hover:flex">
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
                      <DatePicker
                        v-if="child.content[0].field_type === 'input' && isDateField(child)"
                        :id="child.tag"
                        v-model="trimmedFieldValues[child.tag]"
                        :required="child.content[0].required"
                        :error="avitoCategoryFieldsStore.getFieldError(child.tag)"
                        placeholder="Выберите дату"
                      />
                      <InputField
                        v-else-if="child.content[0].field_type === 'input'"
                        :id="child.tag"
                        v-model="trimmedFieldValues[child.tag]"
                        :type="getInputType(child.content[0].data_type)"
                        :required="child.content[0].required"
                        :isTextarea="child.tag === 'Description'"
                        :error="avitoCategoryFieldsStore.getFieldError(child.tag)"
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
                            <Checkbox
                              :id="`${child.tag}-${option.value}`"
                              :name="`${child.tag}-${option.value}`"
                              :value="option.value"
                              v-model="trimmedFieldValues[child.tag]"
                              :label="option.value"
                            />
                          </div>
                        </div>
                        <!-- Regular child checkbox field -->
                        <div v-else class="space-y-2">
                          <div v-for="option in child.content[0].values" :key="option.value" class="flex items-center">
                            <Checkbox
                              :id="`${child.tag}-${option.value}`"
                              :name="`${child.tag}-${option.value}`"
                              :value="option.value"
                              v-model="trimmedFieldValues[child.tag]"
                              :label="option.value"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Child select field -->
                      <div
                        v-else-if="child.content[0].field_type === 'select' || child.tag === 'Make'"
                        class="relative"
                      >
                        <SelectField
                          :id="child.tag"
                          v-model="trimmedFieldValues[child.tag]"
                          :required="child.content[0].required"
                          :error="avitoCategoryFieldsStore.getFieldError(child.tag)"
                          :placeholder="'Выберите значение'"
                          :options="getSelectOptionsForField(child)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <!-- Step Navigation -->
          <div class="flex justify-between pt-4">
            <Button
              type="button"
              @click="prevStep"
              :disabled="stepperStore.getCurrentStep === 0"
              color="default"
              variant="dark"
            >
              Назад
            </Button>
            <div class="flex space-x-2">
              <Button
                v-if="stepperStore.getCurrentStep < stepperStore.getTotalSteps - 1"
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
import { onMounted, ref, nextTick, watch } from 'vue';
import { PageContainer } from '@/features/page-container';
import { SelectedCategoryPath, Stepper, useStepperStore } from '@/features';
import { DatePicker } from '@/shared/components/date-picker';
import { InputField, SelectField } from '@/shared/components';
import { Button, Checkbox } from '@/shared/components';
import { isDateField, getSelectOptions, isMakeFieldWithNewStructure } from '@/shared/lib/field-helpers';
import { useToast } from '@/shared/composables/useToast';

const { value: avito_token } = useCookies('avito_token');
const { success: toastSuccess, error: toastError } = useToast();

const avitoCategoriesStore = useAvitoCategoriesStore();
const avitoCategoryFieldsStore = useAvitoCategoryFieldsStore();
const stepperStore = useStepperStore();
const itemFormSectionRef = ref(null);
const formFieldsSectionRef = ref(null);

// Reactive object to store trimmed values for fields that need trimming
const trimmedFieldValues = ref({});

const getInputType = (dataType: string) => {
  switch (dataType) {
    case 'integer':
    case 'float':
      return 'number';
    default:
      return 'text';
  }
};

// Function to get select options for the SelectField component
const getSelectOptionsForField = (field: any) => {
  if (field.tag === 'Make' && isMakeFieldWithNewStructure(field)) {
    return field.content[0].values.values.map((option: any) => ({
      value: option.value,
      label: option.description ? `${option.value} - ${option.description}` : option.value
    }));
  } else if (field.tag === 'Make') {
    return getSelectOptions(field.content[0].values).map((option: any) => ({
      value: option.value,
      label: option.description ? `${option.value} - ${option.description}` : option.value
    }));
 } else {
    return getSelectOptions(field.content[0].values).map((option: any) => ({
      value: option.value,
      label: option.description ? `${option.value} - ${option.description}` : option.value
    }));
  }
};

const handleSubmit = async () => {
  // Sync trimmed values back to store before submitting
  syncTrimmedValuesToStore();

  // Validate using store's validation
  const isValid = avitoCategoryFieldsStore.validateForm();

  if (!isValid) {
    // Find the first field with an error to scroll to
    const orderedFields = avitoCategoryFieldsStore.getOrderedFields();
    for (const field of orderedFields) {
      if (avitoCategoryFieldsStore.getFieldError(field.tag)) {
        const fieldElement = document.getElementById(field.tag);
        if (fieldElement) {
          scrollToInvalidField(fieldElement);
          break;
        }
      }

      // Also check child fields if they exist
      if (field.children && field.children.length > 0) {
        for (const child of field.children.filter((c) => c.tag !== 'Id')) {
          if (avitoCategoryFieldsStore.getFieldError(child.tag)) {
            const childElement = document.getElementById(child.tag);
            if (childElement) {
              scrollToInvalidField(childElement);
              break;
            }
          }
        }
      }
    }
    return;
  }

  try {
    await avitoCategoryFieldsStore.submitForm();
    // Show success message
    toastSuccess('Объявление успешно создано!');
  } catch (error) {
    console.error('Error submitting form:', error);
    toastError('Произошла ошибка при создании объявления. Пожалуйста, проверьте заполнение полей.');
  }
};

const handleReset = () => {
  avitoCategoryFieldsStore.initializeFormData();
};


// Get fields for the current step - MODIFIED: Show all fields from step 0 up to current step
const getFieldsForCurrentStep = () => {
  return stepperStore.getFieldsForCurrentStep;
};

// Navigation methods
const nextStep = () => {
  stepperStore.nextStep();

  // Scroll to the item form section after a small delay to ensure DOM is updated
  nextTick(() => {
    if (formFieldsSectionRef.value) {
      // Scroll to the bottom of the section
      formFieldsSectionRef.value.scroll({ top: formFieldsSectionRef.value.scrollHeight, behavior: 'smooth' });
    }
  });
};

const prevStep = () => {
  stepperStore.prevStep();

  // Scroll to the item form section after a small delay to ensure DOM is updated
  nextTick(() => {
    if (formFieldsSectionRef.value) {
      // Scroll to the bottom of the section
      formFieldsSectionRef.value.scroll({ top: formFieldsSectionRef.value.scrollHeight, behavior: 'smooth' });
    }
  });
};


// The original onMounted function is now included in the watch section above

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
      avitoCategoryFieldsStore.updateFormField(key, trimmedUrls);
    } else {
      avitoCategoryFieldsStore.updateFormField(key, trimmedFieldValues.value[key]);
    }
  });
};

// Watch for changes in the form data from the store and update trimmed values
watch(
  () => avitoCategoryFieldsStore.formData,
  (newFormData) => {
    // Only update trimmedFieldValues for fields that don't exist in trimmedFieldValues yet
    // This prevents overwriting user-entered values when other fields change
    Object.keys(newFormData).forEach((key) => {
      // Check if this is a date or checkbox field to determine if it should be in trimmedFieldValues
      // Find the field definition to check if it's a date or checkbox field
      const isDateFld =
        avitoCategoryFieldsStore.categoryFields?.some((field) => field.tag === key && isDateField(field)) || false;
      const isCheckboxFld =
        avitoCategoryFieldsStore.categoryFields?.some(
          (field) => field.tag === key && field.content[0]?.field_type === 'checkbox',
        ) || false;

      // Only update if the value doesn't exist in trimmedFieldValues (initialization)
      if (!(key in trimmedFieldValues.value)) {
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
        } else if (isDateFld || isCheckboxFld) {
          // For date and checkbox fields, we still need to sync from store to local for initialization
          // but the user interactions will be with trimmedFieldValues
          trimmedFieldValues.value[key] = newFormData[key];
        } else {
          // For input fields, we'll use the store's formData only if not already in trimmedFieldValues
          // This prevents overwriting user input when other fields change
          trimmedFieldValues.value[key] = newFormData[key];
        }
      }
    });
  },
  { deep: true, immediate: true },
);

// Also watch trimmedFieldValues to sync back to store
watch(
  trimmedFieldValues,
  (newTrimmedValues) => {
    Object.keys(newTrimmedValues).forEach((key) => {
      // Only update the store if the value is different from what's in the store
      if (avitoCategoryFieldsStore.formData[key] !== newTrimmedValues[key]) {
        avitoCategoryFieldsStore.updateFormField(key, newTrimmedValues[key]);
      }
    });
  },
  { deep: true },
);

// Function to scroll to the invalid field
const scrollToInvalidField = (fieldElement: HTMLElement) => {
  if (itemFormSectionRef.value && fieldElement) {
    // Scroll the container to bring the field into view
    itemFormSectionRef.value.scrollTo({
      top: fieldElement.offsetTop - itemFormSectionRef.value.offsetTop - 100,
      behavior: 'smooth',
    });

    // Add visual indication to the field
    fieldElement.focus();
  }
};

onMounted(async () => {
  if (avito_token.value) {
    await avitoCategoryFieldsStore.getAvitoCategoryFields({
      avito_token: avito_token.value,
      avito_slug: avitoCategoriesStore.selectedFinalCategory,
    });

    // After getting the fields, ensure all store values are in trimmedFieldValues
    if (avitoCategoryFieldsStore.formData) {
      Object.keys(avitoCategoryFieldsStore.formData).forEach((key) => {
        if (!(key in trimmedFieldValues.value)) {
          const value = avitoCategoryFieldsStore.formData[key];
          trimmedFieldValues.value[key] = value;
        }
      });
    }

    // Initialize the stepper with the loaded fields
    const orderedFields = avitoCategoryFieldsStore.getOrderedFields();
    stepperStore.initializeStepper(orderedFields);
  }
});
</script>

<style scoped>
/* Custom styles for form elements */
</style>
