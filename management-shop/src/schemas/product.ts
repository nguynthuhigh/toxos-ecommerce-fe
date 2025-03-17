import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const VariantOptionSchema = z.object({
  value: z.string().optional(),
  name: z.string().optional(),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.number().int().min(0, "Stock must be greater than or equal to 0"),
  sku: z.string().min(1, "SKU is required"),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.number().int().min(0, "Stock must be greater than or equal to 0"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  shopId: z.string(),
  hasVariant: z.boolean(),
  variants: z.array(VariantOptionSchema).optional(),
});

export const ProductImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

export const ProductImagesSchema = z.object({
  productImages: z
    .array(ProductImageSchema)
    .min(1, "At least one product image is required"),
  variantImages: z.array(ProductImageSchema).optional(),
});

export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type ProductImageData = z.infer<typeof ProductImageSchema>;
export type VariantOption = z.infer<typeof VariantOptionSchema>;
