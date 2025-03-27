import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Upload } from "antd";
import {
  ShopOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useShop } from "../../hooks/useShop";
import { RegisterShopData } from "../../services/auth";
import { RcFile } from "antd/es/upload";

interface FormValues extends Omit<RegisterShopData, "logo"> {
  logo?: File;
}

const RegisterShop: React.FC = () => {
  const { registerShop, isLoading, error } = useShop();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      message.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  }, [error]);

  const onFinish = async (values: FormValues) => {
    try {
      if (fileList.length === 0) {
        message.error("Vui lòng tải lên logo cửa hàng!");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("address", values.address);
      formData.append("detailedAddress", values.detailedAddress);

      if (fileList[0].originFileObj) {
        formData.append("logo", fileList[0].originFileObj);
      }
      await registerShop(formData);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error(err);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên tệp hình ảnh!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Đăng Ký Cửa Hàng</h2>
          <p className="mt-2 text-sm text-gray-600">
            Điền thông tin cửa hàng của bạn để bắt đầu
          </p>
        </div>
        <Form
          form={form}
          name="register-shop"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng!" }]}
          >
            <Input
              prefix={<ShopOutlined />}
              placeholder="Tên Cửa Hàng"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả cửa hàng!" },
            ]}
          >
            <Input.TextArea
              placeholder="Mô Tả Cửa Hàng"
              className="rounded-lg"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9-+()]*$/,
                message: "Vui lòng nhập số điện thoại hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số Điện Thoại"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ cửa hàng!" },
            ]}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Địa Chỉ Cửa Hàng"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="detailedAddress"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ chi tiết!" },
            ]}
          >
            <Input.TextArea
              placeholder="Địa Chỉ Chi Tiết (địa điểm, hướng dẫn cụ thể, v.v.)"
              className="rounded-lg"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="logo"
            label="Logo Cửa Hàng"
            rules={[
              { required: true, message: "Vui lòng tải lên logo cửa hàng!" },
            ]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              fileList={fileList}
              customRequest={({ onSuccess }) => {
                onSuccess?.("ok");
              }}
            >
              <Button icon={<UploadOutlined />}>Tải Logo</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={isLoading}
            >
              Đăng Ký Cửa Hàng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterShop;
