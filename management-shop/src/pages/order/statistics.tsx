import { FC, useState } from "react";
import { Card, Row, Col, Statistic, Button, DatePicker, Select } from "antd";
import { useOrderStatistics } from "../../hooks/useOrder";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../lib/axios";
import { Dayjs } from "dayjs";
const { Option } = Select;

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const Statistics: FC = () => {
  const { data: stats } = useOrderStatistics();
  const [format, setFormat] = useState<string>("excel");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get(
        `/report/excel-export?fromDate=${fromDate?.toISOString()}&toDate=${toDate?.toISOString()}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    }
  };
  const downloadPDF = async () => {
    try {
      const response = await axiosInstance.get(
        `/report/pdf-export?fromDate=${fromDate?.toISOString()}&toDate=${toDate?.toISOString()}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Tải file PDF lỗi:", err);
    }
  };
  const handleExport = async () => {
    console.log(fromDate);
    console.log(toDate);
    console.log(format);
    if (format === "excel") {
      return handleExportExcel();
    }
    if (format === "pdf") {
      return downloadPDF();
    }
  };

  // const recentOrdersColumns = [
  //   {
  //     title: "Mã đơn hàng",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  //   {
  //     title: "Khách hàng",
  //     dataIndex: ["address", "street"],
  //     key: "customer",
  //   },
  //   {
  //     title: "Tổng tiền",
  //     dataIndex: "totalPrice",
  //     key: "totalPrice",
  //     render: (price: string) => formatCurrency(price),
  //   },
  //   {
  //     title: "Trạng thái",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (status: string) => (
  //       <Tag color={statusColors[status.toLowerCase()]}>
  //         {status.toUpperCase()}
  //       </Tag>
  //     ),
  //   },
  // ];

  // const topProductsColumns = [
  //   {
  //     title: "Sản phẩm",
  //     dataIndex: "productName",
  //     key: "productName",
  //   },
  //   {
  //     title: "Số lượng",
  //     dataIndex: "quantity",
  //     key: "quantity",
  //   },
  //   {
  //     title: "Doanh thu",
  //     dataIndex: "revenue",
  //     key: "revenue",
  //     render: (revenue: string) => formatCurrency(revenue),
  //   },
  // ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê đơn hàng</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats?.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats?.totalRevenue}
              prefix="₫"
              formatter={(value) => formatCurrency(value as string)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng chờ xử lý"
              value={stats?.pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng hoàn thành"
              value={stats?.deliveredOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>
      <div className="mt-6">
        <Select value={format} onChange={setFormat} style={{ width: 120 }}>
          <Option value="excel">Excel</Option>
          <Option value="pdf">PDF</Option>
        </Select>
        <DatePicker
          onChange={(date) => setFromDate(date)}
          placeholder="Từ ngày"
        />
        <DatePicker
          onChange={(date) => setToDate(date)}
          placeholder="Đến ngày"
        />
        <Button onClick={handleExport} type="primary" className="ml-2">
          Xuất Báo Cáo
        </Button>
      </div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Doanh thu theo tháng">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: string) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1890ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Sản phẩm bán chạy">
            {/* <Table
              columns={topProductsColumns}
              dataSource={stats.topProducts}
              rowKey="productName"
              pagination={false}
            /> */}
          </Card>
        </Col>
      </Row>

      <Card title="Đơn hàng gần đây">
        {/* <Table
          columns={recentOrdersColumns}
          dataSource={stats.recentOrders}
          rowKey="id"
          pagination={false}
        /> */}
      </Card>
    </div>
  );
};

export default Statistics;
