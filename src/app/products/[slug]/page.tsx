"use client";

import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api";
import ShopInfo from "@/components/shop/shop-info";
import { Container } from "@/components/ui/container";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/lib/api";
export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [productData, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getProductBySlug(slug as string);
    if (!data) {
      notFound();
    }
    setProduct(productData);
    setIsLoading(false);
  }, [slug]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <Container className="py-10">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <ProductGallery
          images={[
            productData?.thumbnail as string,
            ...(productData?.images ?? []),
          ]}
        />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductInfo product={productData!} />
        </div>
      </div>

      <Separator className="my-10" />

      <ShopInfo />

      <Separator className="my-10" />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Product Description</h3>
        <div className="prose max-w-none">{productData?.description}</div>
      </div>
    </Container>
  );
}
