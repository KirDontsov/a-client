import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  function initializeTheme() {
    // Determine the initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    let themeToUse;

    if (savedTheme) {
      // Use saved theme from localStorage
      themeToUse = savedTheme === 'dark';
    } else {
      // Use system preference if no saved theme
      themeToUse = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Save system preference to localStorage
      localStorage.setItem('theme', themeToUse ? 'dark' : 'light');
    }

    // Set the reactive state
    isDark.value = themeToUse;
    
    // Ensure the HTML element reflects the correct state
    updateHtmlClass(themeToUse);
  }

  function updateHtmlClass(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
 }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    updateHtmlClass(isDark.value);
  }

  function setDarkTheme() {
    isDark.value = true;
    localStorage.setItem('theme', 'dark');
    updateHtmlClass(true);
  }

  function setLightTheme() {
    isDark.value = false;
    localStorage.setItem('theme', 'light');
    updateHtmlClass(false);
  }

  return {
    isDark,
    initializeTheme,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
  };
});