import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Spin, Alert } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useDashboard } from "../hooks/useDashboard";
import type { ColumnsType } from "antd/es/table";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboard();
  const [counts, setCounts] = useState({
    orders: 0,
    products: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (data) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      const timer = setInterval(() => {
        setCounts((prev) => ({
          orders:
            prev.orders < data.totalOrders
              ? prev.orders + Math.ceil(data.totalOrders / steps)
              : data.totalOrders,
          products:
            prev.products < data.totalProducts
              ? prev.products + Math.ceil(data.totalProducts / steps)
              : data.totalProducts,
          revenue:
            prev.revenue < data.totalRevenue
              ? prev.revenue + Math.ceil(data.totalRevenue / steps)
              : data.totalRevenue,
        }));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [data]);

  const recentOrderColumns: ColumnsType<any> = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const topProductColumns: ColumnsType<any> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Sold",
      dataIndex: "soldCount",
      key: "soldCount",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load dashboard data. Please try again later."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Orders"
              value={counts.orders}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Products"
              value={counts.products}
              prefix={<ShopOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Revenue"
              value={counts.revenue}
              prefix={<DollarOutlined className="text-yellow-500" />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Orders"
            className="hover:shadow-lg transition-shadow"
          >
            <Table
              columns={recentOrderColumns}
              dataSource={data?.recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Top Products"
            className="hover:shadow-lg transition-shadow"
          >
            <Table
              columns={topProductColumns}
              dataSource={data?.topProducts}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
