"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  soldCount: number;
}

export function ProductCard({
  id,
  title,
  price,
  image,
  soldCount,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <div className="group relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg">
        {/* Image container with aspect ratio */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Discount tag can be added here */}
          <div className="absolute left-0 top-0 bg-red-500 px-2 py-1 text-xs text-white">
            -40%
          </div>
        </div>

        {/* Product info */}
        <div className="p-3">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 min-h-[40px] text-sm text-gray-800">
            {title}
          </h3>

          {/* Price */}
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-red-500">
              ₫{formatPrice(price)}
            </span>
          </div>

          {/* Sold count */}
          <div className="text-xs text-gray-500">Đã bán {soldCount}</div>
        </div>
      </div>
    </Link>
  );
}
