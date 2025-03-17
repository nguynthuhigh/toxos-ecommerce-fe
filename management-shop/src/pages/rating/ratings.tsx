import { FC } from 'react';
import { Table, Rate, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Rating } from '../../types';

const mockRatings: Rating[] = [
  {
    key: '1',
    customer: { name: 'John Doe', avatar: '' },
    product: 'Product 1',
    rating: 5,
    comment: 'Excellent product! Very satisfied with the quality.',
    date: '2025-03-15',
  },
  {
    key: '2',
    customer: { name: 'Jane Smith', avatar: '' },
    product: 'Product 2',
    rating: 4,
    comment: 'Good product but delivery took longer than expected.',
    date: '2025-03-14',
  },
];

const Ratings: FC = () => {
  const columns: ColumnsType<Rating> = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: Rating['customer']) => (
        <div className="flex items-center gap-2">
          <Avatar src={customer.avatar}>{customer.name[0]}</Avatar>
          <span>{customer.name}</span>
        </div>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: '40%',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Ratings</h1>
      <Table<Rating> columns={columns} dataSource={mockRatings} />
    </div>
  );
};

export default Ratings;
