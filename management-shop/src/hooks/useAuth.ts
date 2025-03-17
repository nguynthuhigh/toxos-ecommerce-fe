import { useMutation } from '@tanstack/react-query';
import { authApi, LoginCredentials, LoginResponse } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
