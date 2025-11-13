import { defineStore } from 'pinia';
import { getAvitoCategoryFields, avitoCreateAd } from '@/shared/api/avito';
import { useAvitoAccountsStore } from '@/entities/avito-accounts';
import { getOrderedFields } from '@/shared/lib/field-ordering';

import type { AvitoTokenParams, CategoryField, AvitoGetCategoryFieldsResponse } from '@/shared';

interface AvitoCategoryFieldsState {
  categoryFields: CategoryField[] | null;
  categoryFieldsLoading: boolean;
  formData: Record<string, any>;
  errors: Record<string, string>;
}

export const useAvitoCategoryFieldsStore = defineStore('avito-category-fields', {
  state: (): AvitoCategoryFieldsState => ({
    categoryFields: null,
    categoryFieldsLoading: true,
    formData: {},
    errors: {},
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
      this.errors = {}; // Clear errors when initializing form data
      this.categoryFields.forEach((field) => {
        if (field.content && field.content.length > 0) {
          const firstContent = field.content[0];

          // Set default values if available
          if (firstContent.default) {
            this.formData[field.tag] = firstContent.default.value;
          } else if (firstContent.field_type === 'checkbox' && firstContent.values && firstContent.values.length > 0) {
            // For checkbox fields, initialize as an empty array
            this.formData[field.tag] = [];
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

    getFieldError(fieldTag: string): string | undefined {
      return this.errors[fieldTag];
    },

    clearFieldError(fieldTag: string) {
      if (this.errors[fieldTag]) {
        delete this.errors[fieldTag];
      }
    },

    validateForm(): boolean {
      if (!this.categoryFields) return false;

      // Clear previous errors
      this.errors = {};

      let isValid = true;

      // Fields to exclude from validation (similar to UI filtering)
      const excludedFields = [
        'Id',
        'Category',
        'ServiceType',
        'ServiceSubtype',
        'AutoserviceServiceType',
        'AvitoId',
        'CallsDevices',
        'Latitude',
        'Longitude',
        'Images',
        'ImageNames',
        'Promo',
        'PromoAutoOptions',
        'PromoManualOptions'
      ];

      // Validate each field
      this.categoryFields.forEach((field) => {
        // Skip validation for excluded fields
        if (excludedFields.includes(field.tag)) {
          return;
        }

        if (field.content && field.content.length > 0) {
          const firstContent = field.content[0];

          // Validate required fields
          if (firstContent.required) {
            const fieldValue = this.formData[field.tag];
            if (
              !fieldValue ||
              (Array.isArray(fieldValue) && fieldValue.length === 0) ||
              (typeof fieldValue === 'string' && fieldValue.trim() === '')
            ) {
              this.errors[field.tag] = 'Это поле обязательно для заполнения';
              isValid = false;
            }
          }

          // Validate children fields if they exist
          if (field.children && field.children.length > 0) {
            field.children.forEach((child) => {
              // Skip validation for excluded child fields
              if (excludedFields.includes(child.tag)) {
                return;
              }

              if (child.content && child.content.length > 0) {
                const childContent = child.content[0];

                if (childContent.required) {
                  const childValue = this.formData[child.tag];
                  if (
                    !childValue ||
                    (Array.isArray(childValue) && childValue.length === 0) ||
                    (typeof childValue === 'string' && childValue.trim() === '')
                  ) {
                    this.errors[child.tag] = 'Это поле обязательно для заполнения';
                    isValid = false;
                  }
                }
              }
            });
          }
        }
      });

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        throw new Error('Form validation failed');
      }

      // Get the selected account ID from the avito accounts store
      const avitoAccountsStore = useAvitoAccountsStore();
      const accountId = avitoAccountsStore.selectedAccountId;

      if (!accountId) {
        throw new Error('No account selected. Please select an Avito account first.');
      }

      // Send the formData to the new API endpoint with account_id and avito_token if available
      return await avitoCreateAd(this.formData, accountId);
    },

    getOrderedFields(): CategoryField[] {
      return getOrderedFields(this.categoryFields);
    },
  },
});
