import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartShop } from "@/lib/services/cart";

interface CartState {
  cartItems: CartShop[];
  totalItems: number;
  setCartItems: (items: CartShop[]) => void;
  updateTotalItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalItems: 0,
      setCartItems: (items) => {
        set({ cartItems: items });
        get().updateTotalItems();
      },
      updateTotalItems: () => {
        const total = get().cartItems.reduce(
          (sum, shop) =>
            sum +
            shop.products.reduce(
              (shopSum, product) => shopSum + product.quantity,
              0
            ),
          0
        );
        set({ totalItems: total });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
