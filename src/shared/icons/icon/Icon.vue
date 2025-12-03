<template>
  <component :is="dynamicComponent" :isSelected="isSelected" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

interface Props {
  name: string;
  isSelected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSelected: false
});

// Use defineOptions to inherit attrs
defineOptions({
  inheritAttrs: false
});

const name = computed(
  () => props.name.charAt(0).toUpperCase() + props.name.slice(1)
);

const dynamicComponent = defineAsyncComponent(
  () => import(`../${props.name}/${name.value}.vue`).catch(() => {
    console.warn(`Icon component not found: ${props.name}`);
    return null;
  })
);
</script>
