import axiosInstance from "../lib/axios";

interface LoginCredentials {
  email: string;
  password: string;
  type: "email";
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterShopData {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  logo: string | File;
}

export interface Product {
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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  registerShop: async (formData: FormData) => {
    const response = await axiosInstance.post("/auth/shop/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
