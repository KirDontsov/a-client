<template>
  <section class="py-20 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Отзывы клиентов</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Узнайте, что говорят наши клиенты о платформе Avito Manager
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Иван Петров</div>
              <div class="text-gray-600 dark:text-gray-300">Продавец на Avito</div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 italic">
            "С помощью Avito Manager я смог увеличить свои продажи на 40% за первый месяц использования. Платформа
            действительно упрощает управление объявлениями."
          </p>
          <div class="flex text-yellow-400 dark:text-yellow-500 mt-4">
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Мария Сидорова</div>
              <div class="text-gray-600 dark:text-gray-300">Интернет-магазин</div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 italic">
            "Аналитика в Avito Manager помогла мне оптимизировать мои объявления и увеличить конверсии. Отличная
            платформа для серьезных продавцов."
          </p>
          <div class="flex text-yellow-400 dark:text-yellow-500 mt-4">
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Алексей Кузнецов</div>
              <div class="text-gray-600 dark:text-gray-300">Компания "ТехноСбыт"</div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 italic">
            "Мы используем Avito Manager для управления несколькими аккаунтами. Автоматизация и аналитика значительно
            сократили время на управление."
          </p>
          <div class="flex text-yellow-400 dark:text-yellow-500 mt-4">
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
            <Icon name="star" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Testimonials component script
import { Icon } from '@/shared/icons/icon';
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
