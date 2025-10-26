<template>
  <div>
    <button
      @click="downloadCsv"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      :disabled="!items || items.length === 0"
      :class="{ 'opacity-50 cursor-not-allowed': !items || items.length === 0 }"
    >
      Скачать CSV ({{ items?.length || 0 }} элементов)
    </button>
  </div>
</template>

<script setup lang="ts">
interface AvitoCategory {
  name?: string;
  id?: number;
}

export interface AvitoItemWithAnalytics {
  address: string;
  category: AvitoCategory;
  id: number;
  price: number;
 status: string;
 title: string;
  url: string;
  analytics: {
    views: string;
    contacts: string;
    viewsToContactsConversion: string;
    favorites: string;
    averageViewCost: string;
    averageContactCost: string;
    impressions: string;
    impressionsToViewsConversion: string;
    spending: string;
  };
}

const props = defineProps<{
  items: AvitoItemWithAnalytics[];
}>();

const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const convertTo2DArray = (items: AvitoItemWithAnalytics[]): string[][] => {
  const headers = [
    'ID',
    'Название',
    'Адрес',
    'Категория',
    'Цена',
    'Статус',
    'Ссылка',
    'Показы',
    'Просмотры',
    'Контакты',
    'Конверсия просмотров в контакты',
    'В избранном',
    'Средняя стоимость просмотра',
    'Средняя стоимость контакта',
    'Конверсия показов в просмотры',
    'Расходы',
  ];

  // Convert each item to a row
  const rows = items.map((item) => [
    safeStringify(item.id),
    safeStringify(item.title),
    safeStringify(item.address),
    safeStringify(item.category?.name),
    safeStringify(item.price),
    safeStringify(item.status),
    safeStringify(item.url),
    safeStringify(item.analytics?.impressions),
    safeStringify(item.analytics?.views),
    safeStringify(item.analytics?.contacts),
    safeStringify(item.analytics?.viewsToContactsConversion),
    safeStringify(item.analytics?.favorites),
    safeStringify(item.analytics?.averageViewCost),
    safeStringify(item.analytics?.averageContactCost),
    safeStringify(item.analytics?.impressionsToViewsConversion),
    safeStringify(item.analytics?.spending),
  ]);

  return [headers, ...rows];
};

const convertToCsvString = (data: string[][]): string => {
  return data
    .map((row) =>
      row
        .map((cell) => {
          // Ensure cell is a string and escape quotes
          const stringCell = safeStringify(cell);
          const escapedCell = stringCell.replace(/"/g, '""').replace('.', ',');

          // Wrap in quotes if contains commas, quotes, or newlines
          if (escapedCell.includes(',') || escapedCell.includes('"') || escapedCell.includes('\n')) {
            return `"${escapedCell}"`;
          }
          return escapedCell;
        })
        .join(','),
    )
    .join('\n');
};

const downloadCsv = () => {
  if (!props.items || props.items.length === 0) {
    console.warn('No items to export');
    return;
  }

  try {
    const twoDArray = convertTo2DArray(props.items);
    const csvContent = convertToCsvString(twoDArray);

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'avito_analytics.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating CSV:', error);
  }
};
</script>
