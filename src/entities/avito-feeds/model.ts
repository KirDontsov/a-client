import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type AvitoAdsByFeedResponse, type AvitoFeedAds, BACKEND_PORT } from '@/shared';

export const useFeedsStore = defineStore('feeds', () => {
  const adsData = ref<AvitoFeedAds[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAdsByFeed = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${BACKEND_PORT}/api/avito/ads_by_feed`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data: AvitoAdsByFeedResponse = await response.json();

      if (data.status === 'success') {
        adsData.value = data.data;
      } else {
        throw new Error('Failed to fetch ads data');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching ads:', err);
    } finally {
      loading.value = false;
    }
  };

  const getAdsByFeedId = (feedId: string) => {
    return adsData.value.find((feed) => feed.feed_id === feedId)?.ads || [];
  };

  return {
    adsData,
    loading,
    error,
    fetchAdsByFeed,
    getAdsByFeedId,
  };
});
