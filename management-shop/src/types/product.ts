export interface Category {
  _id: string;
  name: string;
  icon: string;
  type: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  type: string;
  category: string;
  attributes: SubcategoryAttribute[];
}

export interface SubcategoryAttribute {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  options?: string[]; // For select type attributes
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  type: 'size' | 'color' | 'material' | 'style';
  value: string;
  price: number;
  stock: number;
  images?: File[];
  parentColor?: string; // For size variants, reference to their parent color
}

export interface CreateProductData {
  title: string;
  status: 'active' | 'inactive';
  price: number;
  stock: number;
  description: string;
  soldCount: number;
  brand: string;
  origin: string;
  hasVariant: boolean;
  shopId: string;
  categoryId: string;
  subcategoryId: string;
  attributes: Record<string, string | number | boolean>; // Dynamic attributes based on subcategory
  variants?: ProductVariant[];
}
