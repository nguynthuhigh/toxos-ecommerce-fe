import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  note: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  productThumbnail: string;
  category: string;
  tags: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  userId: string;
  shop: Shop;
  address: Address;
  totalPrice: string;
  totalShipping: string;
  paymentMethod: string;
  status: string;
  shippingStatus: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: string;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  recentOrders: Order[];
  topProducts: {
    productName: string;
    quantity: number;
    revenue: string;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: string;
  }[];
}

interface OrderResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
}

const fetchOrders = async (
  params: GetOrdersParams = {}
): Promise<OrderResponse> => {
  const { page = 1, limit = 10 } = params;
  const response = await axiosInstance.get(
    `/order-shop/order/shop?page=${page}&limit=${limit}`
  );
  return response.data;
};

const fetchOrder = async (id: string): Promise<Order> => {
  const response = await axiosInstance.get(`/order-shop/order/shop/${id}`);
  return response.data;
};

const updateOrderStatus = async (id: string, status: string) => {
  const response = await axiosInstance.patch(
    `/order-shop/order/shop/${status}/${id}`
  );
  return response.data;
};

const fetchStatistics = async (): Promise<OrderStatistics> => {
  const response = await axiosInstance.get("/order-shop/order/shop/statistics");
  return response.data;
};

export const useOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
  });
};

export const useOrder = (id: string) => {
  const queryClient = useQueryClient();

  const packOrderMutation = useMutation({
    mutationFn: () => updateOrderStatus(id, "packed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: () => updateOrderStatus(id, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  return {
    ...useQuery({
      queryKey: ["order", id],
      queryFn: () => fetchOrder(id),
      enabled: !!id,
    }),
    packOrder: packOrderMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    isPacking: packOrderMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
  };
};

export const useOrderStatistics = () => {
  return useQuery({
    queryKey: ["order-statistics"],
    queryFn: fetchStatistics,
  });
};
