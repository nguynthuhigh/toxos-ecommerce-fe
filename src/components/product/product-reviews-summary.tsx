"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReviewCard } from "@/components/review/review-card";
import { ProductReviewsDialog } from "./product-reviews-dialog";

interface ProductReviewsSummaryProps {
  productId: string;
  stats: {
    average: number;
    total: number;
    distribution: Array<{
      stars: number;
      count: number;
      percentage: number;
    }>;
  };
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    images?: string[];
    userName: string;
    userAvatar: string;
    date: string;
    variation: string;
    likes: number;
    replies: number;
  }>;
}

export function ProductReviewsSummary({
  productId,
  stats,
  recentReviews,
}: ProductReviewsSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Đánh giá sản phẩm</h3>
        <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
          Xem tất cả
        </Button>
      </div>

      <Card className="p-6">
        {/* Rating Summary */}
        <div className="flex gap-8 border-b pb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.average}/5
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= Math.floor(stats.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {stats.total} đánh giá
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {stats.distribution.map((stat) => (
              <div key={stat.stars} className="flex items-center gap-2 mb-2">
                <div className="w-12 text-sm">{stat.stars} sao</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-500">{stat.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-6 mt-6">
          {recentReviews.slice(0, 2).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {recentReviews.length > 2 && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Xem thêm đánh giá
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Reviews Dialog */}
      <ProductReviewsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        stats={stats}
        reviews={recentReviews}
      />
    </div>
  );
}
