"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface QuantitySelectorProps {
  onQuantityChange: (quantity: number) => void;
  initialQuantity?: number;
}

export function QuantitySelector({
  onQuantityChange,
  initialQuantity = 1,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">Quantity:</span>
      <div className="flex items-center">
        <button
          onClick={decreaseQuantity}
          className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex h-10 w-16 items-center justify-center border border-gray-200 bg-white text-center text-base font-medium">
          {quantity}
        </div>
        <button
          onClick={increaseQuantity}
          className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
