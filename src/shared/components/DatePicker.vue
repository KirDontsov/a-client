<template>
  <div ref="datepickerRef" class="relative">
    <div class="relative">
      <input
        :id="id"
        v-model="localValue"
        type="text"
        :placeholder="placeholder"
        :required="required"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700 transition-colors duration-200 pl-10"
        @focus="showCalendar = true"
        @blur="handleBlur"
      />
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 0-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <div
      v-if="showCalendar"
      class="absolute z-10 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-3 min-w-max"
      @mousedown.prevent
    >
      <div class="flex justify-between items-center mb-2">
        <button
          type="button"
          @click="prevMonth"
          class="rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center w-fit overflow-visible p-0!"
        >
          <svg
            class="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m14 8-4 4 4 4"
            />
          </svg>
        </button>
        <div class="text-sm font-medium text-gray-700 dark:text-white">
          {{ currentMonthYear }}
        </div>
        <button
          type="button"
          @click="nextMonth"
          class="rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center w-fit overflow-visible p-0!"
        >
          <svg
            class="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m10 16 4-4-4-4"
            />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-1">
        <div
          v-for="day in dayNames"
          :key="day"
          class="text-xs text-center py-1 text-gray-700 dark:text-white font-medium"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in daysInMonth"
          :key="day.date.toString()"
          :class="[
            'text-center text-sm py-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600',
            {
              'text-gray-400 dark:text-gray-500': day.isPrevMonth || day.isNextMonth,
              'text-gray-700 dark:text-white': !day.isPrevMonth && !day.isNextMonth,
              'bg-blue-500 text-white': isSameDay(day.date, selectedDate),
              'font-bold': isSameDay(day.date, new Date()) && !isSameDay(day.date, selectedDate),
            },
          ]"
          @click="selectDate(day.date)"
        >
          {{ day.date.getDate() }}
        </div>
      </div>

      <div class="flex justify-end mt-2 space-x-2">
        <button
          type="button"
          @click="today"
          class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-500"
        >
          Сегодня
        </button>
        <button
          type="button"
          @click="clear"
          class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-500"
        >
          Очистить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

interface Props {
  id?: string;
  modelValue: string | null;
  placeholder?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  placeholder: 'Выберите дату',
  required: false,
  modelValue: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const datepickerRef = ref<HTMLElement | null>(null);
const showCalendar = ref(false);
const selectedDate = ref<Date | null>(null);
const currentDate = ref(new Date());
const localValue = ref('');

// Day names in Russian
const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Watch for changes in modelValue and update localValue and selectedDate
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // Try to parse date in DD-MM-YYYY format first
      let date: Date | null = null;
      if (/^\d{2}-\d{2}-\d{4}$/.test(newValue)) {
        // Parse DD-MM-YYYY format
        const [day, month, year] = newValue.split('-').map(Number);
        date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
      } else {
        // Try parsing as standard format
        date = new Date(newValue);
      }

      if (date && !isNaN(date.getTime())) {
        selectedDate.value = date;
        localValue.value = formatDate(date);
      } else {
        selectedDate.value = null;
        localValue.value = newValue;
      }
    } else {
      selectedDate.value = null;
      localValue.value = '';
    }
  },
  { immediate: true },
);

// Watch for changes in localValue and emit update
watch(localValue, (newValue) => {
  // Check if the input is a valid date format
  if (newValue) {
    // Try to parse date in DD-MM-YYYY format first
    let date: Date | null = null;
    if (/^\d{2}-\d{2}-\d{4}$/.test(newValue)) {
      // Parse DD-MM-YYYY format
      const [day, month, year] = newValue.split('-').map(Number);
      date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    } else {
      // Try parsing as standard format
      date = new Date(newValue);
    }

    if (date && !isNaN(date.getTime())) {
      // If it's a valid date, emit using our format
      emit('update:modelValue', formatDate(date));
    } else {
      // If it's not a valid date, emit as is
      emit('update:modelValue', newValue);
    }
  } else {
    emit('update:modelValue', null);
  }
});

// Format date as DD-MM-YYYY
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date | null): boolean => {
  if (!date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get current month and year for display
const currentMonthYear = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric', locale: 'ru-RU' };
  return currentDate.value.toLocaleDateString('ru-RU', options);
});

// Get days in the current month with prev/next month indicators
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // First day of calendar (Sunday)
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1)); // Monday as first day

  // Last day of calendar (Saturday)
  const endDay = new Date(lastDay);
  endDay.setDate(lastDay.getDate() + (7 - lastDay.getDay()) + (lastDay.getDay() === 0 ? -1 : 6)); // Monday as first day

  const days = [];
  const current = new Date(startDay);

  while (current <= endDay) {
    const date = new Date(current);
    days.push({
      date,
      isPrevMonth: date.getMonth() < month,
      isNextMonth: date.getMonth() > month,
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
});

// Navigate to previous month
const prevMonth = (e: Event) => {
  e.stopPropagation(); // Prevent event bubbling that might close the calendar
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

// Navigate to next month
const nextMonth = (e: Event) => {
  e.stopPropagation(); // Prevent event bubbling that might close the calendar
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

// Select a date
const selectDate = (date: Date) => {
  selectedDate.value = date;
  localValue.value = formatDate(date);
  showCalendar.value = false;
  emit('update:modelValue', formatDate(date));
};

// Set today's date
const today = (e: Event) => {
  e.stopPropagation(); // Prevent event bubbling that might interfere with selection
  const today = new Date();
  selectDate(today);
};

// Clear the date
const clear = (e: Event) => {
  e.stopPropagation(); // Prevent event bubbling that might interfere with clearing
  selectedDate.value = null;
  localValue.value = '';
  showCalendar.value = false;
  emit('update:modelValue', null);
};

// Handle blur event with a delay to allow date selection
const handleBlur = () => {
  setTimeout(() => {
    showCalendar.value = false;
  }, 200); // Increased delay to allow for click events to register
};

// Close calendar on outside click
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  // Check if the click is outside the datepicker container
  if (showCalendar.value && datepickerRef.value && !datepickerRef.value.contains(target)) {
    showCalendar.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
