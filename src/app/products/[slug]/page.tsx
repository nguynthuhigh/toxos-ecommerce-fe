// "use client";

// import { notFound } from "next/navigation";
// import ProductGallery from "@/components/product/product-gallery";
// import ProductInfo from "@/components/product/product-info";
// import { Separator } from "@/components/ui/separator";
// // import { Button } from "@/components/ui/button";
// import { getProductBySlug } from "@/lib/api";
// import ShopInfo from "@/components/shop/shop-info";
// import { Container } from "@/components/ui/container";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Product } from "@/lib/api";
// export default function ProductPage() {
//   const params = useParams();
//   const { slug } = params;
//   const [productData, setProduct] = useState<Product>();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getProductBySlug(slug as string);
//       if (!data) {
//         notFound();
//       }
//       setProduct(data);
//       setIsLoading(false);
//     };
//     fetchData();
//   }, [slug]);

//   if (isLoading || !productData) return <div>Loading...</div>;

//   return (
//     <Container className="py-10">
//       {!isLoading && productData && (
//         <>
//           <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
//             <ProductGallery
//               images={[productData.thumbnail, ...(productData.images || [])]}
//             />
//             <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
//               <ProductInfo product={productData} />
//             </div>
//           </div>

//           <Separator className="my-10" />

//           <ShopInfo />

//           <Separator className="my-10" />

//           <div className="space-y-6">
//             <h3 className="text-lg font-medium">Product Description</h3>
//             <div className="prose max-w-none">{productData?.description}</div>
//           </div>
//         </>
//       )}
//     </Container>
//   );
// }
import { ProductFactory } from "@/components/product/factory/product-factory";
import { ElectronicProductCard } from "@/components/product/factory/electronic-product-card";
import { ClothingProductCard } from "@/components/product/factory/clothing-product-card";
import { FurnitureProductCard } from "@/components/product/factory/furniture-product-card";

const products = [
  ProductFactory.createProduct(
    "electronic",
    "headphones-1",
    "Tai nghe Sony",
    199000,
    "/products/ex_prod.png",
    1250
  ),
  ProductFactory.createProduct(
    "clothing",
    "shirt-1",
    "Áo thun Adidas",
    299000,
    "/products/ex_prod.png",
    500
  ),
  ProductFactory.createProduct(
    "furniture",
    "table-1",
    "Bàn làm việc",
    499000,
    "/products/ex_prod.png",
    300
  ),
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <h2 className="text-xl font-semibold mb-6">Sản Phẩm Nổi Bật</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => {
              if (product instanceof ElectronicProduct) {
                return (
                  <ElectronicProductCard key={product.id} product={product} />
                );
              }
              if (product instanceof ClothingProduct) {
                return (
                  <ClothingProductCard key={product.id} product={product} />
                );
              }
              if (product instanceof FurnitureProduct) {
                return (
                  <FurnitureProductCard key={product.id} product={product} />
                );
              }
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
