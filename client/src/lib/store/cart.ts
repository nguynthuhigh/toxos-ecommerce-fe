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
        const total = get().cartItems.reduce((acc, shop) => {
          return acc + shop.products.reduce((sum) => sum + 1, 0);
        }, 0);
        set({ totalItems: total });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
