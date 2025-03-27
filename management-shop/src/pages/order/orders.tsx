import { FC, useState } from "react";
import { Table, Tag, message, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useOrders } from "../../hooks/useOrder";
import type { TablePaginationConfig } from "antd/es/table";
import type { Order } from "../../hooks/useOrder";
import { CopyOutlined } from "@ant-design/icons";
import type { Key } from "react";

type StatusColorMap = {
  [key: string]: string;
};

export const statusColors: StatusColorMap = {
  pending: "gold",
  paid: "blue",
  completed: "green",
  cancelled: "red",
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const Orders: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const { data, isLoading, error } = useOrders({
    page: currentPage,
    limit: pageSize,
  });

  if (error) {
    message.error("Không thể tải danh sách đơn hàng");
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    message.success("Đã sao chép mã đơn hàng");
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (id: string) => (
        <Space>
          <span className="text-ellipsis max-w-[150px]">{id}</span>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopyOrderId(id)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: ["address", "street"],
      key: "customer",
      ellipsis: true,
      render: (text: string) => (
        <div className="truncate max-w-[200px]" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status.toLowerCase()]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total: string) => formatCurrency(total),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => <a href={`/order/${record.id}`}>Xem chi tiết</a>,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách đơn hàng</h1>
        {selectedRowKeys.length > 0 && (
          <div className="text-sm text-gray-500">
            Đã chọn {selectedRowKeys.length} đơn hàng
          </div>
        )}
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} đơn hàng`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Orders;
