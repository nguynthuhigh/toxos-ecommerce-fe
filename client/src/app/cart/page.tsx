"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCart,
  useUpdateQuantity,
  useRemoveItem,
  CartItem,
} from "@/lib/services/cart";
import { getAuthToken } from "@/lib/auth";

import Image from "next/image";

import { ChevronDown } from "lucide-react";
import { EmptyCart } from "@/components/cart/empty-cart";
import { useCartStore } from "@/lib/store/cart";
import VariantDialog from "@/components/cart/variant-dialog";
import CartFooter from "@/components/cart/cart-footer";

interface SelectedProduct {
  product: CartItem;
  shopId: string;
  tempVariant?: {
    name: string | null;
    value: string | null;
  };
}

export default function CartPage() {
  const router = useRouter();
  const { data: cartShops, isLoading } = useCart();
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateQuantity();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveItem();

  const setCartItems = useCartStore((state) => state.setCartItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);

  useEffect(() => {
    if (cartShops) {
      setCartItems(cartShops);
    }
  }, [cartShops, setCartItems]);

  if (typeof window !== "undefined" && !getAuthToken()) {
    router.push("/auth/login");
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!cartShops?.length) {
    return (
      <div className="min-h-screen  bg-gray-50 py-8">
        <div className="container max-w-[1200px]  mx-auto px-4">
          <h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>
          <div className="rounded-lg border  bg-white">
            <EmptyCart />
          </div>
        </div>
      </div>
    );
  }

  const totalItems = cartShops.reduce(
    (sum, shop) => sum + shop.products.length,
    0
  );

  const getProductKey = (productId: string, variantId?: string) => {
    return `${productId}${variantId ? `-${variantId}` : ""}`;
  };

  const handleSelectStore = (shopId: string, selected: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    const shop = cartShops.find((s) => s._id === shopId);
    if (!shop) return;

    shop.products.forEach((product) => {
      const productKey = getProductKey(product._id, product.variantId);
      if (selected) {
        newSelectedItems.add(productKey);
      } else {
        newSelectedItems.delete(productKey);
      }
    });

    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (productId: string, variantId?: string) => {
    const newSelectedItems = new Set(selectedItems);
    const productKey = getProductKey(productId, variantId);
    if (newSelectedItems.has(productKey)) {
      newSelectedItems.delete(productKey);
    } else {
      newSelectedItems.add(productKey);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    shopId: string
  ) => {
    if (quantity < 1) return;
    updateQuantity({ productId, quantity, shopId });
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const isAllSelected =
    selectedItems.size ===
    cartShops.reduce((sum, shop) => sum + shop.products.length, 0);

  return (
    <main className="min-h-screen max-w-[1200px] mx-auto bg-gray-50 py-8">
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
                    cartShops.forEach((shop) => {
                      shop.products.forEach((product) => {
                        newSelectedItems.add(
                          getProductKey(product._id, product.variantId)
                        );
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
          {cartShops.map((shop) => (
            <div
              key={shop._id}
              className="rounded-lg border bg-white p-4 space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={shop.products.every((product) =>
                    selectedItems.has(
                      getProductKey(product._id, product.variantId)
                    )
                  )}
                  onCheckedChange={(checked) =>
                    handleSelectStore(shop._id, !!checked)
                  }
                  className="h-5 w-5"
                />
                <div className="flex items-center space-x-2">
                  {shop.logo && (
                    <div className="relative h-8 w-8">
                      <Image
                        src={
                          shop.logo.startsWith("http")
                            ? shop.logo
                            : "/logo/avatar.png"
                        }
                        alt={shop.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <span className="font-medium">{shop.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                {shop.products.map((product) => (
                  <div
                    key={getProductKey(product._id, product.variantId)}
                    className="flex items-center space-x-4 py-4 border-t"
                  >
                    <Checkbox
                      checked={selectedItems.has(
                        getProductKey(product._id, product.variantId)
                      )}
                      onCheckedChange={() =>
                        handleSelectItem(product._id, product.variantId)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex flex-1 items-center space-x-4">
                      <div className="relative h-20 w-20">
                        <Image
                          src={
                            product.thumbnail?.startsWith("http")
                              ? product.thumbnail
                              : "/placeholder-product.png"
                          }
                          alt={product.title}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="line-clamp-2 text-sm">
                          {product.title}
                        </h3>
                        {product.variants && (
                          <button
                            onClick={() => {
                              const currentVariant = product.variants?.find(
                                (v) => v._id === product.variantId
                              );
                              setSelectedProduct({
                                product: {
                                  ...product,
                                  variant: currentVariant
                                    ? {
                                        name: currentVariant.name,
                                        value: currentVariant.value,
                                        price: currentVariant.price,
                                      }
                                    : undefined,
                                },
                                shopId: shop._id,
                              });
                              setVariantDialogOpen(true);
                            }}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
                          >
                            <span>
                              Phân Loại:{" "}
                              {product.variants.find(
                                (v) => v._id === product.variantId
                              )?.name || "Chọn màu"}
                              ,{" "}
                              {product.variants.find(
                                (v) => v._id === product.variantId
                              )?.value || "Chọn size"}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        )}
                        <p className="text-sm font-medium text-blue-500">
                          ₫{product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="h-8 w-8 rounded-md border"
                          onClick={() =>
                            handleUpdateQuantity(
                              product._id,
                              product.quantity - 1,
                              shop._id
                            )
                          }
                          disabled={product.quantity <= 1 || isUpdating}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              product._id,
                              Math.max(1, parseInt(e.target.value) || 1),
                              shop._id
                            )
                          }
                          className="h-8 w-16 rounded-md border px-2 text-center"
                          min="1"
                          disabled={isUpdating}
                        />
                        <button
                          className="h-8 w-8 rounded-md border"
                          onClick={() =>
                            handleUpdateQuantity(
                              product._id,
                              product.quantity + 1,
                              shop._id
                            )
                          }
                          disabled={isUpdating}
                        >
                          +
                        </button>
                      </div>
                      <p className="w-24 text-right font-medium text-blue-500">
                        ₫{(product.price * product.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="text-gray-400 hover:text-gray-500"
                        disabled={isRemoving}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <CartFooter
          cartData={cartShops}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          isAllSelected={isAllSelected}
          totalItems={totalItems}
          getProductKey={getProductKey}
        />
      </div>

      <VariantDialog
        selectedProduct={selectedProduct}
        variantDialogOpen={variantDialogOpen}
        setVariantDialogOpen={setVariantDialogOpen}
        setSelectedProduct={setSelectedProduct}
      />
    </main>
  );
}
