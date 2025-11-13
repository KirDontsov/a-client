<template>
  <PageContainer>
    <template #body>
      <div
        class="w-full p-4 bg-white border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-700 dark:border-gray-600"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-80 dark:text-white">Загрузить новый фид</h2>
        </div>

        <!-- Tabs -->
        <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li class="mr-2" role="presentation">
              <button
                @click="activeTab = 'xml'"
                :class="[
                  'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer',
                  activeTab === 'xml'
                    ? 'bg-white text-blue-600 border-blue-600 active dark:bg-gray-800 dark:text-blue-500 dark:border-blue-500'
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:bg-transparent dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800',
                ]"
                type="button"
                role="tab"
                :aria-controls="'xml-tab'"
                :aria-selected="activeTab === 'xml'"
              >
                Загрузить XML
              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button
                @click="activeTab = 'xls'"
                :class="[
                  'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer',
                  activeTab === 'xls'
                    ? 'bg-white text-blue-600 border-blue-600 active dark:bg-gray-800 dark:text-blue-500 dark:border-blue-500'
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-60 hover:border-gray-300 dark:bg-transparent dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800',
                ]"
                type="button"
                role="tab"
                :aria-controls="'xls-tab'"
                :aria-selected="activeTab === 'xls'"
              >
                Загрузить XLS/XLSX (Скоро)
              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button
                @click="activeTab = 'text'"
                :class="[
                  'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer',
                  activeTab === 'text'
                    ? 'bg-white text-blue-60 border-blue-600 active dark:bg-gray-800 dark:text-blue-500 dark:border-blue-500'
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-30 dark:bg-transparent dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800',
                ]"
                type="button"
                role="tab"
                :aria-controls="'text-tab'"
                :aria-selected="activeTab === 'text'"
              >
                Ввести текст XML (Скоро)
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <form class="space-y-6">
          <!-- XML Tab -->
          <div v-if="activeTab === 'xml'" class="space-y-6">
            <div class="mb-4">
              <label for="xml_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Ссылка на XML
              </label>
              <input
                id="xml_url"
                v-model="feedData.xml_url"
                type="url"
                placeholder="Введите ссылку на XML файл"
                class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <!--            <div class="mb-4">-->
            <!--              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"-->
            <!--                >Загрузить XML файл (Скоро)</label-->
            <!--              >-->
            <!--              <input-->
            <!--                disabled-->
            <!--                type="file"-->
            <!--                accept=".xml"-->
            <!--                @change="handleFileUpload"-->
            <!--                class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"-->
            <!--              />-->
            <!--            </div>-->
          </div>

          <!-- XLS/XLSX Tab -->
          <div v-if="activeTab === 'xls'" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Загрузить XLS/XLSX файл (Скоро)
                  </label>
                  <input
                    disabled
                    type="file"
                    accept=".xls,.xlsx"
                    @change="handleFileUpload"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Text Tab -->
          <div v-if="activeTab === 'text'" class="space-y-6">
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">XML Текст (Скоро)</label>
              <textarea
                disabled
                v-model="feedData.xml_content"
                rows="10"
                placeholder="Вставьте XML контент сюда"
                class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <Button type="button" @click="submitFeed" :disabled="submitting" color="default" variant="dark">
              {{ submitting ? 'Загружаем...' : 'Загрузить фид' }}
            </Button>
            <Button type="button" @click="goBack" color="default" variant="dark">Отмена</Button>
          </div>
        </form>

        <!-- Error message -->
        <div v-if="error" class="mt-4 p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-90 dark:text-red-100">
          {{ error }}
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PageContainer } from '@/features/page-container';
import { Button } from '@/shared/components';
import { importAvitoXml } from '@/shared/api/avito/avito';
import { useAvitoAccountsStore } from '@/entities/avito-accounts/model';

const router = useRouter();
const avitoAccountsStore = useAvitoAccountsStore();

const activeTab = ref('xml');
const submitting = ref<boolean>(false);
const error = ref<string | null>(null);

const feedData = ref({
  xml_url: '',
  xml_content: '',
  file: null as File | null,
});

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    feedData.value.file = target.files[0];
  }
};

// Submit feed
const submitFeed = async () => {
  if (activeTab.value === 'xml' && !feedData.value.xml_url) {
    error.value = 'Пожалуйста, введите ссылку на XML';
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    if (activeTab.value === 'xml') {
      // For the XML tab, call the importAvitoXml API
      const selectedAccountId = avitoAccountsStore.selectedAccountId;

      if (!selectedAccountId) {
        throw new Error('No Avito account selected');
      }

      const response = await importAvitoXml({
        account_id: selectedAccountId,
        xml_url: feedData.value.xml_url,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Show success message or handle response as needed
      console.log('XML import successful', await response.json());
    }

    // Reset form
    feedData.value = {
      xml_url: '',
      xml_content: '',
      file: null,
    };

    // Navigate back to feeds list
    router.push('/avito/feeds');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to import feed';
    console.error('Error importing feed:', err);
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.push('/feeds');
};
</script>

<style scoped>
/* Custom styles for the component */
</style>
