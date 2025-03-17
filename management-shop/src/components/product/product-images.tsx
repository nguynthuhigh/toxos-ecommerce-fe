import React from 'react';
import { Form, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

interface ProductImagesProps {
  productImages: UploadFile[];
  onProductImagesChange: (fileList: UploadFile[]) => void;
  beforeUpload: (file: RcFile) => boolean;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  productImages,
  onProductImagesChange,
  beforeUpload
}) => {
  return (
    <Form.Item
      name="productImages"
      label="Product Images"
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
      }}
    >
      <Upload
        listType="picture-card"
        fileList={productImages}
        onChange={({ fileList }) => onProductImagesChange(fileList)}
        beforeUpload={beforeUpload}
        multiple
      >
        {productImages.length >= 8 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImages;
