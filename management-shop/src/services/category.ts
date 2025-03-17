import type { Category, Subcategory } from '../types/product';
import { mockCategories, mockSubcategories } from './mockData';

export const getCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories;
};

export const getSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSubcategories[categoryId] || [];
};

export const getSubcategoryDetails = async (subcategoryId: string): Promise<Subcategory> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  for (const categorySubcategories of Object.values(mockSubcategories)) {
    const subcategory = categorySubcategories.find(sub => sub._id === subcategoryId);
    if (subcategory) {
      return subcategory;
    }
  }
  
  throw new Error('Subcategory not found');
};
