import axios from 'axios';

const API_URL = 'http://localhost';

export const productApi = {
  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/product/public`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
