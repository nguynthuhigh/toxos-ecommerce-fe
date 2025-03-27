import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Switch, Space, Select } from "antd";
import {
  useCategories,
  useSubcategories,
  useSubcategoryDetails,
} from "../../hooks/useCategory";
import type { SubcategoryAttribute } from "../../types/product";

const { Option } = Select;

interface CategorySelectorProps {
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
  validationErrors: Record<string, string>;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategoryChange,
  onSubcategoryChange,
  validationErrors,
}) => {
  const form = Form.useFormInstance();
  const [categoryId, setCategoryId] = useState<string>();
  const [subcategoryId, setSubcategoryId] = useState<string>();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useSubcategories(categoryId);
  const { data: subcategoryDetails } = useSubcategoryDetails(subcategoryId);

  // Watch form values
  useEffect(() => {
    const values = form.getFieldsValue();
    setCategoryId(values.categoryId);
    setSubcategoryId(values.subcategoryId);
  }, [form]);

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    onCategoryChange(value);
  };

  const handleSubcategoryChange = (value: string) => {
    setSubcategoryId(value);
    onSubcategoryChange(value);
  };

  const selectedCategory = categories?.find((cat) => cat._id === categoryId);
  const selectedSubcategory = subcategories?.find(
    (subcat) => subcat._id === subcategoryId
  );

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };

  return (
    <>
      <div className="text-sm text-gray-500 mb-4">
        {selectedCategory && <span>{selectedCategory.name}</span>}
        {selectedSubcategory && (
          <>
            <span className="mx-2">{">"}</span>
            <span>{selectedSubcategory.name}</span>
          </>
        )}
      </div>

      <Space direction="vertical" className="w-full">
        <Form.Item
          name="categoryId"
          label="Danh Mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          validateStatus={getFieldError("categoryId") ? "error" : undefined}
          help={getFieldError("categoryId")}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục"
            loading={categoriesLoading}
            onChange={handleCategoryChange}
            className={getFieldError("categoryId") ? "border-red-500" : ""}
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {categories?.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subcategoryId"
          label="Danh Mục Con"
          rules={[{ required: true, message: "Vui lòng chọn danh mục con" }]}
          validateStatus={getFieldError("subcategoryId") ? "error" : undefined}
          help={getFieldError("subcategoryId")}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục con"
            loading={subcategoriesLoading}
            disabled={!categoryId}
            onChange={handleSubcategoryChange}
            className={getFieldError("subcategoryId") ? "border-red-500" : ""}
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {subcategories?.map((subcategory) => (
              <Option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Space>

      {subcategoryDetails?.attributes.map((attribute) => {
        const { name, type, options } = attribute;
        const attributeError = getFieldError(`attributes.${name}`);

        switch (type) {
          case "text":
          case "select":
            return (
              <Form.Item
                key={name}
                name={["attributes", name]}
                label={name}
                validateStatus={attributeError ? "error" : undefined}
                help={attributeError}
              >
                <Input
                  placeholder={
                    options
                      ? `Nhập một trong các giá trị: ${options.join(", ")}`
                      : `Nhập ${name.toLowerCase()}`
                  }
                  className={attributeError ? "border-red-500" : ""}
                />
              </Form.Item>
            );

          case "number":
            return (
              <Form.Item
                key={name}
                name={["attributes", name]}
                label={name}
                validateStatus={attributeError ? "error" : undefined}
                help={attributeError}
              >
                <InputNumber
                  className={`w-full ${attributeError ? "border-red-500" : ""}`}
                  min={0}
                  placeholder={`Nhập ${name.toLowerCase()}`}
                />
              </Form.Item>
            );

          case "boolean":
            return (
              <Form.Item
                key={name}
                name={["attributes", name]}
                label={name}
                valuePropName="checked"
                initialValue={false}
                validateStatus={attributeError ? "error" : undefined}
                help={attributeError}
              >
                <Switch />
              </Form.Item>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default CategorySelector;
