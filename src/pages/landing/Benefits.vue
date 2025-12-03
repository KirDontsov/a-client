<template>
  <section id="benefits" class="py-20 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ключевые преимущества</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Почему тысячи продавцов выбирают нашу платформу для управления Avito
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-90/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="lightning" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Эффективность</h3>
          <p class="text-gray-600 dark:text-gray-300">Управление всеми операциями Avito из единого интерфейса</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-90/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="chart" class="w-8 h-8 text-green-600 dark:text-green-40" />
          </div>
          <h3 class="text-xl font-bold text-gray-90 dark:text-white mb-3">Аналитика</h3>
          <p class="text-gray-600 dark:text-gray-300">Доступ к комплексной аналитике для оптимизации объявлений</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-purple-10 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="grid" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-90 dark:text-white mb-3">Гибкость</h3>
          <p class="text-gray-600 dark:text-gray-300">Поддержка нескольких аккаунтов и массовых операций</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-90/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="chat" class="w-8 h-8 text-yellow-600 dark:text-yellow-40" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Пользовательский опыт</h3>
          <p class="text-gray-600 dark:text-gray-300">Интуитивный интерфейс с адаптивным дизайном</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@/shared/icons';
// Benefits component script
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
