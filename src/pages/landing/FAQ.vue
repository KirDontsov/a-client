<template>
  <section class="py-20 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Часто задаваемые вопросы</h2>
        <p class="text-gray-600 dark:text-gray-300">Ответы на наиболее популярные вопросы о платформе Avito Manager</p>
      </div>

      <Accordion :items="faqItems" />
    </div>
  </section>
</template>

<script setup>
import { Accordion } from '@/shared/components';

const faqItems = [
  {
    title: 'Как подключить мой аккаунт Avito?',
    content:
      'Для подключения аккаунта Avito перейдите в раздел "Управление аккаунтами" и нажмите "Добавить аккаунт". Следуйте инструкциям для безопасной авторизации через официальный API Avito.',
  },
  {
    title: 'Можно ли управлять несколькими аккаунтами?',
    content:
      'Да, наша платформа позволяет управлять несколькими аккаунтами Avito из единого интерфейса. Это особенно удобно для бизнеса с несколькими профилями или для агентств, управляющих аккаунтами клиентов.',
  },
  {
    title: 'Как часто обновляются данные?',
    content:
      'Данные обновляются в реальном времени через API Avito. Аналитические данные обновляются каждые 15 минут, чтобы обеспечить актуальную информацию для принятия решений.',
  },
  {
    title: 'Есть ли бесплатный пробный период?',
    content:
      'Да, у нас есть 14-дневный бесплатный пробный период для тарифа "Профессиональный", в котором вы получаете полный доступ ко всем функциям платформы.',
  },
];
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
