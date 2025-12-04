<template>
  <div class="flex items-center">
    <input
      :id="id"
      v-model="checked"
      type="checkbox"
      :name="name"
      :value="value"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-4 h-4 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-0 appearance-none relative checked:bg-blue-500 checked:border-blue-500 dark:checked:bg-blue-500 dark:checked:border-blue-500',
        {
          [customClass]: customStyling && modelValue,
        },
      ]"
    />
    <label
      v-if="label"
      :for="id"
      :class="['ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300', labelClass]"
    >
      {{ label }}
      <span v-if="required" class="!text-red-400">*</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  modelValue?: boolean;
  name?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelClass?: string;
  customClass?: string;
  customStyling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => `checkbox-${Math.random().toString(36).substr(2, 9)}`,
  modelValue: false,
  name: '',
  value: undefined,
  disabled: false,
  required: false,
  label: '',
  labelClass: '',
  customClass: 'checked:bg-blue-500 checked:border-blue-500',
  customStyling: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const checked = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<style scoped>
/* Checkmark that appears when checked */
input[type='checkbox']::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 5px;
  height: 10px;
  border: solid;
  border-width: 0 2px 2px 0;
  border-color: white;
  opacity: 0; /* Initially hidden */
}

/* Show checkmark when checkbox is checked */
input[type='checkbox']:checked::after {
  opacity: 1;
}
</style>
