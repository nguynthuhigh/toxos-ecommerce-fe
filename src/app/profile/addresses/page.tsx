"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";

const addressFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được vượt quá 50 ký tự"),
  phone: z
    .string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Mock data for demonstration
const mockAddresses = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    province: "Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    street: "123 Đường Lê Lợi",
    isDefault: true,
  },
  {
    id: 2,
    fullName: "Nguyễn Văn B",
    phone: "0987654321",
    province: "Hà Nội",
    district: "Quận Ba Đình",
    ward: "Phường Điện Biên",
    street: "45 Đường Phan Đình Phùng",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    },
  });

  function onSubmit(data: AddressFormValues) {
    if (editingAddress) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...data, id: addr.id } : addr
        )
      );
    } else {
      setAddresses([...addresses, { ...data, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingAddress(null);
  }

  function handleEdit(address: any) {
    setEditingAddress(address);
    form.reset(address);
    setIsDialogOpen(true);
  }

  function handleDelete(id: number) {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  }

  function handleSetDefault(id: number) {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sổ địa chỉ</CardTitle>
              <CardDescription>
                Quản lý địa chỉ giao hàng của bạn
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    form.reset();
                    setEditingAddress(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm địa chỉ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="0123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Chọn tỉnh/thành phố"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <FormControl>
                              <Input placeholder="Chọn quận/huyện" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <FormControl>
                              <Input placeholder="Chọn phường/xã" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ cụ thể</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Số nhà, tên đường..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {editingAddress ? "Lưu thay đổi" : "Thêm địa chỉ"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start justify-between border rounded-lg p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{address.fullName}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-500">{address.phone}</span>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {address.street}, {address.ward}, {address.district},{" "}
                    {address.province}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
