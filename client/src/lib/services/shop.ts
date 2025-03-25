import { axiosInstance } from "../axios";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  createdAt: string;
  updatedAt: string;
}

export const getShopById = async (shopId: string): Promise<Shop> => {
  const response = await axiosInstance.get(`/api/shop/shop/${shopId}`);
  return response.data;
};
