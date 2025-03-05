import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api";
import ShopInfo from "@/components/shop/shop-info";
import { Container } from "@/components/ui/container";

export type ParamsType = { slug: string };

export default async function ProductPage({ params }: { params: ParamsType }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  return (
    <Container className="py-10">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <ProductGallery images={[product.thumbnail, ...product.images]} />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductInfo product={product} />
        </div>
      </div>

      <Separator className="my-10" />

      <ShopInfo />

      <Separator className="my-10" />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Product Description</h3>
        <div className="prose max-w-none">{product.description}</div>
      </div>
    </Container>
  );
}
