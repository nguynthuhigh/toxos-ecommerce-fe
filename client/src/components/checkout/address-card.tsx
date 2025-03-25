"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  provinces,
  type Province,
  type District,
} from "@/lib/constants/location";

const addressFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được vượt quá 50 ký tự"),
  phone: z
    .string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  city: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  state: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  country: z.string().default("Vietnam"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  note: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface Address {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  isDefault: boolean;
}

interface AddressCardProps {
  userName: string;
  address: string;
}

export function AddressCard({ userName, address }: AddressCardProps) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      state: "",
      country: "Vietnam",
      latitude: undefined,
      longitude: undefined,
      note: "",
      isDefault: false,
    },
  });

  const addresses: Address[] = [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      street: "123 Đường Lê Lợi",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "Hồ Chí Minh",
      state: "Hồ Chí Minh",
      country: "Vietnam",
      latitude: 10.762622,
      longitude: 106.660172,
      note: "",
      isDefault: true,
    },
    {
      id: 2,
      fullName: "Nguyễn Văn B",
      phone: "0987654321",
      street: "45 Đường Phan Đình Phùng",
      ward: "Phường Điện Biên",
      district: "Quận Ba Đình",
      city: "Hà Nội",
      state: "Hà Nội",
      country: "Vietnam",
      latitude: 21.033333,
      longitude: 105.849998,
      note: "",
      isDefault: false,
    },
  ];

  function handleProvinceChange(provinceId: string) {
    const province = provinces.find((p) => p.Code === provinceId);
    setSelectedProvince(province || null);
    setSelectedDistrict(null);
    form.setValue("district", "");
    form.setValue("ward", "");
    if (province) {
      form.setValue("city", province.FullName);
      form.setValue("state", province.Name);
    }
  }

  function handleDistrictChange(districtId: string) {
    if (!selectedProvince) return;
    const district = selectedProvince.District.find(
      (d) => d.Code === districtId
    );
    setSelectedDistrict(district || null);
    form.setValue("ward", "");
  }

  function onSubmit(data: AddressFormValues) {
    const selectedWard = selectedDistrict?.Ward?.find(
      (w) => w.Code === data.ward
    );
    console.log("Form submitted with data:", {
      ...data,
      city: selectedProvince?.FullName,
      state: selectedProvince?.Name,
      district: selectedDistrict?.FullName,
      ward: selectedWard?.FullName,
    });

    // Reset form và đóng dialog
    form.reset();
    setShowNewAddressForm(false);
    setIsAddressDialogOpen(false);
    setSelectedProvince(null);
    setSelectedDistrict(null);
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-red-500 mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-red-500 font-medium">Địa Chỉ Nhận Hàng</h2>
            </div>
            <div className="flex items-center gap-4 mb-1">
              <span className="font-medium">{userName}</span>
              <span>{address}</span>
            </div>
            <Dialog
              open={isAddressDialogOpen}
              onOpenChange={setIsAddressDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  Thay Đổi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>Địa Chỉ Của Tôi</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsAddressDialogOpen(false)}
                    >
                      X
                    </Button>
                  </div>
                </DialogHeader>

                {!showNewAddressForm ? (
                  <>
                    <div className="space-y-4 py-4">
                      <RadioGroup
                        value={selectedAddress}
                        onValueChange={setSelectedAddress}
                        className="space-y-3"
                      >
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="flex items-start space-x-3 rounded-lg border p-4"
                          >
                            <RadioGroupItem
                              value={addr.id.toString()}
                              id={addr.id.toString()}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={addr.id.toString()}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <div>
                                  <span className="font-medium">
                                    {addr.fullName}
                                  </span>
                                  <span className="ml-2">{addr.phone}</span>
                                </div>
                                {addr.isDefault && (
                                  <div className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-600">
                                    Mặc định
                                  </div>
                                )}
                              </label>
                              <p className="text-sm text-gray-500 mt-1">
                                {addr.street}, {addr.ward}, {addr.district},{" "}
                                {addr.city}, {addr.state}, {addr.country}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddressDialogOpen(false)}
                      >
                        Trở Lại
                      </Button>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setIsAddressDialogOpen(false)}
                      >
                        Xác Nhận
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowNewAddressForm(true)}
                    >
                      + Thêm địa chỉ mới
                    </Button>
                  </>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập họ và tên"
                                  {...field}
                                />
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
                      </div>

                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ cụ thể</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Số nhà, tên đường..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tỉnh/Thành phố</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleProvinceChange(value);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {provinces.map((province) => (
                                    <SelectItem
                                      key={province.Code}
                                      value={province.Code}
                                    >
                                      {province.FullName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleDistrictChange(value);
                                }}
                                value={field.value}
                                disabled={!selectedProvince}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn quận/huyện" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectedProvince &&
                                    selectedProvince.District.map(
                                      (district) => (
                                        <SelectItem
                                          key={district.Code}
                                          value={district.Code}
                                        >
                                          {district.FullName}
                                        </SelectItem>
                                      )
                                    )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ward"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phường/Xã</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedDistrict}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn phường/xã" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectedDistrict?.Ward &&
                                    selectedDistrict.Ward.map((ward) => (
                                      <SelectItem
                                        key={ward.Code}
                                        value={ward.Code}
                                      >
                                        {ward.FullName}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập ghi chú" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              Đặt làm địa chỉ mặc định
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewAddressForm(false)}
                        >
                          Trở Lại
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Hoàn Thành
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
