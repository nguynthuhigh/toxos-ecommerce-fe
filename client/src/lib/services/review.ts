import { axiosInstance } from "../axios";

export interface Stats {
  average: number;
  total: number;
  distribution: Distribution[];
}

export interface Distribution {
  stars: number;
  count: number;
  percentage: number;
}
export interface ReviewsProduct {
  reviews: Review[];
  page: string;
  limit: number;
  totalPages: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  images: string[];
  userId: string;
  userName: string;
  userAvatar: string;
  variation: string;
  likes: number;
  product: string;
  orderId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

export const getReviewStats = async (productId: string): Promise<Stats> => {
  const response = await axiosInstance.get(
    `/api/review/review/stats/${productId}`
  );
  return response.data;
};
export const getReviewsProduct = async (
  productId: string,
  page: number
): Promise<ReviewsProduct> => {
  const response = await axiosInstance.get(
    `/api/review/review/product/${productId}?page=${page}`
  );
  return response.data;
};

export interface ReviewProducts {
  comment: string;
  rating: number;
  product: string;
  orderId: string;
  shopId: string;
}

export const reviewProducts = async (
  reviews: ReviewProducts[]
): Promise<ReviewsProduct> => {
  const response = await axiosInstance.post(`/review/product`, reviews);
  return response.data;
};
