import { Button } from "../ui/button";
import Image from "next/image";
import { MessageCircle, Star } from "lucide-react";

export default function ShopInfo() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start gap-4">
        {/* Shop Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src="https://down-vn.img.susercontent.com/file/vn-11134201-7qukw-lj0qb0eeyn5o69_tn"
              alt="Shop avatar"
              fill
              className="rounded-lg object-cover"
            />
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Coolmate - Official Store</h3>
            <p className="text-sm text-gray-500">Online 6 phút trước</p>
          </div>
        </div>

        {/* Shop Metrics */}
        <div className="ml-auto flex items-center divide-x">
          <div className="px-6">
            <div className="flex items-center gap-8 text-sm">
              <div className="space-y-1 text-center">
                <div className="text-gray-500">Đánh Giá</div>
                <div className="font-medium text-orange-500">4.8/5</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="text-gray-500">Sản Phẩm</div>
                <div className="font-medium">611</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="text-gray-500">Tỷ Lệ Phản Hồi</div>
                <div className="font-medium text-orange-500">98%</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-6">
            <Button variant="outline" className="h-9 gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Ngay
            </Button>
            <Button variant="outline" className="h-9">
              Xem Shop
            </Button>
          </div>
        </div>
      </div>

      {/* Shop Achievements */}
      <div className="mt-4 flex items-center gap-6 border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-500">
            Mall
          </div>
          <span className="text-sm text-gray-500">Thương hiệu chính hãng</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-500">
            Yêu thích+
          </div>
          <span className="text-sm text-gray-500">Shop bán hàng uy tín</span>
        </div>
      </div>
    </div>
  );
}
