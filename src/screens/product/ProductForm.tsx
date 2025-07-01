import React, { useState } from 'react';
import { Form, Input, Switch, Select, Button, Space, InputNumber, Upload, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { IAddProduct } from '../../types/IProduct';
import type { UploadFile, UploadProps } from 'antd';

interface ProductFormProps {
  onSubmit: (values: IAddProduct) => void;
  initialValues?: Partial<IAddProduct>;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  stores: { id: string; name: string }[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
  categories,
  brands,
  stores,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Custom upload function
  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://localhost:7000/api/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url || result.data?.url; // Adjust based on your API response
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Upload props for Ant Design Upload
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      // Validate file size (e.g., max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must smaller than 5MB!');
        return false;
      }

      return false; // Prevent auto upload, we'll handle it manually
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  // Handle form submission with file upload
  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      
      // Upload all files first
      const uploadedUrls: string[] = [];
      
      for (const file of fileList) {
        if (file.originFileObj) {
          const url = await handleUpload(file.originFileObj as File);
          uploadedUrls.push(url);
        }
      }

      // Add uploaded URLs to product images
      const productImages = uploadedUrls.map(url => ({ url }));
      
      // Merge with existing product images from form
      const existingImages = values.productImages || [];
      const allImages = [...existingImages, ...productImages];

      // Submit form with uploaded image URLs
      onSubmit({
        ...values,
        productImages: allImages
      });

      message.success('Product created successfully!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to upload files or create product');
      console.error('Submit error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      className="max-w-2xl mx-auto"
    >
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="productDescription"
          label="Product Description"
          rules={[{ required: true, message: 'Please enter product description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="productCategoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select>
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Brand"
          rules={[{ required: true, message: 'Please select a brand' }]}
        >
          <Select>
            {brands.map(brand => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="storeId"
          label="Store"
          rules={[{ required: true, message: 'Please select a store' }]}
        >
          <Select>
            {stores.map(store => (
              <Select.Option key={store.id} value={store.id}>
                {store.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked" label="Active Status">
          <Switch />
        </Form.Item>
      </div>

      {/* Product Type */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Product Type</h2>

        <Form.Item
          name="productType"
          label="Product Type"
          rules={[{ required: true, message: 'Please enter product code' }]}
        >
          <Input />
        </Form.Item>
      </div>

      {/* Dimensions */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Dimensions</h2>

        <Form.Item
          name="weight"
          label="Weight (kg)"
          rules={[{ required: true, message: 'Please enter weight' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="length"
          label="Length (cm)"
          rules={[{ required: true, message: 'Please enter length' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="height"
          label="Height (cm)"
          rules={[{ required: true, message: 'Please enter height' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="width"
          label="Width (cm)"
          rules={[{ required: true, message: 'Please enter width' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </div>

      {/* Product Types */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Product Types</h2>

        <Form.List name="productTypes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="border p-4 mb-4 rounded">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    label="Type Name"
                    rules={[{ required: true, message: 'Missing type name' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.List name={[name, 'productTypeDetails']}>
                    {(subFields, { add: addDetail, remove: removeDetail }) => (
                      <>
                        {subFields.map((subField, index) => (
                          <Space key={subField.key} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[subField.name, 'name']}
                              rules={[{ required: true, message: 'Missing detail name' }]}
                            >
                              <Input placeholder="Detail name" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeDetail(index)} />
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => addDetail()} block>
                          <PlusOutlined /> Add Detail
                        </Button>
                      </>
                    )}
                  </Form.List>
                  <Button type="link" danger onClick={() => remove(name)}>
                    Remove Type
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                <PlusOutlined /> Add Product Type
              </Button>
            </>
          )}
        </Form.List>
      </div>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload Product Images</h2>
        
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select Images</Button>
        </Upload>
        
        <div className="mt-2 text-sm text-gray-500">
          Support: JPG, PNG, GIF (Max: 5MB each)
        </div>
      </div>

      {/* Manual Product Images */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Manual Image URLs</h2>

        <Form.List name="productImages">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="border p-4 mb-4 rounded">
                  <Form.Item
                    {...restField}
                    name={[name, 'url']}
                    label="Image URL"
                    rules={[{ required: true, message: 'Please enter image URL' }]}
                  >
                    <Input placeholder="Enter image URL" />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(name)}>
                    Remove Image
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                <PlusOutlined /> Add Manual Image URL
              </Button>
            </>
          )}
        </Form.List>
      </div>

      {/* Product Prices */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Product Prices</h2>

        <Form.List name="productPrices">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="border p-4 mb-4 rounded">
                  <Space align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      label="Price"
                      rules={[{ required: true, message: 'Missing price' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'inventory']}
                      label="Inventory"
                      rules={[{ required: true, message: 'Missing inventory' }]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'urlImage']}
                      label="Image URL"
                      rules={[{ required: true, message: 'Please enter image URL' }]}
                    >
                      <Input placeholder="Enter image URL" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'productTypeDetails1']}
                      label="Type Detail 1"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'productTypeDetails2']}
                      label="Type Detail 2"
                    >
                      <Input />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                <PlusOutlined /> Add Price Configuration
              </Button>
            </>
          )}
        </Form.List>
      </div>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;