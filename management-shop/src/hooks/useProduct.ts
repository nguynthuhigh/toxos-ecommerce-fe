import { useMutation } from '@tanstack/react-query';
import { productApi } from '../services/product';
import { useNavigate } from 'react-router-dom';

export const useProduct = () => {
  const navigate = useNavigate();

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => productApi.createProduct(formData),
    onSuccess: () => {
      navigate('/products');
    },
  });

  return {
    createProduct: createProductMutation.mutate,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
  };
};
