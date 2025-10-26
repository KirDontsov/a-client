<template>
  <div
    :id="item?.ad_id"
    @click.stop="handleSelect"
    class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
  >
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
        {{ getFieldValue('Title') || 'Без названия' }}
      </h5>
    </div>
    <!-- Upper part - Item fields in 2 grid columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Left column - Dynamic fields from item.fields -->
      <div>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-600">
          <!-- Display all fields from item -->
          <li
            v-for="field in item.fields"
            :key="field.field_id"
            class="py-3 sm:py-4">
            <div class="flex items-start">
              <div class="shrink-0"></div>
              <div class="flex gap-4 items-center justify-between w-full ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {{ getCategoryFieldLabel(field.tag) }}:
                </p>
                <div v-for="value in field.values" :key="value.field_value_id" class="mt-1 overflow-hidden">
                  <p class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white truncate">
                    {{ value.value }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Right column - Basic item info -->
      <div class="flex flex-col  gap-6">
        <!-- Image Carousel -->
        <div v-if="imageUrls.length > 0" class="mb-6">
          <div class="relative overflow-hidden rounded-lg">
            <!-- Carousel container -->
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
            >
              <div
                v-for="(imageUrl, index) in imageUrls"
                :key="index"
                class="w-full flex-shrink-0"
              >
                <img
                  :src="imageUrl"
                  :alt="`Item image ${index + 1}`"
                  class="w-full h-64 object-cover bg-gray-100"
                  @error="handleImageError"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Navigation arrows -->
            <button
              v-if="imageUrls.length > 1"
              @click.stop="prevImage"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
              aria-label="Previous image"
            >
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 8-4 4 4 4"/>
              </svg>

            </button>

            <button
              v-if="imageUrls.length > 1"
              @click.stop="nextImage"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
              aria-label="Next image"
            >
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
              </svg>

            </button>

            <!-- Indicators -->
            <div v-if="imageUrls.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                v-for="(_, index) in imageUrls"
                :key="index"
                @click.stop="goToImage(index)"
                :class="[
              'w-3 h-3 rounded-full transition-all',
              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            ]"
                :aria-label="`Go to image ${index + 1}`"
              />
            </div>
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-600">
          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">ID:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ item.ad_id }}
              </div>
            </div>
          </li>

          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Avito ID:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ item.avito_ad_id }}
              </div>
            </div>
          </li>

          <!-- Parsed ID -->
          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Parsed ID:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ item.parsed_id }}
              </div>
            </div>
          </li>

          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Статус:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ item.status }}
              </div>
            </div>
          </li>

          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Активно:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ item.is_active ? 'Да' : 'Нет' }}
              </div>
            </div>
          </li>

          <li class="py-3 sm:py-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Дата создания:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ formatDate(item.created_ts) }}
              </div>
            </div>
          </li>
        </ul>

        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mx-4">
          Аналитика
        </h5>

        <!-- Show loader when analytics are loading -->
        <div v-if="analyticsLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span class="ml-2 text-gray-700 dark:text-gray-300">Загрузка аналитики...</span>
        </div>

        <!-- Show analytics data when loaded -->
        <ul v-else role="list" class="divide-y divide-gray-200 dark:divide-gray-600">
          <!-- Analytics -->
          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Просмотров:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('views') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Показов:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('impressions') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Показов в просмотры:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('impressionsToViewsConversion') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Контакты:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('contacts') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Показов в контакты:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('viewsToContactsConversion') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Избранное:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ getMetricValue('favorites') }}
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Ср. цена просмотра:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(getMetricValue('averageViewCost')) }} &#8381
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Ср. цена контакта:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(getMetricValue('averageContactCost')) }} &#8381
              </div>
            </div>
          </li>

          <li v-if="getAnalyticsForItem()" class="py-3 sm:pt-4">
            <div class="flex items-center">
              <div class="shrink-0"></div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">Затраты:</p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(getMetricValue('spending')) }} &#8381
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { AvitoAd, AvitoItemAnalytics, CategoryField } from '@/shared/interfaces/avito';
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  item: AvitoAd;
  // TODO: fix types
  analyticsData: AvitoItemAnalytics[] | null;
  analyticsLoading?: boolean;
  categoryFields?: CategoryField[]; // CategoryField[] type would be better but requires import
}

interface Emits {
  (e: 'select', value: string): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

// Carousel state
const currentImageIndex = ref(0);
const carouselInterval = ref<NodeJS.Timeout | null>(null);

// Extract image URLs from the item fields
const imageUrls = computed(() => {
  const imagesField = props.item.fields?.find(field => field.tag === 'Images');
  if (imagesField && imagesField.values.length > 0) {
    const imagesValue = imagesField.values[0].value;
    // Split comma-separated URLs and filter out empty strings
    return imagesValue.split(',').filter(url => url.trim() !== '');
  }
  return [];
});

// Carousel navigation functions
const nextImage = () => {
  if (imageUrls.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % imageUrls.value.length;
  }
};

const prevImage = () => {
  if (imageUrls.value.length > 0) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? imageUrls.value.length - 1
        : currentImageIndex.value - 1;
  }
};

const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
};

// Auto-rotate carousel
const startCarousel = () => {
  if (imageUrls.value.length > 1) {
    carouselInterval.value = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds
  }
};

const stopCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
    carouselInterval.value = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});

const handleSelect = ({ currentTarget }) => {
  emit('select', currentTarget.id);
};

// Function to find matching analytics data for this item
const getAnalyticsForItem = () => {
  if (!props.analyticsData || !props.item.avito_ad_id) {
    return null;
  }
  
  // Find the analytics grouping that matches this item's avito_ad_id
  const matchingGrouping = props.analyticsData?.find(
    grouping => grouping.id.toString() === props.item.avito_ad_id
  );
  
  return matchingGrouping ? matchingGrouping.metrics : null;
};

// Helper function to get metric value by slug
const getMetricValue = (slug: string): string | number => {
  const analytics = getAnalyticsForItem();
  if (!analytics) return '';
  
  const metric = analytics?.find(m => m.slug === slug);
  if (!metric) return '';
  
  // Format specific metrics
  if (slug === 'averageViewCost' || slug === 'averageContactCost' || slug === 'spending') {
    return metric.value / 100; // Convert from kopeks to rubles
  }
  
  if (slug === 'viewsToContactsConversion' || slug === 'impressionsToViewsConversion') {
    return (metric.value * 100).toFixed(2) + '%'; // Convert to percentage
  }
  
  return metric.value;
};

// Helper function to format currency values
const formatCurrency = (value: number): string => {
  if (typeof value !== 'number') return '';
  return value.toFixed(2);
};

// Helper function to extract field value by tag
const getFieldValue = (tag: string): string => {
  const field = props.item.fields?.find((f) => f.tag === tag);
  if (field && field.values.length > 0) {
    return field.values[0].value;
  }
  return '';
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to get category field label by tag
const getCategoryFieldLabel = (tag: string): string => {
  if (!props.categoryFields) return tag;
  
  const categoryField = props.categoryFields.find((field) => field.tag === tag);
  return categoryField ? categoryField.label : tag;
};
</script>
