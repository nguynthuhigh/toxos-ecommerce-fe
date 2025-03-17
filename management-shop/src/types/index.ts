export interface Product {
  key: string;
  title: string;
  status: string;
  price: number;
  discount: number;
  stock: number;
  thumbnail: string;
  soldCount: number;
  brand: string;
  origin: string;
  variantName: string;
  optionName: string;
  attributes: {
    name: string;
    value: string;
  }[];
  variants: {
    name: string;
    value: string;
    price: number;
    stock: number;
    sku: string;
  }[];
}

export interface Order {
  key: string;
  id: string;
  customer: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  total: number;
  date: string;
}

export interface Rating {
  key: string;
  customer: {
    name: string;
    avatar: string;
  };
  product: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  averageRating: number;
}
