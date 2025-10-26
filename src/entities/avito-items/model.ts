import { defineStore } from 'pinia';
import type { AvitoMeta, AvitoItemAnalyticsParams, AvitoAdsByFeedResponse, AvitoAd } from '@/shared';
import { getAvitoItemAnalytics, getAvitoItems } from '@/shared/api/avito';

export interface AvitoAnalytics {
  views: string;
  contacts: string;
  viewsToContactsConversion: string;
  favorites: string;
  averageViewCost: string;
  averageContactCost: string;
  impressions: string;
  impressionsToViewsConversion: string;
  spending: string;
}

// Analytics API response interface
export interface AvitoAnalyticsResponse {
  result: {
    dataTotalCount: number;
    groupings: AvitoAnalyticsGrouping[];
    timestamp: string;
  };
}

export interface AvitoAnalyticsGrouping {
  id: number;
  metrics: AvitoMetric[];
  type: string;
}

export interface AvitoMetric {
  slug: string;
  value: number;
}

export const useAvitoItemsStore = defineStore('avito-items', {
  state: () => ({
    pagination: null as AvitoMeta | null,
    items: [] as AvitoAd[],
    itemsLoading: true,
    category: null as string,
    analyticsData: null as AvitoAnalytics,
    analyticsLoading: false,
    analyticsError: null as string | null,
  }),

  actions: {
    async getAvitoItems({ page, limit }): Promise<AvitoAdsByFeedResponse | null> {
      try {
        this.itemsLoading = true;

        const res = await getAvitoItems({ page, limit });

        if (res && res.status === 'success') {
          this.items = (res.data?.ads as AvitoAd[]) || [];
          this.category = res.data?.[0]?.category;

          // Use the meta from the response if available, otherwise create a mock
          if (res?.pagination) {
            // If the response has a meta object, use it
            this.pagination = {
              page: res?.pagination.page || page,
              per_page: res?.pagination.limit || limit,
              total_items: res?.pagination.total || 0,
            };
          } else {
            this.pagination = {
              page: page,
              per_page: limit,
              total_items: 0, // We don't know the total items yet
            };
          }
        }

        return res;
      } catch (error) {
        console.warn(error);
        return null;
      } finally {
        this.itemsLoading = false;
      }
    },

    async getItemsAnalytics(params: AvitoItemAnalyticsParams): Promise<void> {
      try {
        this.analyticsLoading = true;
        this.analyticsError = null;

        // Fetch analytics data
        const analyticsResponse = await getAvitoItemAnalytics(params);

        this.analyticsData = analyticsResponse.data?.groupings;
        return analyticsResponse.data;
      } catch (error) {
        console.error('Error fetching analytics:', error);
        this.analyticsError = 'Failed to fetch analytics data';
      } finally {
        this.analyticsLoading = false;
      }
    },
    setItemsLoading(loading: boolean): void {
      this.itemsLoading = loading;
    },
  },
});
