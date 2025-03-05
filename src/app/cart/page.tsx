"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StoreSection } from "@/components/cart/store-section";
import CartFooter from "@/components/cart/cart-footer";
interface Item {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant: string;
}

export interface CartData {
  id: string;
  name: string;
  items: Item[];
}
const cartData = [
  {
    id: "store1",
    name: "Coolmate - Official Store",
    items: [
      {
        id: "item1",
        title: "Combo 3 quần lót nam đăng Tru nk Bamboo kháng khuẩn Cool Mate",
        price: 199000,
        image: "/products/ex_prod.png",
        quantity: 2,
        variant: "ĐEN, M",
      },
    ],
  },
  {
    id: "store2",
    name: "SenBenBao.vn",
    items: [
      {
        id: "item2",
        title:
          "Tai nghe bluetooth không dây NE W Pro 6 TWS có micro hỗ trợ tăng giảm âm lượng",
        price: 62700,
        image: "/products/ex_prod.png",
        quantity: 2,
        variant: "Trắng",
      },
      {
        id: "item3",
        title:
          "Tai nghe bluetooth không dây NE W Pro 6 TWS có micro hỗ trợ tăng giảm âm lượng",
        price: 62700,
        image: "/products/ex_prod.png",
        quantity: 2,
        variant: "Trắng",
      },
    ],
  },
];

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelectStore = (storeId: string, selected: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    const store = cartData.find((s) => s.id === storeId);
    if (!store) return;

    store.items.forEach((item) => {
      if (selected) {
        newSelectedItems.add(item.id);
      } else {
        newSelectedItems.delete(item.id);
      }
    });

    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (itemId: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    console.log("Update quantity", itemId, quantity);
  };

  const handleRemoveItem = (itemId: string) => {
    console.log("Remove item", itemId);
  };

  const totalItems = cartData.reduce(
    (sum, store) => sum + store.items.length,
    0
  );

  const isAllSelected =
    selectedItems.size ===
    cartData.reduce((sum, store) => sum + store.items.length, 0);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>

        <div className="mb-4 rounded-lg border bg-white p-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => {
                  const newSelectedItems = new Set<string>();
                  if (checked) {
                    cartData.forEach((store) => {
                      store.items.forEach((item) => {
                        newSelectedItems.add(item.id);
                      });
                    });
                  }
                  setSelectedItems(newSelectedItems);
                }}
                className="h-5 w-5"
              />
              <span className="font-medium">
                Tất cả ({totalItems} sản phẩm)
              </span>
            </div>
            <div className="flex-1" />
            <span className="text-sm text-gray-500">Đơn giá</span>
            <span className="w-32 text-sm text-gray-500">Số lượng</span>
            <span className="w-24 text-sm text-gray-500">Thành tiền</span>
            <span className="w-8" />
          </div>
        </div>

        <div className="space-y-4">
          {cartData.map((store) => (
            <StoreSection
              key={store.id}
              storeId={store.id}
              storeName={store.name}
              items={store.items}
              selectedItems={selectedItems}
              onSelectStore={handleSelectStore}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </div>
        <CartFooter
          cartData={cartData}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          isAllSelected={isAllSelected}
          totalItems={totalItems}
        />
      </div>
    </main>
  );
}
