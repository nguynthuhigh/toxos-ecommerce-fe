interface Option {
  name: string;
  stock: number;
  sku: string;
  price: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  name: string;
  image: string;
  price: number;
  stock: number;
  hasOption: boolean;
  options: Option[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  stock: number;
  description: string;
  thumbnail: string;
  images: string[];
  soldCount: number;
  brand: string;
  origin: string;
  hasVariant: boolean;
  shopId: string;
  rating: number;
  ratingCount: number;
  originalPrice: number;
  category: { name: string };
  subcategory: { name: string };
  attributes: Record<string, string>;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.log(slug);
  // try {
  //   const response = await fetch(`${API_URL}/products/${slug}`);

  //   if (!response.ok) {
  //     if (response.status === 404) {
  //       return null;
  //     }
  //     throw new Error("Failed to fetch product");
  //   }

  //   const product = await response.json();
  //   return product;
  // } catch (error) {
  //   console.error("Error fetching product:", error);
  //   return null;
  // }
  return {
    _id: "67c6a2192b206e19a4b0b509",
    title: "Nike Air Max",
    slug: "nike-air-max",
    status: "active",
    price: 100,
    stock: 50,
    description: "Best running shoes",
    thumbnail: "/products/ex_prod.png",
    images: [
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
      "/products/ex_prod.png",
    ],
    soldCount: 0,
    brand: "Nike",
    origin: "VietNam",
    hasVariant: true,
    shopId: "123",
    category: { name: "mens-fashion" },
    subcategory: { name: "pants" },
    attributes: { style: "boxy" },
    rating: 4.5,
    ratingCount: 100,
    originalPrice: 110,
    variants: [
      {
        name: "Màu đen",
        image: "/products/ex_prod.png",
        price: 110,
        stock: 20,
        hasOption: true,
        options: [
          {
            name: "Size 40",
            stock: 20,
            sku: "SKU40",
            price: 100,
            _id: "67c6a2192b206e19a4b0b506",
            createdAt: "2025-03-04T06:47:53.711Z",
            updatedAt: "2025-03-04T06:47:53.711Z",
          },
          {
            name: "Size 42",
            stock: 10,
            sku: "SKU42",
            price: 110,
            _id: "67c6a2192b206e19a4b0b507",
            createdAt: "2025-03-04T06:47:53.711Z",
            updatedAt: "2025-03-04T06:47:53.711Z",
          },
        ],
        _id: "67c6a2192b206e19a4b0b508",
        createdAt: "2025-03-04T06:47:53.711Z",
        updatedAt: "2025-03-04T06:47:53.711Z",
      },
    ],
    createdAt: "2025-03-04T06:47:53.712Z",
    updatedAt: "2025-03-04T06:47:53.712Z",
  };
}
