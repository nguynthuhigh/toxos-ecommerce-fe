import React, { useState, useEffect } from "react";
import {
  Space,
  Switch,
  Input,
  Button,
  Table,
  Typography,
  InputNumber,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import type { VariantOption } from "../../schemas/product";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface Props {
  variantImages?: UploadFile[];
  onVariantImagesChange?: (fileList: UploadFile[]) => void;
  beforeUpload?: (file: RcFile) => boolean;
  onChange?: (
    hasVariants: boolean,
    variants: VariantOption[],
    sizeTitle: string,
    colorTitle: string
  ) => void;
}

type VariantField = keyof Omit<VariantOption, "size" | "color">;

const VariantManager: React.FC<Props> = ({
  // variantImages,
  // onVariantImagesChange,
  // beforeUpload,
  onChange,
}) => {
  const [hasVariants, setHasVariants] = useState(false);
  const [hasSizeVariant, setHasSizeVariant] = useState(false);
  const [hasColorVariant, setHasColorVariant] = useState(false);
  const [sizeTitle, setSizeTitle] = useState<string>("Kích thước");
  const [colorTitle, setColorTitle] = useState<string>("Màu sắc");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantOption[]>([]);

  useEffect(() => {
    if (!hasVariants) {
      setVariants([]);
      onChange?.(false, [], "", "");
      return;
    }

    const newVariants: VariantOption[] = [];

    if (!hasSizeVariant && !hasColorVariant) {
      newVariants.push({
        price: 0,
        stock: 0,
        sku: "",
      });
    } else if (hasSizeVariant && !hasColorVariant) {
      sizes.forEach((size) => {
        if (size.trim()) {
          newVariants.push({
            value: size,
            price: 0,
            stock: 0,
            sku: "",
          });
        }
      });
    } else if (!hasSizeVariant && hasColorVariant) {
      colors.forEach((color) => {
        if (color.trim()) {
          newVariants.push({
            name: color,
            price: 0,
            stock: 0,
            sku: "",
          });
        }
      });
    } else {
      sizes.forEach((size) => {
        if (size.trim()) {
          colors.forEach((color) => {
            if (color.trim()) {
              newVariants.push({
                value: size,
                name: color,
                price: 0,
                stock: 0,
                sku: "",
              });
            }
          });
        }
      });
    }

    setVariants(newVariants);
    onChange?.(hasVariants, newVariants, sizeTitle, colorTitle);
  }, [
    hasVariants,
    hasSizeVariant,
    hasColorVariant,
    sizes,
    colors,
    sizeTitle,
    colorTitle,
  ]);

  useEffect(() => {
    if (hasVariants && !hasSizeVariant && !hasColorVariant) {
      setHasSizeVariant(true);
      if (sizes.length === 0) {
        addSize();
      }
    }
  }, [hasVariants]);

  const handleVariantChange = (
    index: number,
    field: VariantField,
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    setVariants(newVariants);
    onChange?.(hasVariants, newVariants, sizeTitle, colorTitle);
  };

  const columns: ColumnsType<VariantOption> = [
    ...(hasSizeVariant
      ? [
          {
            title: sizeTitle || "Primary Variant",
            dataIndex: "value",
            key: "value",
            width: 120,
          },
        ]
      : []),
    ...(hasColorVariant
      ? [
          {
            title: colorTitle || "Secondary Option",
            dataIndex: "name",
            key: "name",
            width: 120,
          },
        ]
      : []),
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record, index) => (
        <InputNumber
          className="w-full"
          value={record.price}
          onChange={(value) => handleVariantChange(index, "price", value || 0)}
          min={0}
          step={1000}
          controls={false}
          formatter={(value) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value || 0)
          }
          parser={(value) => Number(value?.replace(/[^\d]/g, "") || 0)}
        />
      ),
    },
    {
      title: "Tồn Kho",
      dataIndex: "stock",
      key: "stock",
      render: (_, record, index) => (
        <InputNumber
          className="w-full"
          value={record.stock}
          onChange={(value) => handleVariantChange(index, "stock", value || 0)}
          min={0}
          controls={false}
        />
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (_, record, index) => (
        <Input
          value={record.sku}
          onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
          placeholder="Nhập SKU"
        />
      ),
    },
  ];

  const toggleVariants = (checked: boolean) => {
    setHasVariants(checked);
    if (!checked) {
      setHasSizeVariant(false);
      setHasColorVariant(false);
      setSizes([]);
      setColors([]);
      setVariants([]);
      onChange?.(false, [], "", "");
    }
  };

  const toggleColorVariant = (checked: boolean) => {
    setHasColorVariant(checked);
    if (checked && colors.length === 0) {
      addColor();
    }
    if (!checked) {
      setColors([]);
    }
  };

  const addSize = () => {
    setSizes([...sizes, ""]);
  };

  const removeSize = (index: number) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const removeAllSizes = () => {
    setSizes([""]);
  };

  const removeAllColors = () => {
    setColors([]);
    setHasColorVariant(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <Space>
              <Switch checked={hasVariants} onChange={toggleVariants} />
              <Text>Sản phẩm có biến thể</Text>
            </Space>
          </div>
          {hasVariants && (
            <div>
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Input
                      value={sizeTitle}
                      onChange={(e) => {
                        const newSizeTitle = e.target.value;
                        setSizeTitle(newSizeTitle);
                        onChange?.(
                          hasVariants,
                          variants,
                          newSizeTitle,
                          colorTitle
                        );
                      }}
                      style={{ width: 200, marginRight: 8 }}
                      placeholder="Nhập tên biến thể chính (VD: Kích thước)"
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      style={{ marginLeft: "auto" }}
                      onClick={removeAllSizes}
                    />
                  </div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {sizes.map((size, index) => (
                      <Space key={index} align="center">
                        <div style={{ position: "relative", width: 200 }}>
                          <Input
                            value={size}
                            onChange={(e) => updateSize(index, e.target.value)}
                            placeholder="Nhập giá trị biến thể (VD: S, M, L)"
                          />
                          <Text
                            type="secondary"
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            {index + 1}/20
                          </Text>
                        </div>
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={() => removeSize(index)}
                          disabled={sizes.length === 1}
                        />
                      </Space>
                    ))}
                  </Space>
                  <Button
                    type="dashed"
                    onClick={addSize}
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                    disabled={sizes.length >= 20}
                  >
                    Thêm Giá Trị Biến Thể
                  </Button>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Space>
                      <Switch
                        checked={hasColorVariant}
                        onChange={toggleColorVariant}
                        disabled={!hasVariants}
                      />
                      <Text>Biến Thể Phụ</Text>
                    </Space>
                  </div>
                  {hasColorVariant && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Input
                          value={colorTitle}
                          onChange={(e) => {
                            const newColorTitle = e.target.value;
                            setColorTitle(newColorTitle);
                            onChange?.(
                              hasVariants,
                              variants,
                              sizeTitle,
                              newColorTitle
                            );
                          }}
                          style={{ width: 200, marginRight: 8 }}
                          placeholder="Nhập tên biến thể phụ (VD: Màu sắc)"
                        />
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          style={{ marginLeft: "auto" }}
                          onClick={removeAllColors}
                        />
                      </div>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {colors.map((color, index) => (
                          <Space key={index} align="center">
                            <div style={{ position: "relative", width: 200 }}>
                              <Input
                                value={color}
                                onChange={(e) =>
                                  updateColor(index, e.target.value)
                                }
                                placeholder="Nhập giá trị biến thể phụ (VD: Đỏ, Xanh)"
                              />
                              <Text
                                type="secondary"
                                style={{
                                  position: "absolute",
                                  right: 8,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                              >
                                {index + 1}/20
                              </Text>
                            </div>
                            {/* {variantImages && onVariantImagesChange && (
                              <Upload
                                accept="image/*"
                                beforeUpload={beforeUpload}
                                fileList={variantImages}
                                onChange={({ fileList }) =>
                                  onVariantImagesChange(fileList)
                                }
                              >
                                <Button icon={<UploadOutlined />} />
                              </Upload>
                            )} */}
                            <Button
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={() => removeColor(index)}
                              disabled={colors.length === 1}
                            />
                          </Space>
                        ))}
                      </Space>
                      <Button
                        type="dashed"
                        onClick={addColor}
                        icon={<PlusOutlined />}
                        style={{ marginTop: 8 }}
                        disabled={colors.length >= 20}
                      >
                        Thêm Giá Trị Biến Thể Phụ
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {hasVariants && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Giá và Tồn Kho Biến Thể</Text>
          </div>
          <Table
            columns={columns}
            dataSource={variants}
            pagination={false}
            bordered
          />
        </div>
      )}
    </div>
  );
};

export default VariantManager;
