import { FC } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Tag,
  Descriptions,
  Table,
  Image,
  Space,
  Button,
  message,
} from "antd";
import { useOrder } from "../../hooks/useOrder";
import {
  CopyOutlined,
  BoxPlotOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { Order } from "../../hooks/useOrder";
import { statusColors } from "./orders";

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const OrderDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: order,
    isLoading,
    error,
    packOrder,
    cancelOrder,
    isPacking,
    isCancelling,
  } = useOrder(id || "");

  if (error) {
    return <div>Không thể tải thông tin đơn hàng</div>;
  }

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
  };

  const handlePackOrder = () => {
    packOrder();
    message.success("Đã cập nhật trạng thái gói hàng");
  };

  const handleCancelOrder = () => {
    cancelOrder();
    message.success("Đã hủy đơn hàng");
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_: string, record: Order["orderItems"][0]) => (
        <Space>
          <Image
            src={record.productThumbnail}
            alt={record.productName}
            width={50}
            height={50}
            className="object-cover"
          />
          <span>{record.productName}</span>
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: string) => formatCurrency(price),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng",
      key: "total",
      render: (record: Order["orderItems"][0]) =>
        formatCurrency((Number(record.price) * record.quantity).toString()),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        <Space>
          <span className="text-gray-500">Mã đơn hàng: {order.id}</span>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={handleCopyOrderId}
            size="small"
          />
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card
          title="Thông tin đơn hàng"
          extra={
            <Space>
              {order.status === "paid" && (
                <Button
                  type="primary"
                  icon={<BoxPlotOutlined />}
                  onClick={handlePackOrder}
                  loading={isPacking}
                >
                  Xác nhận đã gói hàng
                </Button>
              )}
              {order.status === "paid" && (
                <Button
                  disabled
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={handleCancelOrder}
                  loading={isCancelling}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </Space>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[order.status.toLowerCase()]}>
                {order.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {order.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Thông tin giao hàng">
          <Descriptions column={1}>
            <Descriptions.Item label="Địa chỉ">
              {order.address.street}, {order.address.ward},{" "}
              {order.address.district}, {order.address.city}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {order.address.note || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Card title="Danh sách sản phẩm" className="mb-6">
        <Table
          columns={columns}
          dataSource={order.orderItems}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="Tổng quan">
        <Descriptions column={2}>
          <Descriptions.Item label="Tổng tiền hàng">
            {formatCurrency(order.totalPrice)}
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            {formatCurrency(order.totalShipping)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng cộng">
            {formatCurrency(
              (
                Number(order.totalPrice) + Number(order.totalShipping)
              ).toString()
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderDetail;
