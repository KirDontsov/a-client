<template>
  <section id="pricing" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Тарифные планы</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Выберите подходящий план для вашего бизнеса</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">14-дневный пробный</h3>
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">Бесплатно</div>
          <ul class="space-y-4 mb-8 text-gray-900 dark:text-white">
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Все функции платформы
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Без ввода данных карты
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Поддержка на все время пробного периода
            </li>
          </ul>
          <button
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Начать пробный период
          </button>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">1 месяц</h3>
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">3 000₽</div>
          <ul class="space-y-4 mb-8 text-gray-900 dark:text-white">
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Все функции платформы
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Управление до 20 аккаунтов
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Продвинутая аналитика
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Экспорт данных
            </li>
          </ul>
          <button
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Выбрать тариф
          </button>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-blue-500 dark:border-blue-500 relative"
        >
          <div
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold"
          >
            Популярный
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">12 месяцев</h3>
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">30 000₽</div>
          <ul class="space-y-4 mb-8 text-gray-900 dark:text-white">
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Все функции платформы
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Управление до 50 аккаунтов
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Продвинутая аналитика
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Экспорт данных
            </li>
            <li class="flex items-center">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              Приоритетная поддержка
            </li>
          </ul>
          <button
            class="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Выбрать тариф
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Pricing component script
import { Icon } from '@/shared/index.js';
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
