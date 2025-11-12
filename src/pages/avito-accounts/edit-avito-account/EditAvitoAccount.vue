<template>
  <PageContainer :loading="loading">
    <template #body>
      <div class="w-full px-4 py-2 sm:px-8 sm:py-4 flex flex-col gap-8">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-80 dark:text-white">Edit Avito Account</h2>
        </div>

        <form
          class="space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="avito_client_id"
              v-model="formData.avito_client_id"
              type="text"
              placeholder="Enter Avito client ID"
              label="Avito Client ID"
              :required="true"
            />
            <div>
              <label for="avito_client_secret" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Avito Client Secret
              </label>
              <div class="relative">
                <input
                  :type="showSecret ? 'text' : 'password'"
                  id="avito_client_secret"
                  v-model="formData.avito_client_secret"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Avito client secret"
                  required
                />
                <Button
                  type="button"
                  @click="toggleSecretVisibility"
                  color="default"
                  variant="dark"
                  button-class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div class="flex items-center space-x-4">
          <Button type="button" @click="updateAccount" :disabled="updatingAccount" color="default" variant="dark">
            {{ updatingAccount ? 'Updating...' : 'Update Account' }}
          </Button>
          <Button type="button" @click="goBack" color="default" variant="dark"> Cancel </Button>
        </div>

        <!-- Error message -->
        <div
          v-if="avitoAccountsStore.error"
          class="mt-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100"
        >
          {{ avitoAccountsStore.error }}
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAvitoAccountsStore } from '@/entities/avito-accounts';
import { PageContainer } from '@/features/page-container';
import { Button } from '@/shared/components';
import { InputField } from '@/shared/components/input-field';

const router = useRouter();
const route = useRoute();
const avitoAccountsStore = useAvitoAccountsStore();

const updatingAccount = ref<boolean>(false);
const loading = ref<boolean>(true);
const showSecret = ref<boolean>(false);
// Reactive form data that will be updated when account data is loaded
const formData = ref({
  avito_client_id: '',
  avito_client_secret: '',
});

const toggleSecretVisibility = () => {
  showSecret.value = !showSecret.value;
};

// Get account data on component mount
onMounted(async () => {
  const accountId = route.params.id as string;
  if (accountId) {
    try {
      // Fetch the account data
      await avitoAccountsStore.fetchAccount(accountId);

      // Populate the form with the account data
      const account = avitoAccountsStore.getAccountById(accountId);
      if (account) {
        formData.value = {
          avito_client_id: account.avito_client_id,
          avito_client_secret: account.avito_client_secret,
        };
      }
    } catch (error) {
      console.error('Error fetching account:', error);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});

// Update account
const updateAccount = async () => {
  updatingAccount.value = true;
  const accountId = route.params.id as string;

  try {
    // Call the store action to update the account
    await avitoAccountsStore.updateAccount(accountId, formData.value);

    // Navigate back to accounts list
    router.push('/accounts');
  } catch (error) {
    console.error('Error updating account:', error);
    // Error is handled in the store
  } finally {
    updatingAccount.value = false;
  }
};

const goBack = () => {
  router.push('/accounts');
};
</script>

<style scoped>
/* Custom styles for the component */
</style>
