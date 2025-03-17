import { useQuery } from '@tanstack/react-query';
import { shopApi } from '../services/shop';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['shopDashboard'],
    queryFn: () => shopApi.getDashboardData(),
  });
};
