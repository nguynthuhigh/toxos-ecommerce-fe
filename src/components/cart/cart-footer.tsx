import { Checkbox } from "@radix-ui/react-checkbox";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartData } from "@/app/cart/page";
interface CartFooterProps {
  cartData: CartData[];
  selectedItems: Set<string>;
  setSelectedItems: (items: Set<string>) => void;
  isAllSelected: boolean;
  totalItems: number;
}
export default function CartFooter({
  cartData,
  selectedItems,
  setSelectedItems,
  isAllSelected,
  totalItems,
}: CartFooterProps) {
  const totalPrice = cartData.reduce((sum, store) => {
    return (
      sum +
      store.items.reduce((storeSum, item) => {
        if (selectedItems.has(item.id)) {
          return storeSum + item.price * item.quantity;
        }
        return storeSum;
      }, 0)
    );
  }, 0);
  return (
    <div className="mt-4 rounded-lg border bg-white p-4 fixed bottom-0 left-0 right-0">
      <div className="flex items-center justify-between">
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
          <span>Chọn tất cả ({totalItems})</span>
          <Button variant="ghost" className="text-red-500 hover:text-red-600">
            Xóa
          </Button>
          <div className="flex-1" />
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Tổng thanh toán:</span>
              <span className="text-xl font-medium text-red-500">
                ₫{formatPrice(totalPrice)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Tiết kiệm: ₫{formatPrice(totalPrice * 0.1)}
            </div>
          </div>
          <Button className="h-12 w-48 bg-red-500 hover:bg-red-600">
            Mua hàng ({selectedItems.size})
          </Button>
        </div>
      </div>
    </div>
  );
}
