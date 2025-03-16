"use client";

import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ShopInfo from "@/components/shop/shop-info";
import { ProductReviewsSummary } from "@/components/product/product-reviews-summary";
import { ProductLoading } from "@/components/ui/loading";
import { getProductBySlug } from "@/lib/services/product";

// Mock review data - you can replace this with real data from your API
const mockReviewData = {
  stats: {
    average: 4.5,
    total: 150,
    distribution: [
      { stars: 5, count: 100, percentage: 66.7 },
      { stars: 4, count: 30, percentage: 20 },
      { stars: 3, count: 15, percentage: 10 },
      { stars: 2, count: 3, percentage: 2 },
      { stars: 1, count: 2, percentage: 1.3 },
    ],
  },
  recentReviews: [
    {
      id: "1",
      rating: 5,
      comment:
        "Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Mình rất hài lòng với chất lượng. Shop tư vấn nhiệt tình, sẽ ủng hộ shop dài dài.",
      images: [
        "/products/review1.jpg",
        "/products/review2.jpg",
        "/products/review3.jpg",
      ],
      userName: "Nguyễn Văn A",
      userAvatar: "/avatars/user1.jpg",
      date: "15/03/2024 15:30",
      variation: "Đen, Size L",
      likes: 12,
      replies: 2,
    },
    {
      id: "2",
      rating: 4,
      comment:
        "Chất lượng sản phẩm tốt, nhưng giao hàng hơi chậm. Sẽ tiếp tục ủng hộ shop.",
      userName: "Trần Thị B",
      userAvatar: "/avatars/user2.jpg",
      date: "14/03/2024",
      variation: "Trắng, Size M",
      likes: 5,
      replies: 0,
    },
  ],
};

export default function ProductPage() {
  const params = useParams();

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", params.slug],
    queryFn: () => getProductBySlug(params.slug as string),
  });

  if (isLoading) {
    return (
      <Container className="py-10">
        <ProductLoading />
      </Container>
    );
  }

  if (!productData?.data) {
    return (
      <Container>
        <div className="flex h-[600px] items-center justify-center">
          <p className="text-lg text-gray-500">Product not found</p>
        </div>
      </Container>
    );
  }

  const product = productData.data;

  return (
    <Container className="py-10">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <ProductGallery
          images={[product.thumbnail, ...(product.images || [])]}
        />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductInfo product={product} />
        </div>
      </div>

      <Separator className="my-10" />

      <ShopInfo shop={product.shop} />

      <Separator className="my-10" />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Mô tả sản phẩm</h3>
        <div className="prose max-w-none">{product.description}</div>
      </div>

      <Separator className="my-10" />

      <ProductReviewsSummary
        productId={product._id}
        stats={mockReviewData.stats}
        recentReviews={mockReviewData.recentReviews}
      />
    </Container>
  );
}
