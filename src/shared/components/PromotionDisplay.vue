<template>
  <div class="flex items-center">
    <span
      v-if="promotionValue && promotionValue !== 'N/A'"
      class="flex items-center px-2 py-1 rounded text-xs font-medium"
      :class="getPromotionClass()"
      :title="getPromotionTooltip(promotionValue)"
    >
      <template v-for="(promo, index) in getPromotionArray()" :key="index">
        <img v-if="getPromotionIconPath(promo)" :src="getPromotionIconPath(promo)" class="w-4 h-4 mr-1" :alt="promo" />
        <span v-else class="mr-1">{{ getPromotionFallbackIcon(promo) }}</span>
      </template>
    </span>
    <span v-else>N/A</span>
  </div>
</template>

<script setup lang="ts">
import { getPromotionTooltip } from '@/shared/lib/promotionMapper';

interface Props {
  promotionValue: string;
}

const props = defineProps<Props>();

const getPromotionArray = (): string[] => {
  if (!props.promotionValue || props.promotionValue === 'N/A') {
    return [];
  }

  // Split the promotion value by comma or other possible delimiters
  // Trim whitespace and filter out empty values
  return props.promotionValue
    .split(/[,;]/) // Split by comma or semicolon
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const getPromotionClass = (): string => {
  if (!props.promotionValue || props.promotionValue === 'N/A') {
    return 'text-gray-500 dark:text-gray-400';
  }

  // For multiple promotions, use a combined styling
  const promotions = getPromotionArray();
  if (promotions.length > 1) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }

  // For single promotions, use specific styling
  const promo = promotions[0];
  switch (promo) {
    case 'Highlight':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'XL':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'x2_1':
    case 'x2_7':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'x5_1':
    case 'x5_7':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'x10_1':
    case 'x10_7':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'x15_1':
    case 'x15_7':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'x20_1':
    case 'x20_7':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const getPromotionIconPath = (value: string) => {
  // Remove suffixes like _1 or _7 to get base promotion type
  const baseValue = value.replace(/(_1|_7)$/, '');

  switch (baseValue) {
    case 'highlight':
      return '/highlight.svg';
    case 'xl':
      return '/xl.svg';
    case 'x2':
      return '/x_2.svg';
    case 'x5':
      return '/x_5.svg';
    case 'x10':
      return '/x_10.svg';
    case 'x15':
    case 'x20':
      // For x15 and x20, use fallback since SVG files don't exist yet
      return '/bbip.svg';
    default:
      return '/bbip.svg';
  }
};

const getPromotionFallbackIcon = (value: string): string => {
  // Fallback emojis if component is not found
  switch (value) {
    case 'Highlight':
      return '🎨';
    case 'XL':
      return '📢';
    case 'x2':
      return '📈';
    case 'x5':
      return '🚀';
    case 'x10':
      return '🌟';
    case 'x15':
    case 'x20':
      return '🔥';
    default:
      return '💡';
  }
};

const getPromotionShortName = (value: string): string => {
  if (!value || value === 'N/A') {
    return value;
  }

  const promotions = value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (promotions.length === 1) {
    // If there's only one promotion, use the specific name
    const promo = promotions[0];
    switch (promo) {
      case 'Highlight':
        return 'Выделение';
      case 'XL':
        return 'XL';
      case 'x2_1':
        return '2x 1д';
      case 'x2_7':
        return '2x 7д';
      case 'x5_1':
        return '5x 1д';
      case 'x5_7':
        return '5x 7д';
      case 'x10_1':
        return '10x 1д';
      case 'x10_7':
        return '10x 7д';
      case 'x15_1':
        return '15x 1д';
      case 'x15_7':
        return '15x 7д';
      case 'x20_1':
        return '20x 1д';
      case 'x20_7':
        return '20x 7д';
      default:
        return promo;
    }
  } else {
    // For multiple promotions, return a combined string
    return promotions
      .map((promo) => {
        switch (promo) {
          case 'Highlight':
            return 'Выделение';
          case 'XL':
            return 'XL';
          case 'x2_1':
            return '2x 1д';
          case 'x2_7':
            return '2x 7д';
          case 'x5_1':
            return '5x 1д';
          case 'x5_7':
            return '5x 7д';
          case 'x10_1':
            return '10x 1д';
          case 'x10_7':
            return '10x 7д';
          case 'x15_1':
            return '15x 1д';
          case 'x15_7':
            return '15x 7д';
          case 'x20_1':
            return '20x 1д';
          case 'x20_7':
            return '20x 7д';
          default:
            return promo;
        }
      })
      .join(', ');
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
