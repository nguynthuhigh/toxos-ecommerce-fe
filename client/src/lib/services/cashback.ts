import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

export interface CashbackTransaction {
  id: string;
  userId: string;
  amount: string;
  type: string;
  orderIds: string[];
  createdAt: string;
}

export interface CashbackResponse {
  data: CashbackTransaction[];
  total: number;
  page: number;
  lastPage: number;
}

export const getCashbackHistory = async (
  page: number,
  size: number
): Promise<CashbackResponse> => {
  const response = await axiosInstance.get(
    `/cashback/get-histories?page=${page}&size=${size}`
  );
  return response.data;
};

export const useGetCashbackHistory = (page: number, size: number) => {
  return useQuery<CashbackResponse>({
    queryKey: ["cashback", page],
    queryFn: () => getCashbackHistory(page, size),
  });
};
