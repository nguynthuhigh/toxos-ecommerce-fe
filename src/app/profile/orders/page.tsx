"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

const mockOrders = [
  {
    id: "123456789",
    status: "COMPLETED",
    date: "15/03/2024",
    total: 265490,
    items: [
      {
        id: 1,
        name: "SIM 4G VIETNAMOBILE TRỌN GÓI 1 NĂM 5GB/NGÀY",
        price: 262990,
        quantity: 1,
        image: "/products/ex_prod.png",
        variation: "150GB MỖI THÁNG",
      },
    ],
    shop: {
      name: "Shop Sim Giá Rẻ",
      avatar: "/shop-avatar.png",
    },
  },
  {
    id: "987654321",
    status: "PENDING",
    date: "14/03/2024",
    total: 12000,
    items: [
      {
        id: 2,
        name: "Cặp đệm mũi cho Mắt kính chống trượt",
        price: 12000,
        quantity: 1,
        image: "/products/ex_prod.png",
        variation: "Đen",
      },
    ],
    shop: {
      name: "siêu thị giá bán sỉ",
      avatar: "/shop-avatar.png",
    },
  },
];

const orderStatuses = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "PENDING" },
  { label: "Vận chuyển", value: "SHIPPING" },
  { label: "Chờ giao hàng", value: "DELIVERING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Trả hàng/Hoàn tiền", value: "REFUND" },
];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) => activeStatus === "ALL" || order.status === activeStatus
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Search and Filter Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 border-b">
            {orderStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setActiveStatus(status.value)}
                className={`px-4 py-2 text-sm font-medium relative ${
                  activeStatus === status.value
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {status.label}
                {activeStatus === status.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="space-y-4">
              {/* Order Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={order.shop.avatar}
                    alt={order.shop.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{order.shop.name}</h3>
                    <p className="text-sm text-gray-500">
                      Đơn hàng: {order.id} | {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      order.status === "COMPLETED"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {orderStatuses.find((s) => s.value === order.status)?.label}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Phân loại: {item.variation}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">x{item.quantity}</span>
                      <span className="text-blue-600">
                        ₫{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Footer */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Liên hệ người bán
                  </Button>
                  <Button variant="outline" size="sm">
                    Xem chi tiết đơn hàng
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tổng số tiền:</p>
                  <p className="text-lg font-medium text-blue-600">
                    ₫{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
