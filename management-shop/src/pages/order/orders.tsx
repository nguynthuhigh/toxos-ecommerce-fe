import { FC } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Order } from '../../types';

type StatusColorMap = {
  [key in Order['status']]: string;
};

const statusColors: StatusColorMap = {
  'Pending': 'gold',
  'Processing': 'blue',
  'Completed': 'green',
  'Cancelled': 'red',
};

const mockOrders: Order[] = [
  {
    key: '1',
    id: 'ORD-001',
    customer: 'John Doe',
    status: 'Completed',
    total: 299.99,
    date: '2025-03-15',
  },
  {
    key: '2',
    id: 'ORD-002',
    customer: 'Jane Smith',
    status: 'Processing',
    total: 159.99,
    date: '2025-03-15',
  },
];

const Orders: FC = () => {
  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <Table<Order> columns={columns} dataSource={mockOrders} />
    </div>
  );
};

export default Orders;
