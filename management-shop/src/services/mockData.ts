import type { Category, Subcategory } from "../types/product";

export const mockCategories: Category[] = [
  {
    _id: "67c43f3f5987c7cb773db0eb",
    name: "Đồ Chơi",
    icon: "toy",
    type: "toy",
    subcategories: [],
  },
  {
    _id: "67c44bfd27c21c72f6c01906",
    name: "Thời Trang Nam",
    icon: "",
    type: "mens",
    subcategories: [],
  },
];

export const mockSubcategories: Record<string, Subcategory[]> = {
  "67c43f3f5987c7cb773db0eb": [
    {
      _id: "67d81a0853de1f902045fc15",
      name: "Bộ Sưu Tập",
      type: "collection",
      category: "67c43f3f5987c7cb773db0eb",
      attributes: [
        {
          name: "Độ Tuổi",
          type: "select",
          required: true,
          options: ["0-3 tuổi", "4-8 tuổi", "9-12 tuổi", "12+ tuổi"],
        },
        {
          name: "Chất Liệu",
          type: "select",
          required: true,
          options: ["Nhựa", "Gỗ", "Kim Loại", "Bông"],
        },
        {
          name: "Hướng Dẫn An Toàn",
          type: "text",
          required: true,
        },
        {
          name: "Tính Năng Giáo Dục",
          type: "boolean",
          required: false,
        },
      ],
    },
  ],
  "67c44bfd27c21c72f6c01906": [
    {
      _id: "67c69a4e5037daf868b37198",
      name: "Quần",
      type: "pants",
      category: "67c44bfd27c21c72f6c01906",
      attributes: [
        {
          name: "Chất Liệu",
          type: "select",
          required: true,
          options: ["Vải Cotton", "Vải Jean", "Vải Polyester", "Vải Len"],
        },
        {
          name: "Kiểu Dáng",
          type: "select",
          required: true,
          options: ["Thường Ngày", "Công Sở", "Thể Thao"],
        },
        {
          name: "Hướng Dẫn Bảo Quản",
          type: "text",
          required: true,
        },
        {
          name: "Co Giãn",
          type: "boolean",
          required: false,
        },
      ],
    },
  ],
};
