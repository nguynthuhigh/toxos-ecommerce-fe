import axios from 'axios';

export interface ShopDashboardData {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    soldCount: number;
  }>;
}

const API_URL = 'http://localhost';

export const shopApi = {
  getDashboardData: async (): Promise<ShopDashboardData> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/product/shop/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
