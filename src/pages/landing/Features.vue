<template>
  <section id="features" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Основные функции</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Все необходимые инструменты для эффективного управления вашими Avito аккаунтами
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Account Management -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="user" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Управление аккаунтами</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Безопасное подключение и управление несколькими аккаунтами Avito из единого интерфейса
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Подключение нескольких аккаунтов</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Безопасное хранение данных</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Централизованное управление</span>
            </li>
          </ul>
        </div>

        <!-- Feed Management -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-green-100 dark:bg-green-90/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="upload" class="w-6 h-6 text-green-600 dark:text-green-40" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Управление фидами</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Импорт, организация и управление фидами товаров для автоматизированного управления
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Импорт фидов товаров</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Автоматическое обновление</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Организация каталога</span>
            </li>
          </ul>
        </div>

        <!-- Ad Editor -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="editor" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Редактор объявлений</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Создание и редактирование объявлений с формами, специфичными для категорий
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Формы для разных категорий</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Массовое редактирование</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Шаблоны объявлений</span>
            </li>
          </ul>
        </div>

        <!-- Analytics Dashboard -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-90/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="chart" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Аналитическая панель</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Отслеживание метрик производительности, просмотров, контактов и конверсий
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Отслеживание производительности</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Анализ конверсий</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Реальные данные</span>
            </li>
          </ul>
        </div>

        <!-- Data Visualization -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-red-100 dark:bg-red-90/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="grid" class="w-6 h-6 text-red-600 dark:text-red-40" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Визуализация данных</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Переключение между табличным и карточным представлением для оптимального отображения данных
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Табличное представление</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Карточное представление</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Интерактивные графики</span>
            </li>
          </ul>
        </div>

        <!-- Data Export -->
        <div
          class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-indigo-10 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
            <Icon name="download" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Экспорт данных</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Возможность экспорта CSV для внешного анализа и отчетности
          </p>
          <ul class="text-gray-600 dark:text-gray-300 space-y-2">
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Экспорт в CSV</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Внешний анализ</span>
            </li>
            <li class="flex items-start">
              <Icon name="check" class="w-5 h-5 text-green-500 dark:text-green-500 mr-2 mt-0.5" />
              <span class="text-gray-900 dark:text-white">Отчетность</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@/shared/icons';
import { Check } from '@/shared/icons/check';
// Features component script
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
