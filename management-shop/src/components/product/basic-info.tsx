import React from "react";
import { Form, Input, InputNumber } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import { FormInstance } from "antd/es/form";

interface BasicInfoProps {
  form: FormInstance;
  textAreaRef: React.RefObject<TextAreaRef>;
  validationErrors: Record<string, string>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  textAreaRef,
  validationErrors,
}) => {
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

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };

  return (
    <div className="space-y-6">
      <Form.Item
        name="name"
        label="Tên Sản Phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        validateStatus={getFieldError("name") ? "error" : undefined}
        help={getFieldError("name")}
      >
        <Input
          placeholder="Nhập tên sản phẩm"
          className={getFieldError("name") ? "border-red-500" : ""}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô Tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm" }]}
        validateStatus={getFieldError("description") ? "error" : undefined}
        help={getFieldError("description")}
      >
        <Input.TextArea
          ref={textAreaRef}
          placeholder="Nhập mô tả sản phẩm"
          rows={4}
          showCount
          maxLength={5000}
          className={getFieldError("description") ? "border-red-500" : ""}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
        validateStatus={getFieldError("price") ? "error" : undefined}
        help={getFieldError("price")}
      >
        <InputNumber
          className={`w-full ${getFieldError("price") ? "border-red-500" : ""}`}
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
        validateStatus={getFieldError("discount") ? "error" : undefined}
        help={getFieldError("discount")}
      >
        <InputNumber
          className={`w-full ${
            getFieldError("discount") ? "border-red-500" : ""
          }`}
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
        validateStatus={getFieldError("stock") ? "error" : undefined}
        help={getFieldError("stock")}
      >
        <InputNumber
          className={`w-full ${getFieldError("stock") ? "border-red-500" : ""}`}
          placeholder="Nhập số lượng tồn kho"
          min={0}
          controls={false}
        />
      </Form.Item>

      <Form.Item
        name="brand"
        label="Thương Hiệu"
        rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
        validateStatus={getFieldError("brand") ? "error" : undefined}
        help={getFieldError("brand")}
      >
        <Input
          placeholder="Nhập thương hiệu"
          className={getFieldError("brand") ? "border-red-500" : ""}
        />
      </Form.Item>

      <Form.Item
        name="origin"
        label="Xuất Xứ"
        rules={[{ required: true, message: "Vui lòng nhập xuất xứ" }]}
        validateStatus={getFieldError("origin") ? "error" : undefined}
        help={getFieldError("origin")}
      >
        <Input
          placeholder="Nhập xuất xứ"
          className={getFieldError("origin") ? "border-red-500" : ""}
        />
      </Form.Item>
    </div>
  );
};

export default BasicInfo;
