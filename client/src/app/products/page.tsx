"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";

// Mock data - replace with actual API data
const mockProducts = [
  {
    id: "1",
    name: "Quần Áo Thu Đông Nam SS FASHION",
    price: 245000,
    originalPrice: 350000,
    discount: 30,
    image: "/products/ex_prod.png",
    colors: ["Xám", "Đen"],
    sizes: ["M", "L", "XL"],
    rating: 4.9,
    sold: 61,
  },
  {
    id: "2",
    name: "Bộ Quần Áo Nam Thu Đông SS",
    price: 639000,
    originalPrice: 1278000,
    discount: 50,
    image: "/products/ex_prod.png",
    colors: ["Xanh", "Đen"],
    sizes: ["L", "XL"],
    rating: 4.8,
    sold: 45,
  },
  {
    id: "3",
    name: "Bộ Quần Áo Nam Dài Tay Thu Đông",
    price: 462500,
    originalPrice: 785000,
    discount: 41,
    image: "/products/ex_prod.png",
    colors: ["Đen", "Xanh"],
    sizes: ["M", "L"],
    rating: 4.7,
    sold: 38,
  },
];

const sortOptions = [
  { label: "Phổ biến", value: "popular" },
  { label: "Mới nhất", value: "newest" },
  { label: "Bán chạy", value: "bestseller" },
  { label: "Giá: Thấp đến Cao", value: "price_asc" },
  { label: "Giá: Cao đến Thấp", value: "price_desc" },
];

const colors = [
  { label: "Xanh", value: "Xanh" },
  { label: "Đen", value: "Đen" },
  { label: "Xám", value: "Xám" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductsPage() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = mockProducts.filter((product) => {
    // Filter by color
    if (selectedColors.length > 0) {
      if (!product.colors.some((color) => selectedColors.includes(color))) {
        return false;
      }
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      if (!product.sizes.some((size) => selectedSizes.includes(size))) {
        return false;
      }
    }

    // Filter by price
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        return parseInt(b.id) - parseInt(a.id);
      case "bestseller":
        return b.sold - a.sold;
      default:
        return b.rating - a.rating;
    }
  });

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <Container className="py-10">
      <div className="grid grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="p-4 h-fit">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Màu sắc</h3>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div
                    key={color.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`color-${color.value}`}
                      checked={selectedColors.includes(color.value)}
                      onCheckedChange={() => handleColorToggle(color.value)}
                    />
                    <label
                      htmlFor={`color-${color.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Kích thước</h3>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleSizeToggle(size)}
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Khoảng giá</h3>
              <Slider
                defaultValue={[0, 2000000]}
                max={2000000}
                step={50000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()}đ</span>
                <span>{priceRange[1].toLocaleString()}đ</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setSelectedColors([]);
                setSelectedSizes([]);
                setPriceRange([0, 2000000]);
              }}
              variant="outline"
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredProducts.length} sản phẩm
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Không tìm thấy sản phẩm phù hợp với bộ lọc
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
