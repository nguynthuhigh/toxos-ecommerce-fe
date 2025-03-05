"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  title,
  price,
  image,
  quantity,
  variant,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center space-x-4 py-4">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(id)}
        className="h-5 w-5"
      />
      <div className="flex flex-1 items-center space-x-4">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded-md border object-cover"
        />
        <div className="flex-1 space-y-1">
          <h3 className="line-clamp-2 text-sm">{title}</h3>
          {variant && (
            <p className="text-xs text-gray-500">Phân Loại: {variant}</p>
          )}
          <p className="text-sm font-medium text-red-500">
            ₫{formatPrice(price)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              onUpdateQuantity(id, Math.max(1, parseInt(e.target.value) || 1))
            }
            className="h-8 w-16 rounded-md border px-2 text-center text-sm"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600"
          onClick={() => onRemove(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
