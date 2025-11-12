import { defineStore } from 'pinia';
import type { CategoryField } from '@/shared';

interface StepperState {
  currentStep: number;
  totalSteps: number;
  orderedFields: CategoryField[];
}

export const useStepperStore = defineStore('stepper', {
  state: (): StepperState => ({
    currentStep: 0,
    totalSteps: 0,
    orderedFields: [],
  }),

  actions: {
    setCurrentStep(step: number) {
      if (step >= 0 && step < this.totalSteps) {
        this.currentStep = step;
      }
    },

    setTotalSteps(steps: number) {
      this.totalSteps = steps;
    },

    setOrderedFields(fields: CategoryField[]) {
      this.orderedFields = fields;
    },

    nextStep() {
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },

    goToStep(step: number) {
      if (step >= 0 && step < this.totalSteps) {
        this.currentStep = step;
      }
    },

    resetStepper() {
      this.currentStep = 0;
      this.totalSteps = 0;
      this.orderedFields = [];
    },
  },

  getters: {
    getCurrentStep: (state) => state.currentStep,
    getTotalSteps: (state) => state.totalSteps,
    getOrderedFields: (state) => state.orderedFields,
    getFieldsForCurrentStep: (state) => {
      if (!state.orderedFields || state.orderedFields.length === 0) {
        return [];
      }

      // Logic to group paired fields (e.g., WorkTimeFrom/WorkTimeTo)
      const isFieldPaired = (field1: CategoryField, field2: CategoryField): boolean => {
        const tag1 = field1.tag;
        const tag2 = field2.tag;

        // Check if they have the same prefix and one ends with 'From' and the other with 'To'
        if (tag1.endsWith('From') && tag2.endsWith('To')) {
          return tag1.slice(0, -4) === tag2.slice(0, -2); // Remove 'From' and 'To' and compare
        } else if (tag1.endsWith('To') && tag2.endsWith('From')) {
          return tag1.slice(0, -2) === tag2.slice(0, -4); // Remove 'To' and 'From' and compare
        }

        return false;
      };

      let currentIndex = 0;
      let currentStepIndex = 0;

      // Navigate to the end of the current step to get all fields up to this point
      while (currentStepIndex <= state.currentStep && currentIndex < state.orderedFields.length) {
        if (currentStepIndex < state.currentStep) {
          // For previous steps, we need to skip all fields in that step
          let fieldsInThisStep = 1;

          // Check if we can add another field to this step
          if (currentIndex + 1 < state.orderedFields.length) {
            // Check if the current and next field are paired
            if (isFieldPaired(state.orderedFields[currentIndex], state.orderedFields[currentIndex + 1])) {
              fieldsInThisStep = 2;
            } else if (currentIndex + 2 < state.orderedFields.length) {
              // Check if current field and the one after next are paired
              const nextNextField = state.orderedFields[currentIndex + 2];
              const isCurrentPairedWithNextNext = isFieldPaired(state.orderedFields[currentIndex], nextNextField);
              if (isCurrentPairedWithNextNext) {
                fieldsInThisStep = 1; // Current field will be in a step with the one after next
              } else {
                fieldsInThisStep = 2; // Take up to 2 fields if not paired
              }
            } else {
              fieldsInThisStep = 2; // Take up to 2 fields if not paired
            }
          }

          currentIndex += fieldsInThisStep;
          currentStepIndex++;
        } else {
          // For the current step, we return all fields up to this point plus the fields in this step
          break;
        }
      }

      // Now calculate the fields for the current step (the last step we're showing)
      if (currentStepIndex === state.currentStep && currentIndex < state.orderedFields.length) {
        let fieldsInThisStep = 1;

        // Check if we can add another field to this step
        if (currentIndex + 1 < state.orderedFields.length) {
          // Check if the current and next field are paired
          if (isFieldPaired(state.orderedFields[currentIndex], state.orderedFields[currentIndex + 1])) {
            fieldsInThisStep = 2;
          } else if (currentIndex + 2 < state.orderedFields.length) {
            // Check if current field and the one after next are paired
            const nextNextField = state.orderedFields[currentIndex + 2];
            const isCurrentPairedWithNextNext = isFieldPaired(state.orderedFields[currentIndex], nextNextField);
            if (isCurrentPairedWithNextNext) {
              fieldsInThisStep = 1; // Current field will be in a step with the one after next
            } else {
              fieldsInThisStep = 2; // Take up to 2 fields if not paired
            }
          } else {
            fieldsInThisStep = 2; // Take up to 2 fields if not paired
          }
        }

        // Ensure we don't go beyond the array bounds
        fieldsInThisStep = Math.min(fieldsInThisStep, state.orderedFields.length - currentIndex);

        // Return all fields from the beginning up to and including the current step
        return state.orderedFields.slice(0, currentIndex + fieldsInThisStep);
      }

      // Return all fields up to the current step index
      return state.orderedFields.slice(0, currentIndex);
    },
  },
});