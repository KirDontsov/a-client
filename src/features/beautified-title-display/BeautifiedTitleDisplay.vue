<template>
  <!-- Show beautified content when available for Title or Description fields - positioned on the right -->
  <div v-if="beautifiedContent && (fieldTag === 'Title' || fieldTag === 'Description')" class="min-w-[300px] w-full lg:w-auto flex-shrink-0">
    <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 rounded-lg">
      <p class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
        {{ fieldTag === 'Title' ? 'Предложенный заголовок:' : 'Предложенное описание:' }}
      </p>
      <p class="text-gray-700 dark:text-gray-300 mb-3 min-h-[60px]">{{ beautifiedContent }}</p>
      <Button type="button" color="default" variant="dark" size="sm" class="w-full" @click="applyBeautifiedContent">
        Применить
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Button } from '@/shared/components';

interface Emits {
  (e: 'apply-beautified-content', content: string, fieldTag: string): void;
}

interface Props {
  fieldTag: string;
  beautifiedTitle?: string | null;
  beautifiedDescription?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  fieldTag: '',
  beautifiedTitle: null,
  beautifiedDescription: null,
});
const emit = defineEmits<Emits>();

// Computed property to get the beautified content based on field type
const beautifiedContent = computed(() => {
  return props.fieldTag === 'Title' ? props.beautifiedTitle : props.fieldTag === 'Description' ? props.beautifiedDescription : null;
});

// Function to apply the beautified content to the actual field
const applyBeautifiedContent = () => {
  if (beautifiedContent.value) {
    emit('apply-beautified-content', beautifiedContent.value, props.fieldTag);
  }
};

defineExpose({});
</script>
