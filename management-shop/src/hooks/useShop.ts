import { useMutation } from '@tanstack/react-query';
import { authApi, RegisterShopData } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export const useShop = () => {
  const navigate = useNavigate();

  const registerShopMutation = useMutation<any, Error, RegisterShopData>({
    mutationFn: (data: RegisterShopData) => authApi.registerShop(data),
    onSuccess: () => {
      navigate('/dashboard');
    },
  });

  return {
    registerShop: registerShopMutation.mutate,
    isLoading: registerShopMutation.isPending,
    error: registerShopMutation.error,
  };
};
