<template>
  <div class="w-full">
    <div class="flex items-center justify-between w-full">
      <div
        v-for="(step, index) in stepperStore.getTotalSteps"
        :key="index"
        class="flex items-center transition-all duration-300 ease-in-out flex-1 min-w-0 basis-0"
      >
        <button
          @click="goToStep(index)"
          :class="[
            'flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300 ease-in-out',
            index === stepperStore.getCurrentStep - 1 ||
            index === stepperStore.getCurrentStep ||
            index === stepperStore.getCurrentStep + 1
              ? 'w-10 h-10 bg-opacity-100' // Active steps (prev, current, next)
              : 'w-8 h-8 bg-opacity-70', // Collapsed steps
            index < stepperStore.getCurrentStep
              ? 'bg-blue-600 text-white'
              : stepperStore.getCurrentStep === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 !text-gray-800 dark:bg-gray-600 dark:text-gray-300',
            'cursor-pointer hover:bg-opacity-80',
          ]"
        >
          {{ index + 1 }}
        </button>
        <div
          v-if="index < stepperStore.getTotalSteps - 1"
          class="flex-1 mx-1 rounded-full transition-all duration-300 ease-in-out"
          :class="
            index === stepperStore.getCurrentStep - 1 || index === stepperStore.getCurrentStep
              ? index < stepperStore.getCurrentStep
                ? 'bg-blue-600 h-0.5'
                : 'bg-gray-200 dark:bg-gray-600 h-1' // Active dividers (prev-current and current-next)
              : 'bg-gray-200 dark:bg-gray-500 h-0.25' // Collapsed dividers
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStepperStore } from './model';

const stepperStore = useStepperStore();

const goToStep = (stepIndex: number) => {
  stepperStore.goToStep(stepIndex);
};
</script>
