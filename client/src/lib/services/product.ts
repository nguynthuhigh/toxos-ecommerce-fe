import { Shop } from "@/interface/product";
import { axiosInstance } from "../axios";

export interface Variant {
  _id: string;
  name: string;
  value: string;
  stock: number;
  price: number;
  sku: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  discount: number;
  stock: number;
  description: string;
  thumbnail: string;
  images: string[];
  soldCount: number;
  brand: string;
  origin: string;
  shop: Shop;
  category: string;
  subcategory: string;
  variantName: string;
  optionName: string;
  attributes: Array<{
    name: string;
    value: string;
  }>;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: {
    total: number;
    totalPage: number;
    page: number;
    products: Product[];
  };
  message: string;
}

export const getProducts = async ({
  pageParam = 1,
  size = 12,
}: {
  pageParam?: number;
  size?: number;
}) => {
  const { data } = await axiosInstance.get<ProductsResponse>(
    `/api/product/product?page=${pageParam}&size=${size}`
  );
  return data;
};

export const getProductBySlug = async (slug: string, variant?: string) => {
  const url = variant
    ? `/api/product/product/details/${slug}?variant=${variant}`
    : `/api/product/product/details/${slug}`;
  const response = await axiosInstance.get(url);
  return response.data;
};
