import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CreateProductResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    brand: string;
    origin: string;
    categoryId: string;
    subcategoryId: string;
    shopId: string;
    images: string[];
    variants?: Array<{
      value: string;
      name: string;
      stock: number;
      price: number;
      sku: string;
      image?: string;
    }>;
  };
}

export const useProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<CreateProductResponse>(
        "/product-shop/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  const getProducts = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/product-shop/product/shop");
      return response.data;
    },
  });

  return {
    createProduct,
    getProducts,
    isLoading: createProduct.isPending,
    error: createProduct.error,
  };
};
