import { defineStore } from 'pinia';
import { getAvitoAnalyticsAds, getAvitoRequests } from '@/shared/api/avito';

export interface AvitoRequest {
  request_id: string;
  user_id: string;
  request: string | null;
  city: string | null;
  coords: string | null;
  radius: string | null;
  district: string | null;
  createdTs: string | null; // DateTime<Utc> as string
}

export interface AvitoAdData {
  ad_id: string;
  my_ad: string;
  run_date: string;
  city_query: string;
  search_query: string;
  position: number;
  views: string;
  views_today: string;
  promotion: string;
  delivery: string;
  ad_date: string;
  avito_ad_id: string;
  title: string;
  price: string;
  link: string;
  categories: string;
  seller_id: string;
  seller_name: string;
  seller_type: string;
  register_date: string;
  answer_time: string;
  rating: string;
  reviews_count: string;
  ads_count: string;
  closed_ads_count: string;
  photo_count: string;
  address: string;
  description: string;
  avito_request_id: string;
  created_ts: string;
  [key: string]: any; // Allow additional properties
}

export interface AvitoAnalyticsAdsState {
  ads: AvitoAdData[];
  requests: AvitoRequest[];
  loading: boolean;
  error: string | null;
  avitoRequestId: string | null;
  selectedRequestId: string | null;
}

export const useAvitoAnalyticsAdsStore = defineStore('avito-analytics-ads', {
  state: (): AvitoAnalyticsAdsState => ({
    ads: [],
    requests: [],
    loading: false,
    error: null,
    avitoRequestId: null,
    selectedRequestId: null,
  }),

  actions: {
    async fetchAdsData(requestId: string): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.avitoRequestId = requestId;

        const response = await getAvitoAnalyticsAds(requestId);

        if (response.ok) {
          const result = await response.json();
          // Handle the response format: { status: 'success', data: { ads: [...] } } or direct array
          if (result && result.data && Array.isArray(result.data.ads)) {
            this.ads = result.data.ads;
          } else {
            this.ads = Array.isArray(result) ? result : [result];
          }
        } else {
          this.error = 'Failed to fetch analytics ads data';
          this.ads = [];
        }
      } catch (error) {
        console.error('Error fetching analytics ads:', error);
        this.error = 'An error occurred while fetching analytics ads data';
        this.ads = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchRequests(): Promise<void> {
      try {
        this.loading = true;
        this.error = null;

        const response = await getAvitoRequests();

        if (response.ok) {
          const result = await response.json();
          // Handle the response format: { status: 'success', data: { avito_requests: [...], avito_requests_count: number } }
          if (result && result.data && Array.isArray(result.data.avito_requests)) {
            this.requests = result.data.avito_requests;
          } else {
            this.requests = Array.isArray(result) ? result : [result];
          }
        } else {
          this.error = 'Failed to fetch avito requests data';
          this.requests = [];
        }
      } catch (error) {
        console.error('Error fetching avito requests:', error);
        this.error = 'An error occurred while fetching avito requests data';
        this.requests = [];
      } finally {
        this.loading = false;
      }
    },

    selectRequest(requestId: string): void {
      this.selectedRequestId = requestId;
    },

    setAds(ads: AvitoAdData[]): void {
      this.ads = ads;
    },

    setRequests(requests: AvitoRequest[]): void {
      this.requests = requests;
    },

    setLoading(loading: boolean): void {
      this.loading = loading;
    },

    setError(error: string | null): void {
      this.error = error;
    },

    clearAds(): void {
      this.ads = [];
      this.error = null;
    },

    clearRequests(): void {
      this.requests = [];
      this.error = null;
    },
  },
});
