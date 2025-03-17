import React from "react";
import { Form, Input, InputNumber } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import { FormInstance } from "antd/es/form";

interface BasicInfoProps {
  form: FormInstance;
  textAreaRef: React.RefObject<TextAreaRef>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ textAreaRef }) => {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const parseCurrency = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/[^\d]/g, ""));
  };

  return (
    <div className="space-y-6">
      <Form.Item
        name="title"
        label="Tên Sản Phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô Tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm" }]}
      >
        <Input.TextArea
          ref={textAreaRef}
          placeholder="Nhập mô tả sản phẩm"
          rows={4}
          showCount
          maxLength={1000}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
      >
        <InputNumber
          className="w-full"
          formatter={(value) => formatCurrency(value)}
          parser={parseCurrency}
          placeholder="Nhập giá sản phẩm"
          min={0}
          step={1000}
          controls={false}
        />
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm Giá  (%)"
        rules={[
          { required: true, message: "Số phần trăm muốn giảm" },
          {
            type: "number",
            min: 0,
            max: 99,
            message: "Giảm giá phải từ 0% đến 99%",
          },
        ]}
      >
        <InputNumber
          className="w-full"
          placeholder="Nhập số phần trăm giảm giá"
          min={0}
          max={99}
          controls={false}
        />
      </Form.Item>
      <Form.Item
        name="stock"
        label="Tồn Kho"
        rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
      >
        <InputNumber
          className="w-full"
          placeholder="Nhập số lượng tồn kho"
          min={0}
          controls={false}
        />
      </Form.Item>

      <Form.Item
        name="brand"
        label="Thương Hiệu"
        rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
      >
        <Input placeholder="Nhập thương hiệu" />
      </Form.Item>

      <Form.Item
        name="origin"
        label="Xuất Xứ"
        rules={[{ required: true, message: "Vui lòng nhập xuất xứ" }]}
      >
        <Input placeholder="Nhập xuất xứ" />
      </Form.Item>
    </div>
  );
};

export default BasicInfo;
