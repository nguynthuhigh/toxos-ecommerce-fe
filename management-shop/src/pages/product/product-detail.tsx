import React from "react";
import { Card, Tag, Image, Table, Typography, Space, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface ProductVariant {
  name: string;
  value: string;
  price: number;
  stock: number;
  sku: string;
}

interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductDetailProps {
  product: {
    title: string;
    status: string;
    price: number;
    discount: number;
    stock: number;
    description: string;
    thumbnail: string;
    images: string[];
    soldCount: number;
    brand: string;
    origin: string;
    variantName: string;
    optionName: string;
    attributes: ProductAttribute[];
    variants: ProductVariant[];
    createdAt: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const columns: ColumnsType<ProductVariant> = [
    {
      title: product.variantName,
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: product.optionName,
      dataIndex: "value",
      key: "value",
      width: 100,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: "Tồn Kho",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock: number) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0 ? `Còn ${stock}` : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 150,
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Image
              src={product.thumbnail}
              alt={product.title}
              className="w-full rounded-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <Title level={2}>{product.title}</Title>
              <Space>
                <Tag color={product.status === "active" ? "green" : "red"}>
                  {product.status === "active" ? "Đang bán" : "Ngừng bán"}
                </Tag>
                {product.discount > 0 && (
                  <Tag color="red">Giảm {product.discount}%</Tag>
                )}
              </Space>
            </div>

            <div className="space-y-2">
              <Text className="text-2xl font-bold text-red-600">
                {formatCurrency(product.price)}
              </Text>
              {product.discount > 0 && (
                <Text className="text-lg text-gray-500 line-through ml-2">
                  {formatCurrency(product.price * (1 + product.discount / 100))}
                </Text>
              )}
            </div>

            <div className="space-y-2">
              <Text className="font-semibold">Thông tin sản phẩm:</Text>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-gray-600">Thương hiệu:</Text>
                  <Text className="ml-2">{product.brand}</Text>
                </div>
                <div>
                  <Text className="text-gray-600">Xuất xứ:</Text>
                  <Text className="ml-2">{product.origin}</Text>
                </div>
                <div>
                  <Text className="text-gray-600">Tồn kho:</Text>
                  <Text className="ml-2">{product.stock}</Text>
                </div>
                <div>
                  <Text className="text-gray-600">Đã bán:</Text>
                  <Text className="ml-2">{product.soldCount}</Text>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Text className="font-semibold">Mô tả:</Text>
              <Text>{product.description}</Text>
            </div>

            {product.attributes.length > 0 && (
              <div className="space-y-2">
                <Text className="font-semibold">Thông số kỹ thuật:</Text>
                <div className="grid grid-cols-2 gap-4">
                  {product.attributes.map((attr, index) => (
                    <div key={index}>
                      <Text className="text-gray-600">{attr.name}:</Text>
                      <Text className="ml-2">{attr.value}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Variants Table */}
        {product.variants.length > 0 && (
          <div className="space-y-4">
            <Title level={4}>Danh sách biến thể</Title>
            <Table
              columns={columns}
              dataSource={product.variants}
              rowKey="_id"
              pagination={false}
              bordered
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
