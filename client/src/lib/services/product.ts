import { useQuery } from "@tanstack/react-query";
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
  shop: string;
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

export const getProductBySlug = async (slug: string) => {
  const response = await axiosInstance.get(
    `/api/product/product/details/${slug}`
  );
  return response.data;
};

export interface SearchProductsParams {
  keyword?: string;
  sortByPrice?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
}

export async function searchProducts(
  params: SearchProductsParams
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.sortByPrice) searchParams.set("sortByPrice", params.sortByPrice);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
  if (params.rating) searchParams.set("rating", params.rating.toString());
  if (params.page) searchParams.set("page", params.page.toString());

  const response = await axiosInstance.get(
    `/api/product/product/search?${searchParams.toString()}`
  );
  return response.data;
}

export function useSearchProducts(params: SearchProductsParams) {
  return useQuery({
    queryKey: ["products", "search", params],
    queryFn: () => searchProducts(params),
  });
}
