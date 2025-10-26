import { defineStore } from 'pinia';
import { getAvitoCategoryFields } from '@/shared/api/avito';
import type { AvitoTokenParams, CategoryField, AvitoGetCategoryFieldsResponse } from '@/shared';

interface AvitoCategoryFieldsState {
  categoryFields: CategoryField[] | null;
  categoryFieldsLoading: boolean;
  formData: Record<string, any>;
}

export const useAvitoCategoryFieldsStore = defineStore('avito-category-fields', {
  state: (): AvitoCategoryFieldsState => ({
    categoryFields: null,
    categoryFieldsLoading: true,
    formData: {},
  }),

  actions: {
    async getAvitoCategoryFields({
      avito_token,
      avito_slug,
    }: AvitoTokenParams): Promise<AvitoGetCategoryFieldsResponse | null> {
      try {
        this.categoryFieldsLoading = true;
        const res = await getAvitoCategoryFields({ avito_token, avito_slug });

        if (res) {
          this.categoryFields = res?.data?.fields || [];
          // Initialize form data with default values
          this.initializeFormData();
        }

        return res;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.categoryFieldsLoading = false;
      }
    },

    initializeFormData() {
      if (!this.categoryFields) return;

      this.formData = {};
      this.categoryFields.forEach((field) => {
        if (field.content && field.content.length > 0) {
          const firstContent = field.content[0];

          // Set default values if available
          if (firstContent.default) {
            this.formData[field.tag] = firstContent.default.value;
          } else if (firstContent.values && firstContent.values.length > 0) {
            // Set first value as default for select fields
            this.formData[field.tag] = firstContent.values[0].value;
          } else {
            // Set empty value based on data type
            switch (firstContent.data_type) {
              case 'string':
                this.formData[field.tag] = '';
                break;
              case 'integer':
              case 'float':
                this.formData[field.tag] = 0;
                break;
              case 'array':
                this.formData[field.tag] = [];
                break;
              default:
                this.formData[field.tag] = '';
            }
          }
        }
      });
    },

    updateFormField(fieldTag: string, value: any) {
      this.formData[fieldTag] = value;
    },

    validateForm(): boolean {
      if (!this.categoryFields) return false;

      let isValid = true;

      this.categoryFields.forEach((field) => {
        if (field.content && field.content.length > 0) {
          const firstContent = field.content[0];

          if (firstContent.required && !this.formData[field.tag]) {
            isValid = false;
          }

          // Check data type validation
          if (this.formData[field.tag]) {
            switch (firstContent.data_type) {
              case 'integer':
                if (!Number.isInteger(Number(this.formData[field.tag]))) {
                  isValid = false;
                }
                break;
              case 'float':
                if (isNaN(parseFloat(this.formData[field.tag]))) {
                  isValid = false;
                }
                break;
              case 'array':
                if (!Array.isArray(this.formData[field.tag])) {
                  isValid = false;
                }
                break;
            }
          }
        }
      });

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        throw new Error('Form validation failed');
      }

      // Here you would typically send the formData to your API
      console.log('Form data to submit:', this.formData);

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
  },
});
