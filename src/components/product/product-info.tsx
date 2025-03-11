"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { QuantitySelector } from "./quantity-selector";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

interface Option {
  name: string;
  stock: number;
  sku: string;
  price: number;
  _id: string;
}

interface Variant {
  name: string;
  image: string;
  price: number;
  stock: number;
  hasOption: boolean;
  options: Option[];
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice: number;
  stock: number;
  brand: string;
  origin: string;
  category: { name: string };
  subcategory: { name: string };
  attributes: Record<string, string>;
  hasVariant: boolean;
  variants: Variant[];
  soldCount: number;
  rating: number;
  ratingCount: number;
}

interface ProductInfoProps {
  product: Product;
}

const attributeConfigs: Record<string, Record<string, string[]>> = {
  "mens-fashion": {
    pants: ["style", "material", "fit"],
    shirts: ["style", "sleeve", "collar"],
  },
  "womens-fashion": {
    dresses: ["style", "length", "neckline"],
  },
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.hasVariant ? product.variants[0]._id : null
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(
    product.hasVariant && product.variants[0].hasOption
      ? product.variants[0].options[0]._id
      : null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartPosition, setAnimationStartPosition] = useState({
    x: 0,
    y: 0,
  });

  const relevantAttributes =
    attributeConfigs[product.category.name]?.[product.subcategory.name] || [];

  const currentVariant = product.variants.find(
    (v) => v._id === selectedVariant
  );
  const currentOption = currentVariant?.options.find(
    (o) => o._id === selectedOption
  );

  const currentPrice =
    currentOption?.price || currentVariant?.price || product.price;
  const currentStock =
    currentOption?.stock || currentVariant?.stock || product.stock;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get button position
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Set starting position at the center of the button
    setAnimationStartPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="space-y-4 relative">
      {isAnimating && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: animationStartPosition.x - 8,
            top: animationStartPosition.y - 8,
          }}
        >
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-fly-to-cart" />
        </div>
      )}

      {/* <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded">
            FLASH SALE
          </div>
          <div className="text-blue-500 font-medium">
            KẾT THÚC TRONG 00:42:5H
          </div>
        </div>
      </div> */}

      <div className="space-y-2">
        <h1 className="text-xl font-medium leading-relaxed">{product.title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-blue-500 font-medium">{product.rating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= product.rating
                      ? "fill-blue-500 text-blue-500"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-gray-500">
            <span>{product.ratingCount} Đánh Giá</span>
          </div>
          <div className="text-gray-500">
            <span>{product.soldCount} Đã Bán</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 line-through">
            ₫{formatPrice(product.originalPrice)}
          </span>
          <span className="text-3xl font-bold text-blue-500">
            ₫{formatPrice(currentPrice)}
          </span>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            -33% GIẢM
          </span>
        </div>
      </div>

      {/* Variants */}
      {product.hasVariant && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <span className="w-28 text-gray-500">Màu Sắc</span>
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={(e) => {
                        setSelectedVariant(variant._id);
                        setSelectedOption(
                          variant.hasOption ? variant.options[0]._id : null
                        );
                        handleAddToCart(e);
                      }}
                      className={`relative rounded border p-2 ${
                        selectedVariant === variant._id
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      {variant.image && (
                        <Image
                          src={variant.image}
                          alt={variant.name}
                          className="h-12 w-12 object-cover"
                          width={48}
                          height={48}
                        />
                      )}
                      <span className="mt-1 block text-xs">{variant.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {currentVariant?.hasOption && (
            <div className="flex">
              <span className="w-28 text-gray-500">Kích Thước</span>
              <div className="flex-1">
                <div className="grid grid-cols-6 gap-2">
                  {currentVariant.options.map((option) => (
                    <button
                      key={option._id}
                      onClick={(e) => {
                        setSelectedOption(option._id);
                        handleAddToCart(e);
                      }}
                      disabled={option.stock === 0}
                      className={`rounded border px-3 py-2 text-sm ${
                        selectedOption === option._id
                          ? "border-blue-500 bg-blue-50"
                          : option.stock === 0
                          ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                          : "border-gray-200"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center">
        <span className="w-28 text-gray-500">Số Lượng</span>
        <div className="flex-1">
          <QuantitySelector onQuantityChange={() => {}} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 relative"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm Vào Giỏ Hàng
        </Button>
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
          Mua Ngay
        </Button>
      </div>

      {/* Additional Info */}
      <div className="border-t pt-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Thương hiệu:</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Xuất xứ:</span>
            <span className="font-medium">{product.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Kho:</span>
            <span className="font-medium">{currentStock}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Gửi từ:</span>
            <span className="font-medium">Hà Nội</span>
          </div>
        </div>
      </div>

      {relevantAttributes.length > 0 && (
        <div className="rounded-lg border bg-gray-50 p-4 space-y-4">
          <h3 className="font-medium">Thông số kỹ thuật</h3>
          {relevantAttributes.map(
            (attr) =>
              product.attributes[attr] && (
                <div key={attr} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{attr}</span>
                  <span className="font-medium">
                    {product.attributes[attr]}
                  </span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
