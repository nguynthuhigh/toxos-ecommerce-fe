import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { ShopOutlined, PhoneOutlined, EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useShop } from '../../hooks/useShop';
import { RegisterShopData } from '../../services/auth';

const RegisterShop: React.FC = () => {
  const { registerShop, isLoading, error } = useShop();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Registration failed. Please try again.');
    }
  }, [error]);

  const onFinish = (values: RegisterShopData) => {
    registerShop({
      ...values,
      logo: fileList[0]?.response?.url || 'string',
    });
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Register Your Shop</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in your shop details to get started</p>
        </div>
        <Form
          name="register-shop"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your shop name!' }]}
          >
            <Input 
              prefix={<ShopOutlined />} 
              placeholder="Shop Name"
              className="rounded-lg" 
            />
          </Form.Item>

          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Please input your shop description!' }]}
          >
            <Input.TextArea
              placeholder="Shop Description"
              className="rounded-lg"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input your contact number!' },
              { pattern: /^[0-9-+()]*$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Contact Number"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please input your shop address!' }]}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Shop Address"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="detailedAddress"
            rules={[{ required: true, message: 'Please input your detailed address!' }]}
          >
            <Input.TextArea
              placeholder="Detailed Address (landmarks, specific directions, etc.)"
              className="rounded-lg"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="logo"
            label="Shop Logo"
            valuePropName="fileList"
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={beforeUpload}
              onChange={({ fileList }) => setFileList(fileList)}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={isLoading}
            >
              Register Shop
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterShop;
