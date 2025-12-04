<template>
  <PageContainer>
    <template #body>
      <div class="w-full flex flex-col gap-8 px-4 py-2 sm:px-8 sm:py-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Подключить новый аккаунт Avito</h2>
        </div>

        <form
          class="space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8 dark:bg-gray-700 dark:border-gray-600"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="avito_client_id"
              v-model="newAccount.avito_client_id"
              type="text"
              placeholder="Введите ID клиента Avito"
              label="ID клиента Avito"
              :required="true"
            />
            <InputField
              id="avito_client_secret"
              v-model="newAccount.avito_client_secret"
              type="password"
              placeholder="Введите секретный ключ клиента Avito"
              label="Секретный ключ клиента Avito"
              :required="true"
            />
          </div>
        </form>

        <div class="flex items-center space-x-4">
          <Button type="button" @click="createAccount" :disabled="creatingAccount" color="default" variant="dark">
            {{ creatingAccount ? 'Подключение...' : 'Подключить аккаунт' }}
          </Button>
          <Button type="button" @click="goBack" color="default" variant="dark"> Отмена </Button>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAvitoAccountsStore } from '@/entities/avito-accounts';
import { PageContainer } from '@/features/page-container';
import { InputField } from '@/shared/components/input-field';
import { Button } from '@/shared/components';

const router = useRouter();
const avitoAccountsStore = useAvitoAccountsStore();

const creatingAccount = ref<boolean>(false);
const newAccount = ref({
  avito_client_id: '',
  avito_client_secret: '',
});

// Create new account
const createAccount = async () => {
  creatingAccount.value = true;

  try {
    // Call the store action to create a new account
    await avitoAccountsStore.createAccount(newAccount.value);

    // Reset form
    newAccount.value = {
      avito_client_id: '',
      avito_client_secret: '',
    };

    // Navigate back to accounts list
    router.push('/accounts');
  } catch (error) {
    console.error('Error creating account:', error);
    // Error is handled in the store
  } finally {
    creatingAccount.value = false;
  }
};

const goBack = () => {
  router.push('/accounts');
};
</script>

<style scoped>
/* Custom styles for the component */
</style>
