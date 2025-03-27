import { FC, useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Image,
  Card,
  Typography,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TablePaginationConfig } from "antd/es/table";
import { Product } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/product";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Products: FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () =>
      productService.getProducts({ page: currentPage, size: pageSize }),
  });
  useEffect(() => {
    if (error) {
      message.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
    }
  }, [error]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };
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
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("/products/create");
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <Table<Product>
        columns={columns}
        dataSource={data?.products || []}
        rowKey="_id"
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng số ${total} sản phẩm`,
        }}
      />
    </Card>
  );
};

export default Products;
