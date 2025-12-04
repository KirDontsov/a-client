<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <Header />
    <Hero />
    <Features />
    <Benefits />
    <Stats />
    <Testimonials />
    <Pricing />
    <FAQ />
    <CTA />
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue';
import Hero from './Hero.vue';
import Features from './Features.vue';
import Benefits from './Benefits.vue';
import Stats from './Stats.vue';
import Testimonials from './Testimonials.vue';
import Pricing from './Pricing.vue';
import FAQ from './FAQ.vue';
import CTA from './CTA.vue';
import Footer from './Footer.vue';
import ThemeToggle from '@/shared/components/theme-toggle/ThemeToggle.vue';

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
});

// Initialize FAQ accordion functionality
document.addEventListener('DOMContentLoaded', () => {
  const faqButtons = document.querySelectorAll('.border.border-gray-200.rounded-lg.overflow-hidden > button');
  faqButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const content = this.nextElementSibling;
      const isOpen = content.style.display === 'block';

      // Close all FAQ items
      document.querySelectorAll('.border.border-gray-20.rounded-lg.overflow-hidden > div').forEach((item) => {
        item.style.display = 'none';
      });

      // Toggle current item if it was closed
      if (!isOpen) {
        content.style.display = 'block';
      }
    });
  });
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
