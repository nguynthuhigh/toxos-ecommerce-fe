import axiosInstance from "../lib/axios";
import { Product } from "../types";

export interface getProducts {
  page: number;
  size: number;
  // search: string;
  // category: string;
  // subcategory: string;
  // price: number;
  // price: number;
}

interface GetProductsParams {
  page: number;
  size: number;
}

interface ProductResponse {
  products: Product[];
  total: number;
}

export const productService = {
  createProduct: async (formData: FormData) => {
    const response = await axiosInstance.post(`/product/create`, formData);
    return response.data;
  },
  getProducts: async (params: GetProductsParams): Promise<ProductResponse> => {
    const { page, size } = params;
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(
      `/product-shop/product/shop?page=${page}&size=${size}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // const response = await axios.get(
    //   `${import.meta.env.VITE_API_URL}/product/shop?page=${page}&size=${size}`,
    //   {
    //     withCredentials: true,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    return response.data.data;
  },
  getProductById: async (id: string) => {
    const response = await axiosInstance.get(`/product/shop/${id}`);
    return response.data;
  },
  updateProduct: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`/product/shop/${id}`, formData);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/product/shop/${id}`);
    return response.data;
  },
};
