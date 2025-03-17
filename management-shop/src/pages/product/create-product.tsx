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

interface FormValues {
  title: string;
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
      console.log(values);
      const productData = {
        title: values.title,
        price: Number(values.price),
        stock: hasVariants ? 0 : Number(values.stock),
        discount: Number(values.discount || 0),
        description: values.description,
        soldCount: 0,
        brand: values.brand,
        origin: values.origin,
        shopId: "123",
        categoryId: values.categoryId,
        variantName: hasVariants ? values.variantName : undefined,
        optionName: hasVariants ? values.optionName : undefined,
        subcategoryId: values.subcategoryId,
        attributes: transformedAttributes,
        variants: hasVariants
          ? variants.map(({ value, name, stock, price, sku }) => ({
              value,
              name,
              stock: Number(stock),
              price: Number(price),
              sku,
            }))
          : undefined,
      };

      console.log(productData);
      CreateProductSchema.parse(productData);
      const productImageFiles = productImages.map(
        (file) => file.originFileObj as File
      );
      const variantImageFiles = variantImages.map(
        (file) => file.originFileObj as File
      );

      ProductImagesSchema.parse({
        productImages: productImageFiles.map((file) => ({ file })),
        variantImages: variantImageFiles.map((file) => ({ file })),
      });

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));

      productImageFiles.forEach((file) => {
        formData.append("product_images", file);
      });

      if (variantImageFiles.length > 0) {
        variantImageFiles.forEach((file) => {
          formData.append("variant_images", file);
        });
      }

      await createProduct(formData);
      message.success("Tạo sản phẩm thành công");
      form.resetFields();
      setProductImages([]);
      setVariantImages([]);
      setHasVariants(false);
      setVariants([]);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Không thể tạo sản phẩm");
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
            <BasicInfo form={form} textAreaRef={textAreaRef} />
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
