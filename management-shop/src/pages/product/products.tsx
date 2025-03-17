import { FC } from "react";
import { Table, Button, Space, Tag, Image, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Product } from "../../types";

const { Title, Text } = Typography;

const mockProducts: Product[] = [
  {
    key: "1",
    title: "Jeans Baggy Nam/Nữ",
    status: "active",
    price: 200000,
    discount: 0,
    stock: 50,
    thumbnail:
      "https://res.cloudinary.com/ddjggwkd4/image/upload/v1742119433/uiiv9b23bfm1g87snnvs.png",
    soldCount: 0,
    brand: "Nike",
    origin: "VietNam",
    variantName: "Màu",
    optionName: "Kích cỡ",
    attributes: [
      {
        name: "Chất liệu",
        value: "Denim",
      },
    ],
    variants: [
      {
        name: "Xanh Nhạt T1",
        value: "27",
        price: 200000,
        stock: 10,
        sku: "XANHNHATT1-27",
      },
    ],
  },
  {
    key: "1",
    title: "Jeans Baggy Nam/Nữ",
    status: "active",
    price: 5000,
    discount: 0,
    stock: 50,
    thumbnail:
      "https://res.cloudinary.com/ddjggwkd4/image/upload/v1742119433/uiiv9b23bfm1g87snnvs.png",
    soldCount: 0,
    brand: "Nike",
    origin: "VietNam",
    variantName: "Màu",
    optionName: "Kích cỡ",
    attributes: [
      {
        name: "Chất liệu",
        value: "Denim",
      },
    ],
    variants: [
      {
        name: "Xanh Nhạt T1",
        value: "27",
        price: 5,
        stock: 10,
        sku: "XANHNHATT1-27",
      },
      {
        name: "Xanh Nhạt T1",
        value: "27",
        price: 200000,
        stock: 10,
        sku: "XANHNHATT1-27",
      },
    ],
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Products: FC = () => {
  const columns: ColumnsType<Product> = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Product) => (
        <div className="flex items-center space-x-4">
          <Image
            src={record.thumbnail}
            alt={title}
            width={100}
            className="w-2 h-2 object-cover rounded-lg border border-gray-200"
            preview={false}
          />
          <div>
            <Text className="font-medium text-base">{title}</Text>
            <div className="text-gray-500 text-sm mt-1">
              {record.brand} - {record.origin}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => {
        const aPrice = a.variants?.length
          ? Math.min(...a.variants.map((v) => v.price))
          : a.price;
        const bPrice = b.variants?.length
          ? Math.min(...b.variants.map((v) => v.price))
          : b.price;
        return aPrice - bPrice;
      },
      render: (price: number, record: Product) => {
        if (record.variants?.length) {
          const minPrice = Math.min(...record.variants.map((v) => v.price));
          const maxPrice = Math.max(...record.variants.map((v) => v.price));
          return (
            <div>
              <div className="flex items-center">
                <Text className="text-blue-600 font-medium">
                  {formatCurrency(minPrice)}
                </Text>
                {minPrice !== maxPrice && (
                  <Text className="text-gray-500 mx-1">-</Text>
                )}
                {minPrice !== maxPrice && (
                  <Text className="text-blue-600 font-medium">
                    {formatCurrency(maxPrice)}
                  </Text>
                )}
              </div>
              {record.discount > 0 && (
                <Text className="text-gray-500 line-through text-sm">
                  {formatCurrency(minPrice * (1 + record.discount / 100))}
                </Text>
              )}
            </div>
          );
        }
        return (
          <div>
            <Text className="text-red-600 font-medium">
              {formatCurrency(price)}
            </Text>
            {record.discount > 0 && (
              <Text className="text-gray-500 line-through ml-2">
                {formatCurrency(price * (1 + record.discount / 100))}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number, record: Product) => {
        const totalStock = record.variants?.length
          ? record.variants.reduce((sum, variant) => sum + variant.stock, 0)
          : stock;
        return (
          <Tag color={totalStock > 0 ? "green" : "red"}>
            {totalStock > 0 ? `Còn ${totalStock}` : "Hết hàng"}
          </Tag>
        );
      },
    },
    {
      title: "Đã bán",
      dataIndex: "soldCount",
      key: "soldCount",
      render: (soldCount: number) => soldCount || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">
          Danh sách sản phẩm
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table<Product>
        columns={columns}
        dataSource={mockProducts}
        rowKey="key"
        pagination={{
          total: mockProducts.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng số ${total} sản phẩm`,
        }}
      />
    </Card>
  );
};

export default Products;
