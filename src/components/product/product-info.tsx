"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { QuantitySelector } from "./quantity-selector";
import { Star, ShoppingCart } from "lucide-react";
import { VariantColorSelect } from "./variant-title-select";
import { VariantSizeSelect } from "./variant-value-select";
import { Product } from "@/lib/services/product";
import { useAddToCart } from "@/lib/services/cart";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const hasVariants = product.variants.length > 0;

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartPosition, setAnimationStartPosition] = useState({
    x: 0,
    y: 0,
  });
  const [previousVariant, setPreviousVariant] = useState<string | null>(null);

  const onChangeQuantity = (value: number) => {
    setQuantity(value);
  };

  const handleNameSelect = (name: string | null) => {
    const oldVariant = currentVariant?._id;
    setSelectedName(name);
    setSelectedValue(null);

    if (oldVariant && name === null) {
      setPreviousVariant(oldVariant);
    }
  };

  const handleValueSelect = (value: string | null) => {
    const oldVariant = currentVariant?._id;
    setSelectedValue(value);

    const newVariant = product.variants.find(
      (v) => v.name === selectedName && v.value === value
    );

    if (oldVariant && newVariant && previousVariant) {
      setPreviousVariant(null);
    }
  };

  const uniqueNames = hasVariants
    ? Array.from(new Set(product.variants.map((v) => v.name)))
    : [];
  const allValues = hasVariants
    ? Array.from(new Set(product.variants.map((v) => v.value))).sort(
        (a, b) => Number(a) - Number(b)
      )
    : [];

  const nameAvailability = uniqueNames.map((name) => {
    const hasAvailableVariants = product.variants.some(
      (v) =>
        v.name === name &&
        (!selectedValue || v.value === selectedValue) &&
        v.stock > 0
    );
    return {
      name,
      available: selectedValue ? hasAvailableVariants : true,
    };
  });

  const valueAvailability = allValues.map((value) => {
    const hasAvailableVariants = product.variants.some(
      (v) =>
        v.value === value &&
        (!selectedName || v.name === selectedName) &&
        v.stock > 0
    );
    return {
      value,
      available: selectedName ? hasAvailableVariants : true,
    };
  });

  const currentVariant = product.variants.find(
    (v) => v.name === selectedName && v.value === selectedValue
  );

  const currentPrice = currentVariant?.price || product.price;
  const currentStock = currentVariant?.stock || product.stock || 0;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasVariants && !currentVariant) {
      toast.error("Please select color and size");
      return;
    }

    const cartData = {
      productId: product._id,
      quantity: quantity,
      shopId: product.shop._id,
      ...(currentVariant && { variantId: currentVariant._id }),
    };

    addToCart(cartData, {
      onSuccess: () => {
        toast.success("Added to cart successfully");
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        setAnimationStartPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      },
    });
  };

  const handleBuyNow = () => {
    if (hasVariants && !currentVariant) {
      alert("Please select color and size");
      return;
    }

    const purchaseData = {
      products: [
        {
          _id: product._id,
          title: product.title,
          price: currentPrice,
          quantity: quantity,
          thumbnail: product.thumbnail,
          hasVariants: hasVariants,
          ...(hasVariants && currentVariant
            ? {
                variantId: currentVariant._id,
                variantName: currentVariant.name,
                variantValue: currentVariant.value,
              }
            : {}),
        },
      ],
    };

    const queryString = encodeURIComponent(JSON.stringify(purchaseData));
    window.location.href = `/order?data=${queryString}`;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 leading-relaxed">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-blue-500 font-medium">{0}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    // star <= product.rating
                    star <= 0
                      ? "fill-blue-500 text-blue-500"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-gray-500">
            {/* {/* <span>{product.ratingCount} Đánh Giá</span> */}
            <span>{0} Đánh Giá</span>
          </div>
          <div className="text-gray-500">
            <span>{product.soldCount} Đã Bán</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 line-through">
            ₫{formatPrice(product.price)}
          </span>
          <span className="text-3xl font-bold text-blue-500">
            ₫
            {formatPrice(
              product.price - (product.price * product.discount) / 100
            )}
          </span>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            -{product.discount || 0}% GIẢM
          </span>
        </div>
      </div>

      {hasVariants ? (
        <div className="space-y-6 py-2">
          <VariantColorSelect
            names={nameAvailability}
            selectedName={selectedName || ""}
            onSelect={handleNameSelect}
            title={product.variantName}
          />

          <VariantSizeSelect
            values={valueAvailability}
            selectedValue={selectedValue}
            onSelect={handleValueSelect}
            title={product.optionName}
          />
          <div className="text-sm text-gray-500">
            {currentStock > 0 ? (
              <span>Còn {currentStock} sản phẩm</span>
            ) : (
              <span className="text-red-500">Hết hàng</span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          <span>Còn {product.stock || 0} sản phẩm</span>
        </div>
      )}

      <div className="flex items-center">
        <span className="w-28 text-gray-500">Số Lượng</span>
        <div className="flex-1">
          <QuantitySelector
            max={currentStock}
            initialQuantity={quantity}
            onQuantityChange={onChangeQuantity}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-500"
          onClick={handleAddToCart}
          disabled={
            isAddingToCart ||
            (hasVariants
              ? !currentVariant || currentStock <= 0
              : (product.stock || 0) <= 0)
          }
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isAddingToCart ? "Adding..." : "Thêm Vào Giỏ Hàng"}
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={
            hasVariants
              ? !currentVariant || currentStock <= 0
              : (product.stock || 0) <= 0
          }
        >
          Mua Ngay
        </Button>
      </div>

      <div className="border-t pt-6 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Thương hiệu:</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Xuất xứ:</span>
            <span className="font-medium">{product.origin}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
