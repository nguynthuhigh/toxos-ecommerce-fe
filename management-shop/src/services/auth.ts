import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RegisterShopData {
  name: string;
  logo: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
}

const API_URL = 'http://localhost';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },
  
  registerShop: async (shopData: RegisterShopData): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/shop/register`, shopData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
