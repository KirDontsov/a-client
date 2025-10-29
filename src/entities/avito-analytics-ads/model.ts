import { defineStore } from 'pinia';
import { getAvitoAnalyticsAds, getAvitoAnalyticsAdsWithPagination, getAvitoRequests } from '@/shared/api/avito';

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
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  currentAdsPage: number;
  adsItemsPerPage: number;
  totalAdsItems: number;
  totalAdsPages: number;
}

export const useAvitoAnalyticsAdsStore = defineStore('avito-analytics-ads', {
  state: (): AvitoAnalyticsAdsState => ({
    ads: [],
    requests: [],
    loading: false,
    error: null,
    avitoRequestId: null,
    selectedRequestId: null,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    currentAdsPage: 1,
    adsItemsPerPage: 10,
    totalAdsItems: 0,
    totalAdsPages: 0,
  }),

  actions: {
    async fetchAdsData(requestId: string, page: number = 1, limit: number = 10): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.avitoRequestId = requestId;
        this.currentAdsPage = page;
        this.adsItemsPerPage = limit;

        const response = await getAvitoAnalyticsAdsWithPagination(requestId, page, limit);

        if (response.ok) {
          const result = await response.json();
          // Handle the response format: { status: 'success', data: { ads: [...], ads_count: number } }
          if (result && result.data && Array.isArray(result.data.ads)) {
            this.ads = result.data.ads;
            this.totalAdsItems = result.data.ads_count || result.data.ads.length;
            this.totalAdsPages = Math.ceil(this.totalAdsItems / this.adsItemsPerPage);
          } else {
            this.ads = Array.isArray(result) ? result : [result];
            this.totalAdsItems = Array.isArray(result) ? result.length : 1;
            this.totalAdsPages = Math.ceil(this.totalAdsItems / this.adsItemsPerPage);
          }
        } else {
          this.error = 'Failed to fetch analytics ads data';
          this.ads = [];
          this.totalAdsItems = 0;
          this.totalAdsPages = 0;
        }
      } catch (error) {
        console.error('Error fetching analytics ads:', error);
        this.error = 'An error occurred while fetching analytics ads data';
        this.ads = [];
        this.totalAdsItems = 0;
        this.totalAdsPages = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchRequests(page: number = 1, limit: number = 10): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.currentPage = page;
        this.itemsPerPage = limit;

        const response = await getAvitoRequests(page, limit);

        if (response.ok) {
          const result = await response.json();
          // Handle the response format: { status: 'success', data: { avito_requests: [...], avito_requests_count: number } }
          if (result && result.data && Array.isArray(result.data.avito_requests)) {
            this.requests = result.data.avito_requests;
            this.totalItems = result.data.avito_requests_count || result.data.avito_requests.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          } else {
            this.requests = Array.isArray(result) ? result : [result];
            this.totalItems = Array.isArray(result) ? result.length : 1;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          }
        } else {
          this.error = 'Failed to fetch avito requests data';
          this.requests = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching avito requests:', error);
        this.error = 'An error occurred while fetching avito requests data';
        this.requests = [];
        this.totalItems = 0;
        this.totalPages = 0;
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

    setCurrentPage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    setItemsPerPage(itemsPerPage: number): void {
      this.itemsPerPage = itemsPerPage;
      // Reset to first page when changing items per page
      this.currentPage = 1;
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

  setCurrentAdsPage(page: number): void {
    if (page >= 1 && page <= this.totalAdsPages) {
      this.currentAdsPage = page;
    }
  },

  setAdsItemsPerPage(itemsPerPage: number): void {
    this.adsItemsPerPage = itemsPerPage;
    // Reset to first page when changing items per page
    this.currentAdsPage = 1;
  },
});
