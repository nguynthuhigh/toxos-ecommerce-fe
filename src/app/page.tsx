import { CategoriesBoard } from "@/components/home/categories-board";
import { BannerSection } from "@/components/home/banner-section";
import { ProductCard } from "@/components/product/product-card";

const products = [
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
  {
    id: "headphones-1",
    title: "Quần whose",
    price: 199000,
    image: "/products/ex_prod.png",
    soldCount: 1250,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <CategoriesBoard />

      <BannerSection />

      <div className="flex-1 p-4 md:p-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <h2 className="text-xl font-semibold mb-6">Sản Phẩm Nổi Bật</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                soldCount={product.soldCount}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
