import { defineStore } from 'pinia';
import { getAvitoCategories } from '@/shared/api/avito';
import type { AvitoTokenParams, AvitoCategoriesState, AvitoGetCategoriesResponse } from '@/shared';
import { useLocalStorage } from '@vueuse/core';

export const useAvitoCategoriesStore = defineStore('avito-categories', {
  state: () =>
    ({
      categories: null,
      categoriesLoading: true,
      selectedCategories: [],
      selectedFinalCategory: useLocalStorage('selected-category', '') || (null as unknown as string | null),
    }) as AvitoCategoriesState,

  getters: {
    // Getter for visible levels based on selected categories
    visibleLevels: (state) => {
      const levels = [];
      let currentLevel = state.categories;

      // Always show the first level
      if (currentLevel) {
        levels.push(currentLevel);

        // For each selected category, show its nested categories
        for (let i = 0; i < state.selectedCategories.length; i++) {
          const selectedCategory = state.selectedCategories[i];

          if (selectedCategory?.nested && selectedCategory?.nested.length > 0) {
            currentLevel = selectedCategory?.nested;
            levels.push(currentLevel);
          } else {
            break;
          }
        }
      }

      return levels;
    },
  },

  actions: {
    async getAvitoCategories({ avito_token }: AvitoTokenParams): Promise<AvitoGetCategoriesResponse | null> {
      try {
        const res = await getAvitoCategories({ avito_token });

        if (res) {
          this.categories = res?.data?.categories || [];
        }

        return res;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.categoriesLoading = false;
      }
    },

    // Check if a category is selected at a specific level
    isCategorySelected(levelIndex, category) {
      return (
        this.selectedCategories.length > levelIndex && this.selectedCategories[levelIndex]?.slug === category?.slug
      );
    },

    setSelectedFinalCategory(v) {
      this.selectedFinalCategory = v?.slug;
    },

    // Handle category selection
    selectCategory(levelIndex, category) {
      // If clicking on the same category, deselect it and all subsequent levels

      if (this.isCategorySelected(levelIndex, category)) {
        this.selectedCategories = this.selectedCategories.slice(0, levelIndex);
        return;
      }

      // Update selected categories up to this level
      this.selectedCategories = this.selectedCategories.slice(0, levelIndex);
      this.selectedCategories.push(category);

      if (!category?.nested && !category?.nested?.length) {
        this.setSelectedFinalCategory(category);
      }
    },

    // Clear all selected categories
    clearSelectedCategories() {
      this.selectedCategories = [];
    },
  },
});
