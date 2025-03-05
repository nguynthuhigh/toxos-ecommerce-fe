"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { QuantitySelector } from "./quantity-selector";

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
  stock: number;
  brand: string;
  origin: string;
  category: { name: string };
  subcategory: { name: string };
  attributes: Record<string, string>;
  hasVariant: boolean;
  variants: Variant[];
  soldCount: number;
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-xl font-semibold text-orange-500">
          ₫{formatPrice(currentPrice)}
        </p>
      </div>

      {product.hasVariant && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{product.variants[0].name}</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => {
                    setSelectedVariant(variant._id);
                    setSelectedOption(
                      variant.hasOption ? variant.options[0]._id : null
                    );
                  }}
                  className={`relative rounded border p-2 ${
                    selectedVariant === variant._id
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                >
                  {variant.image && (
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="h-12 w-12 object-cover"
                    />
                  )}
                  <span className="mt-1 block text-xs">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Variant Options */}
          {currentVariant?.hasOption && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentVariant.options.map((option) => (
                  <button
                    key={option._id}
                    onClick={() => setSelectedOption(option._id)}
                    disabled={option.stock === 0}
                    className={`rounded border px-3 py-2 text-sm ${
                      selectedOption === option._id
                        ? "border-orange-500 bg-orange-50"
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
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Brand:</span>
          <span className="font-medium">{product.brand}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Origin:</span>
          <span className="font-medium">{product.origin}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Sold:</span>
          <span className="font-medium">{product.soldCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Stock:</span>
          <span className="font-medium">{currentStock}</span>
        </div>
      </div>
      <QuantitySelector onQuantityChange={() => {}} />
      <Button className="w-full" size="lg">
        Add to Cart
      </Button>

      {relevantAttributes.length > 0 && (
        <div className="rounded-lg border bg-gray-50 p-4 space-y-4">
          <h3 className="font-medium">Product Specifications</h3>
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
