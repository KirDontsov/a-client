import type { AvitoItemAnalyticsParams } from '@/shared';
import { ref } from 'vue';
import { getAvitoItemAnalytics } from '@/shared/api/avito';

export function useAvitoItemsAnalytics() {
  const analyticsLoading = ref(false);
  const analyticsError = ref<string | null>(null);

  // Function to fetch analytics and combine with items
  const fetchAndCombineAnalytics = async (store: any, params: AvitoItemAnalyticsParams) => {
    analyticsLoading.value = true;
    analyticsError.value = null;

    try {
      // First ensure we have items
      if (store.items.length === 0) {
        await store.getAvitoItems({ avito_token: params.avito_token });
      }

      // Fetch analytics data
      const analyticsResponse = await getAvitoItemAnalytics(params);

      if (analyticsResponse?.result?.groupings) {
        // Create a map of itemId -> analytics
        // Note: grouping.id is number, but item.id is string (ad_id)
        const analyticsMap = new Map();
        analyticsResponse.result.groupings.forEach((grouping) => {
          analyticsMap.set(grouping.id.toString(), grouping.metrics);
        });

        // Combine analytics with items
        store.items = store.items.map((item) => ({
          ...item,
          analytics: analyticsMap.get(item.id) || null,
        }));
      }

      return store.items;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      analyticsError.value = 'Failed to fetch analytics data';
      return null;
    } finally {
      analyticsLoading.value = false;
    }
  };

  return {
    analyticsLoading,
    analyticsError,
    fetchAndCombineAnalytics,
  };
}
