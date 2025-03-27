import React, { useState, useRef } from "react";
import { Form, Button, Card, message } from "antd";
import { useProduct } from "../../hooks/useProduct";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import BasicInfo from "../../components/product/basic-info";
import CategorySelector from "../../components/product/category-selector";
import VariantManager from "../../components/product/variant-manager";
import ProductImages from "../../components/product/product-images";
import {
  CreateProductSchema,
  ProductImagesSchema,
} from "../../schemas/product";
import type { VariantOption } from "../../schemas/product";
import { TextAreaRef } from "antd/es/input/TextArea";
import * as z from "zod";

interface FormValues {
  name: string;
  price: number;
  stock: number;
  discount?: number;
  description: string;
  brand: string;
  origin: string;
  variantName?: string;
  optionName?: string;
  subcategoryId: string;
  attributes: Record<string, string | number | boolean>;
  categoryId: string;
}

const CreateProduct: React.FC = () => {
  const [form] = Form.useForm();
  const textAreaRef = useRef<TextAreaRef>(null);
  const { createProduct, isLoading } = useProduct();
  const [productImages, setProductImages] = useState<UploadFile[]>([]);
  const [variantImages, setVariantImages] = useState<UploadFile[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const beforeUpload = (file: RcFile) => {
    try {
      ProductImagesSchema.shape.productImages.element.shape.file.parse(file);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      return false;
    }
  };

  const handleVariantChange = (
    hasVariants: boolean,
    variants: VariantOption[],
    sizeTitle: string,
    colorTitle: string
  ) => {
    setHasVariants(hasVariants);
    setVariants(variants);

    if (hasVariants) {
      form.setFieldsValue({
        hasVariant: true,
        variantName: sizeTitle,
        optionName: colorTitle,
      });
    } else {
      form.setFieldsValue({
        hasVariant: false,
        variantName: undefined,
        optionName: undefined,
      });
    }
  };

  const onFinish = async (values: FormValues) => {
    try {
      const transformedAttributes = Object.entries(values.attributes || {}).map(
        ([name, value]) => ({
          name,
          value: value?.toString() || "",
        })
      );
      const productData = {
        title: values.name,
        price: Number(values.price),
        stock: hasVariants ? 0 : Number(values.stock),
        discount: Number(values.discount || 0),
        description: values.description,
        soldCount: 0,
        brand: values.brand,
        origin: values.origin,
        categoryId: values.categoryId,
        variantName: hasVariants ? values.variantName : undefined,
        optionName: hasVariants ? values.optionName : undefined,
        subcategoryId: values.subcategoryId,
        attributes: transformedAttributes,
        variants: hasVariants
          ? variants.map(({ value, name, stock, price, sku }) => ({
              value: name,
              name: value,
              stock: Number(stock),
              price: Number(price),
              sku,
            }))
          : undefined,
      };

      try {
        CreateProductSchema.parse(productData);
        setValidationErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            errors[path] = err.message;
          });
          setValidationErrors(errors);

          const errorMessages = Object.entries(errors).map(
            ([field, message]) => {
              const fieldName =
                {
                  name: "Tên sản phẩm",
                  description: "Mô tả sản phẩm",
                  price: "Giá sản phẩm",
                  stock: "Số lượng tồn kho",
                  categoryId: "Danh mục",
                  subcategoryId: "Danh mục con",
                  brand: "Thương hiệu",
                  origin: "Xuất xứ",
                  variants: "Biến thể sản phẩm",
                }[field] || field;

              return `${fieldName}: ${message}`;
            }
          );

          message.error({
            content: (
              <div>
                <div className="font-semibold mb-2">
                  Vui lòng sửa các lỗi sau:
                </div>
                <ul className="list-disc pl-4">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            ),
            duration: 5,
          });
          return;
        }
        throw error;
      }

      const productImageFiles = productImages.map(
        (file) => file.originFileObj as File
      );
      const variantImageFiles = variantImages.map(
        (file) => file.originFileObj as File
      );

      try {
        ProductImagesSchema.parse({
          productImages: productImageFiles.map((file) => ({ file })),
          variantImages: variantImageFiles.map((file) => ({ file })),
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          message.error({
            content: (
              <div>
                <div className="font-semibold mb-2">Lỗi hình ảnh sản phẩm:</div>
                <ul className="list-disc pl-4">
                  {error.errors.map((err, index) => (
                    <li key={index}>{err.message}</li>
                  ))}
                </ul>
              </div>
            ),
            duration: 5,
          });
          return;
        }
        throw error;
      }

      const formData = new FormData();
      formData.append("body", JSON.stringify(productData));

      productImageFiles.forEach((file) => {
        formData.append("product_images", file);
      });

      if (variantImageFiles.length > 0) {
        variantImageFiles.forEach((file) => {
          formData.append("variant_images", file);
        });
      }

      await createProduct.mutateAsync(formData);
      message.success("Tạo sản phẩm thành công");
      form.resetFields();
      setProductImages([]);
      setVariantImages([]);
      setHasVariants(false);
      setVariants([]);
      setValidationErrors({});
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.includes("response")
          ? JSON.parse(error.message).response?.data?.message ||
            "Lỗi khi tạo sản phẩm"
          : error.message;

        message.error({
          content: (
            <div>
              <div className="font-semibold mb-2">Không thể tạo sản phẩm:</div>
              <div>{errorMessage}</div>
            </div>
          ),
          duration: 5,
        });
      } else {
        message.error({
          content: (
            <div>
              <div className="font-semibold mb-2">Lỗi hệ thống:</div>
              <div>Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.</div>
            </div>
          ),
          duration: 5,
        });
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          hasVariant: false,
          price: 0,
          stock: 0,
          variantName: "Kích thước",
          optionName: "Màu sắc",
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Thông Tin Cơ Bản
            </h3>
            <BasicInfo
              form={form}
              textAreaRef={textAreaRef}
              validationErrors={validationErrors}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Danh Mục
            </h3>
            <CategorySelector
              onCategoryChange={() =>
                form.resetFields(["subcategoryId", "attributes"])
              }
              onSubcategoryChange={() => form.resetFields(["attributes"])}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Hình Ảnh Sản Phẩm
            </h3>
            <ProductImages
              productImages={productImages}
              onProductImagesChange={setProductImages}
              beforeUpload={beforeUpload}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Biến Thể Sản Phẩm
            </h3>
            <VariantManager
              variantImages={variantImages}
              onVariantImagesChange={setVariantImages}
              beforeUpload={beforeUpload}
              onChange={handleVariantChange}
            />
          </div>
        </div>
        <Form.Item name="variantName" style={{ display: "none" }}>
          <input />
        </Form.Item>
        <Form.Item name="optionName" style={{ display: "none" }}>
          <input />
        </Form.Item>
        <div className="lg:col-span-2 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="px-8 h-10 text-base"
          >
            Tạo Sản Phẩm
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreateProduct;
