<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="id"
      :class="['block mb-2 text-sm font-medium text-gray-900 dark:text-white', labelClass]"
      >{{ label }}</label
    >
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        error ? 'border-red-500' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        inputClass,
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
    <p v-else-if="helperText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ helperText }}</p>
  </div>
</template>

<script setup lang="ts">
// Define the props for the component
interface Props {
  id?: string;
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  inputClass?: string;
  labelClass?: string;
}

// Define the emitted events
interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}

// Define default values for props
withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

defineEmits<Emits>();
</script>
