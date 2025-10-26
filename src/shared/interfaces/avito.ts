export interface AvitoTokenParams {
  avito_token: string;
  page?: number;
}

export interface AvitoGetItemsResponse {
  meta: AvitoMeta;
  resources: AvitoItem[];
}

export interface AvitoMeta {
  page: number;
  per_page: number;
  total_items?: number;
}

export interface AvitoItem {
  address: string;
  category: AvitoCategory;
  id: string;
  price: number;
  status: string;
  title: string;
  url: string;
}

export interface AvitoItemWithAnalytics {
  address: String;
  category: AvitoCategory;
  id: number;
  price: number;
  status: String;
  title: String;
  url: String;
}

export interface AvitoItemAnalytics {
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

export interface AvitoCategory {
  id: number;
  name: String;
}

export interface AvitoItemAnalyticsParams extends AvitoTokenParams {
  avito_token: string;
  account_id: string;
  dateFrom: string;
  dateTo: string;
  grouping: string;
  limit: number;
  metrics: string[];
  offset: number;
}

// Define the Category interface
interface Category {
  name: string;
  slug: string;
  nested?: Category[];
}

// Define the store state interface
export interface AvitoCategoriesState {
  categories: Category[] | null;
  categoriesLoading: boolean;
  selectedCategories: Category[];
  selectedFinalCategory: string | null;
}

export interface AvitoCategoryFieldsParams {
  avito_token: string;
  avito_slug: string;
}

// types/avito.ts
export interface AvitoTokenParams {
  avito_token: string;
  avito_slug?: string;
}

export interface AvitoMeta {
  name: string;
  slug: string;
  nested?: AvitoMeta[];
}

export interface AvitoGetCategoriesResponse {
  status: string;
  data: {
    categories: AvitoMeta[];
  };
}

export interface CategoryFieldValue {
  value: string;
  description?: string;
}

export interface CategoryFieldDependency {
  clause: string;
  action: string;
  pairs: Array<{
    source_field_tag: string;
    clause: string;
    values?: string[];
  }>;
}

export interface CategoryFieldWarning {
  title: string;
  content: string;
}

export interface CategoryFieldContent {
  field_type: string;
  data_type: string;
  required: boolean;
  required_by_dependency: boolean;
  values?: CategoryFieldValue[];
  values_link_json?: string;
  values_link_xml?: string;
  is_catalog?: boolean;
  name_in_catalog?: string;
  dependencies?: CategoryFieldDependency[];
  dependencies_text?: string[];
  values_range?: {
    min?: number;
    max?: number;
  };
  default?: CategoryFieldValue;
  warnings?: CategoryFieldWarning[];
}

export interface CategoryFieldChild {
  tag: string;
  label: string;
  descriptions: string;
  feed_format: string[];
  content: CategoryFieldContent[];
}

export interface CategoryField {
  tag: string;
  label: string;
  descriptions: string;
  feed_format: string[];
  content: CategoryFieldContent[];
  children?: CategoryFieldChild[];
}

export interface AvitoGetCategoryFieldsResponse {
  status: string;
  data: {
    node: {
      name: string;
      slug: string;
    };
    fields: CategoryField[];
  };
}

// types/ads.ts
export interface AvitoFieldValue {
  field_value_id: string;
  value: string;
  created_ts: string;
}

export interface AvitoAdField {
  field_id: string;
  tag: string;
  data_type: string;
  field_type: string;
  created_ts: string;
  values: AvitoFieldValue[];
}

export interface AvitoAd {
  ad_id: string;
  avito_ad_id: string;
  parsed_id: string;
  is_active: boolean;
  status: string;
  created_ts: string;
  fields: AvitoAdField[];
}

export interface AvitoFeedAds {
  feed_id: string;
  account_id: string;
  category: string;
  created_ts: string;
  ads: AvitoAd[];
}

export interface AvitoAdsByFeedResponse {
  status: string;
  data: AvitoFeedAds[];
}
