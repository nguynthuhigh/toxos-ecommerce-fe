import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api"; // You'll need to implement this
import ShopInfo from "@/components/shop/shop-info";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        {/* Product Gallery */}
        <ProductGallery images={[product.thumbnail, ...product.images]} />

        {/* Product Info */}
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
    </div>
  );
}
