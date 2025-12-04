<template>
  <div class="mb-4">
    <label v-if="label" :for="id" :class="['block mb-2 text-sm font-medium text-gray-900 dark:text-white', labelClass]"
      >{{ label }}<span v-if="required" class="!text-red-400">*</span></label
    >
    <!-- Select field -->
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none',
        error ? '!border-red-400' : '',
        required && !modelValue && touched ? '!border-red-400' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        inputClass,
      ]"
      @change="handleChange"
      @blur="handleBlur"
      @focus="$emit('focus', $event)"
    >
      <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <p v-if="error" class="mt-2 text-sm text-red-400 dark:text-red-40">{{ error }}</p>
    <p v-else-if="required && !modelValue && touched" class="mt-2 text-sm !text-red-400 dark:text-red-50">
      Обязательное поле
    </p>
    <p v-else-if="helperText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ helperText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Define the props for the component
interface Option {
  value: string | number;
  label: string;
}

interface Props {
  id?: string;
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  inputClass?: string;
  labelClass?: string;
  required?: boolean;
  options: Option[] | string[] | number[];
}

// Define the emitted events
interface Emits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  options: () => [],
});

const emit = defineEmits<Emits>();

const touched = ref(false);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  emit('update:modelValue', value);
};

const handleBlur = (event: FocusEvent) => {
  touched.value = true;
  emit('blur', event);
};

// Helper functions to handle different option types
const getOptionValue = (option: Option | string | number): string => {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option);
  }
  return String(option.value);
};

const getOptionLabel = (option: Option | string | number): string => {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option);
  }
  return option.label || String(option.value);
};
</script>