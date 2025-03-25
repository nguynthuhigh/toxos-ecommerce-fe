import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface ApiError {
  message: string;
  status: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
  shopId: string;
}

export interface UpdateVariantData {
  productId: string;
  quantity: string;
  oldVariantId: string;
  newVariantId: string;
  shopId: string;
}

export interface UpdateQuantityData {
  productId: string;
  quantity: number;
  shopId: string;
}

export interface RemoveItemData {
  productId: string;
  variantId: string;
  shopId: string;
}

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  variantId?: string;
  category?: string;
  variant?: {
    name: string;
    value: string;
    price: number;
  };
  variants?: Array<{
    _id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
    sku: string;
  }>;
  hasVariant?: boolean;
  variantName?: string;
  optionName?: string;
}

export interface CartShop {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  userId: string;
  products: CartItem[];
}

interface MutationContext {
  previousCart: CartShop[] | undefined;
}

// API functions
const cartApi = {
  addToCart: (data: AddToCartData) =>
    axiosInstance.post<void>("/cart/add-to-cart", data),

  getCart: () => axiosInstance.get<CartShop[]>("/cart/get-cart"),

  updateVariant: (data: UpdateVariantData) =>
    axiosInstance.patch<void>("/cart/update-item", data),

  updateQuantity: (data: UpdateQuantityData) =>
    axiosInstance.put<void>("/cart/update-quantity", data),

  removeItem: (data: RemoveItemData) =>
    axiosInstance.post<void>("/cart/remove-item", data),
};

export function useCart() {
  return useQuery<CartShop[], AxiosError<ApiError>>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await cartApi.getCart();
      return data;
    },
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    AddToCartData,
    MutationContext
  >({
    mutationFn: async (data) => {
      const response = await cartApi.addToCart(data);
      return response.data;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartShop[]>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<CartShop[]>(["cart"], (old) => {
          if (!old) return old;
          const shopIndex = old.findIndex((shop) => shop.id === newItem.shopId);

          if (shopIndex === -1) return old;

          const updatedCart = [...old];
          const shop = { ...updatedCart[shopIndex] };

          const existingProduct = shop.products.find(
            (product) =>
              product._id === newItem.productId &&
              product.variantId === newItem.variantId
          );

          if (existingProduct) {
            shop.products = shop.products.map((product) => {
              if (
                product._id === newItem.productId &&
                product.variantId === newItem.variantId
              ) {
                return {
                  ...product,
                  quantity: newItem.quantity,
                };
              }
              return product;
            });
          } else {
            shop.products = [
              ...shop.products,
              {
                _id: newItem.productId,
                quantity: newItem.quantity,
                variantId: newItem.variantId,
                title: "",
                price: 0,
                thumbnail: "",
                category: "",
                variants: [],
              } as CartItem,
            ];
          }

          updatedCart[shopIndex] = shop;
          return updatedCart;
        });
      }

      return { previousCart };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Thêm vào giỏ hàng thành công");
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    UpdateVariantData,
    MutationContext
  >({
    mutationFn: async (data) => {
      const response = await cartApi.updateVariant(data);
      return response.data;
    },
    onMutate: async (newVariant) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartShop[]>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<CartShop[]>(["cart"], (old) => {
          if (!old) return old;
          const shopIndex = old.findIndex(
            (shop) => shop.id === newVariant.shopId
          );

          if (shopIndex === -1) return old;

          const updatedCart = [...old];
          const shop = { ...updatedCart[shopIndex] };

          shop.products = shop.products.map((product) => {
            if (
              product._id === newVariant.productId &&
              product.variantId === newVariant.oldVariantId
            ) {
              const newVariantData = product.variants?.find(
                (v) => v._id === newVariant.newVariantId
              );
              return {
                ...product,
                variantId: newVariant.newVariantId,
                quantity: parseInt(newVariant.quantity),
                price: newVariantData?.price || product.price,
                variant: newVariantData
                  ? {
                      name: newVariantData.name,
                      value: newVariantData.value,
                      price: newVariantData.price,
                    }
                  : undefined,
              };
            }
            return product;
          });

          updatedCart[shopIndex] = shop;
          return updatedCart;
        });
      }

      return { previousCart };
    },
    onError: (err, newVariant, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(err.response?.data?.message || "Failed to update variant");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Variant updated successfully");
    },
  });
}

export function useUpdateQuantity() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    UpdateQuantityData,
    MutationContext
  >({
    mutationFn: async (data) => {
      const response = await cartApi.updateQuantity(data);
      return response.data;
    },
    onMutate: async (newQuantity) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartShop[]>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<CartShop[]>(["cart"], (old) => {
          if (!old) return old;
          const shopIndex = old.findIndex(
            (shop) => shop.id === newQuantity.shopId
          );

          if (shopIndex === -1) return old;

          const updatedCart = [...old];
          const shop = { ...updatedCart[shopIndex] };

          shop.products = shop.products.map((product) => {
            if (product._id === newQuantity.productId) {
              return {
                ...product,
                quantity: newQuantity.quantity,
              };
            }
            return product;
          });

          updatedCart[shopIndex] = shop;
          return updatedCart;
        });
      }

      return { previousCart };
    },
    onError: (err, newQuantity, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(err.response?.data?.message || "Failed to update quantity");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Quantity updated successfully");
    },
  });
}

export function useRemoveItem() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    RemoveItemData,
    MutationContext
  >({
    mutationFn: async (data) => {
      const response = await cartApi.removeItem(data);
      return response.data;
    },
    onMutate: async (removedItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartShop[]>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData<CartShop[]>(["cart"], (old) => {
          if (!old) return old;
          const updatedCart = old
            .map((shop) => {
              if (shop.id === removedItem.shopId) {
                return {
                  ...shop,
                  products: shop.products.filter(
                    (product) =>
                      product._id !== removedItem.productId ||
                      product.variantId !== removedItem.variantId
                  ),
                };
              }
              return shop;
            })
            .filter((shop) => shop.products.length > 0);
          return updatedCart;
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(err.response?.data?.message || "Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed successfully");
    },
  });
}
