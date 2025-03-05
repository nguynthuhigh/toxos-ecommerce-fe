import { Button } from "../ui/button";
import Image from "next/image";
export default function ShopInfo() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <Image
            src="https://down-vn.img.susercontent.com/file/vn-11134201-7qukw-lj0qb0eeyn5o69_tn"
            alt="Shop avatar"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-medium">Coolmate - Official Store</h3>
          <p className="text-sm text-gray-500">Online 6 Minutes Ago</p>
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-gray-500">Rating: </span>
              <span className="font-medium text-red-500">790.9k</span>
            </div>
            <div>
              <span className="text-gray-500">Products: </span>
              <span className="font-medium">611</span>
            </div>
            <div>
              <span className="text-gray-500">Response Rate: </span>
              <span className="font-medium text-red-500">100%</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-32">
            View Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
