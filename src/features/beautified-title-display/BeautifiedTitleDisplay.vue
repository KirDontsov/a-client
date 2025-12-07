<template>
  <!-- Show beautified title when available for Title field - positioned on the right -->
  <div v-if="fieldTag === 'Title' && props.beautifiedTitle" class="min-w-[300px] w-full lg:w-auto flex-shrink-0">
    <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 rounded-lg">
      <p class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Предложенный заголовок:</p>
      <p class="text-gray-700 dark:text-gray-300 mb-3 min-h-[60px]">{{ props.beautifiedTitle }}</p>
      <Button type="button" color="default" variant="dark" size="sm" class="w-full" @click="applyBeautifiedTitle">
        Применить
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Button } from '@/shared/components';

interface Emits {
  (e: 'apply-beautified-title', title: string): void;
}

interface Props {
  fieldTag: string;
  beautifiedTitle?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  fieldTag: '',
  beautifiedTitle: null,
});
const emit = defineEmits<Emits>();

// Function to apply the beautified title to the actual Title field
const applyBeautifiedTitle = () => {
  if (props.beautifiedTitle) {
    emit('apply-beautified-title', props.beautifiedTitle);
  }
};

// Watch for changes in field tag
watch(
  () => props.fieldTag,
  (newFieldTag) => {
    // Reset the beautified title when the field tag changes
    if (newFieldTag !== 'Title') {
      beautifiedTitle.value = null;
    }
  },
);

defineExpose({});
</script>
