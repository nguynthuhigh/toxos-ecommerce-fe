import { ProductCard } from "@/components/product/product-card";

// Mock data for demonstration
const products = [
  {
    id: "1",
    title: "Kẹp Tóc Bên Hình Chữ a Phong Cách Hàn Quốc",
    price: 6048,
    image: "/products/hairclip.jpg",
    soldCount: 94800,
  },
  {
    id: "2",
    title: "Áo Thun Nữ Form Rộng",
    price: 35000,
    image: "/products/tshirt.jpg",
    soldCount: 12500,
  },
  {
    id: "3",
    title: "Túi Xách Nữ Mini",
    price: 89000,
    image: "/products/bag.jpg",
    soldCount: 5600,
  },
  {
    id: "4",
    title: "Giày Sneaker Thể Thao",
    price: 299000,
    image: "/products/shoes.jpg",
    soldCount: 2300,
  },
  {
    id: "5",
    title: "Đồng Hồ Thông Minh",
    price: 450000,
    image: "/products/watch.jpg",
    soldCount: 1800,
  },
  {
    id: "6",
    title: "Tai Nghe Bluetooth",
    price: 199000,
    image: "/products/headphones.jpg",
    soldCount: 3400,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h2 className="mb-6 text-2xl font-bold">Popular Products</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
}
