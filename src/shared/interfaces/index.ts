export interface CitiesQueryResult {
  status: string;
  data: {
    cities: City[];
    cities_count: number;
  };
}

export interface City {
  city_id: string;
  name: string;
  abbreviation: string;
  coords: string | null;
  order_number: string | null;
  is_active: string;
}

export interface CategoriesQueryResult {
  status: string;
  data: {
    categories: Category[];
    categories_count: number;
  };
}

export interface Category {
  category_id: string;
  name: string;
  abbreviation: string;
  single_name?: string;
  rod_name?: string;
  pred_name?: string;
  vin_name?: string;
  order_number?: string | null;
  is_active: string;
}

export interface Firm {
  firm_id: string;
  url: string;
  name: string;
  address: string;
  site: string;
  default_phone: string;
  default_email: string;
  description: string;
  rating: string;
  reviews_count: string;
  category_id: string;
  city_id: string;
  coords: string;
  title: string;
}

export * from './avito';
