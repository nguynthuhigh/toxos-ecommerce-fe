import { useQuery } from '@tanstack/react-query';
import { getCategories, getSubcategories, getSubcategoryDetails } from '../services/category';
import type { Category, Subcategory } from '../types/product';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useSubcategories = (categoryId: string | undefined) => {
  return useQuery<Subcategory[], Error>({
    queryKey: ['subcategories', categoryId],
    queryFn: () => getSubcategories(categoryId!),
    enabled: !!categoryId,
  });
};

export const useSubcategoryDetails = (subcategoryId: string | undefined) => {
  return useQuery<Subcategory, Error>({
    queryKey: ['subcategory', subcategoryId],
    queryFn: () => getSubcategoryDetails(subcategoryId!),
    enabled: !!subcategoryId,
  });
};
