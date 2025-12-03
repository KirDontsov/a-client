<template>
  <div
    :id="accordionId"
    class="divide-y divide-gray-200 border border-gray-200 dark:divide-gray-700 dark:border-gray-700 rounded-lg overflow-hidden"
  >
    <div v-for="(item, index) in items" :key="index" :class="['accordion-item', { active: activeIndex === index }]">
      <h2 :id="`${accordionId}-heading-${index + 1}`">
        <button
          type="button"
          :class="[
            'flex items-center justify-between w-full p-5 font-medium text-left text-gray-900 dark:text-white',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'transition-colors duration-200',
            activeIndex === index ? 'bg-gray-50 dark:bg-gray-800' : '',
          ]"
          :aria-expanded="activeIndex === index"
          :aria-controls="`${accordionId}-body-${index + 1}`"
          @click="toggleAccordion(index)"
        >
          <span class="flex items-center">
            <span>{{ item.title }}</span>
          </span>
          <svg
            :class="['w-4 h-4 transition-transform duration-300 shrink-0', activeIndex === index ? 'rotate-180' : '']"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 12 8"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="m1 1 5 5 5-5"
            />
          </svg>
        </button>
      </h2>
      <transition
        name="accordion"
        enter-active-class="transition-[height] duration-300 ease-out"
        leave-active-class="transition-[height] duration-30 ease-in"
        enter-from-class="opacity-0 h-0"
        enter-to-class="opacity-100 h-auto"
        leave-from-class="opacity-100 h-auto"
        leave-to-class="opacity-0 h-0"
      >
        <div
          v-show="activeIndex === index"
          :id="`${accordionId}-body-${index + 1}`"
          :aria-labelledby="`${accordionId}-heading-${index + 1}`"
          class="transition-all duration-300 ease-in-out"
        >
          <div class="p-5 border-t border-gray-200 dark:border-gray-700">
            <slot :name="`content-${index}`" :item="item">
              <p class="text-gray-600 dark:text-gray-300" v-html="item.content"></p>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface AccordionItem {
  title: string;
  content: string;
}

interface Props {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number | number[];
  accordionId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  defaultOpen: () => -1,
  accordionId: () => `accordion-${Math.random().toString(36).substr(2, 9)}`,
});

const activeIndex = ref<number | number[]>(-1);

onMounted(() => {
  if (Array.isArray(props.defaultOpen)) {
    activeIndex.value = props.multiple ? props.defaultOpen : (props.defaultOpen[0] ?? -1);
  } else {
    activeIndex.value = props.defaultOpen;
  }
});

const toggleAccordion = (index: number) => {
  if (props.multiple) {
    if (Array.isArray(activeIndex.value)) {
      const currentIndex = activeIndex.value.indexOf(index);
      if (currentIndex > -1) {
        activeIndex.value = activeIndex.value.filter((i) => i !== index);
      } else {
        activeIndex.value = [...activeIndex.value, index];
      }
    } else {
      activeIndex.value = [index];
    }
  } else {
    activeIndex.value = activeIndex.value === index ? -1 : index;
  }
};
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>
