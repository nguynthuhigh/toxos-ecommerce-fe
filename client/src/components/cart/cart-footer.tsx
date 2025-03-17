import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartShop } from "@/lib/services/cart";

interface CartFooterProps {
  cartData: CartShop[];
  selectedItems: Set<string>;
  setSelectedItems: (items: Set<string>) => void;
  isAllSelected: boolean;
  totalItems: number;
  getProductKey: (productId: string, variantId?: string) => string;
}

export default function CartFooter({
  cartData,
  selectedItems,
  setSelectedItems,
  isAllSelected,
  totalItems,
  getProductKey,
}: CartFooterProps) {
  const totalPrice = cartData.reduce((total, shop) => {
    return (
      total +
      shop.products.reduce((shopTotal, product) => {
        if (selectedItems.has(getProductKey(product._id, product.variantId))) {
          return shopTotal + product.price * product.quantity;
        }
        return shopTotal;
      }, 0)
    );
  }, 0);

  return (
    <div className="sticky bottom-0 mt-4 rounded-lg border bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => {
              const newSelectedItems = new Set<string>();
              if (checked) {
                cartData.forEach((shop) => {
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
          <span className="font-medium">Tất cả ({totalItems} sản phẩm)</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-sm">
            <span className="text-gray-500">Tổng thanh toán:</span>
            <span className="ml-2 text-xl font-medium text-blue-500">
              ₫{totalPrice.toLocaleString()}
            </span>
          </div>
          <Button
            size="lg"
            onClick={() => {}}
            disabled={selectedItems.size === 0}
          >
            Mua hàng ({selectedItems.size})
          </Button>
        </div>
      </div>
    </div>
  );
}
