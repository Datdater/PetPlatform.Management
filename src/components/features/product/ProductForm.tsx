import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  InputNumber,
  Upload,
  Card,
  Typography,
  Row,
  Col,
  message,
  Divider,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { uploadImage } from "../../../services/image.service";

const { Title, Text } = Typography;

// Sample data
const categories = [
  { id: "cat1", name: "Phụ Kiện thú cưng" },
  { id: "43715788-0B06-4ACE-92CB-2D1AF7A46B6F", name: "Thức ăn cho chó" },
];

const stores = [
  { id: "store-001", name: "Store 1" },
  { id: "AD1B7764-A89E-45BC-95EF-ADD55ECBC1E1", name: "Store 5" },
];

interface AttributeDefinition {
  name: string;
  values: string[];
}

interface ProductVariant {
  attributes: Record<string, string>;  // key là tên thuộc tính, value là giá trị
  price: number;
  stock: number;
}

interface ProductImage {
  imageUrl: string;
  isMain: boolean;
}

interface ProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  storeId: string;
  basePrice: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  images: ProductImage[];
  attributesDefinition: AttributeDefinition[];
  variants: ProductVariant[];
}

interface IAddProduct {
  categoryId: string;
  storeId: string;
  name: string;
  description: string;
  basePrice: number;
  weight: number;
  length: number;
  height: number;
  images: { imageUrl: string; isMain: boolean }[];
  variants: {
    attributes: { [key: string]: string };
    price: number;
    stock: number;
  }[];
}

interface ProductFormProps {
  onSubmit: (values: IAddProduct) => void;
  initialValues?: Partial<IAddProduct>;
  loading?: boolean;
}

// Helper function to generate all combinations of attributes
const generateVariantCombinations = (attributesData: any[]) => {
  if (!attributesData || attributesData.length === 0) return [];

  const validAttributes = attributesData
    .filter(attr => attr.name && attr.values && attr.values.length > 0)
    .map(attr => ({
      name: attr.name,
      values: attr.values.filter((val: any) => val.value && val.value.trim())
    }))
    .filter(attr => attr.values.length > 0);

  if (validAttributes.length === 0) return [];

  // Generate all combinations
  const combinations: any[] = [];
  
  const generateCombos = (index: number, currentCombo: any, currentAttributes: any) => {
    if (index === validAttributes.length) {
      combinations.push({
        attributes: currentAttributes,
        price: currentCombo.price || 0,
        stock: currentCombo.stock || 0
      });
      return;
    }

    const currentAttr = validAttributes[index];
    currentAttr.values.forEach((val: any) => {
      generateCombos(index + 1, val, {
        ...currentAttributes,
        [currentAttr.name]: val.value
      });
    });
  };

  generateCombos(0, {}, {});
  return combinations;
};

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm<ProductFormValues>();
  const [imageList, setImageList] = useState<ProductImage[]>(
    initialValues?.images || []
  );

  // Add default image if no images provided
  useEffect(() => {
    if (!initialValues?.images?.length) {
      setImageList([{ imageUrl: "https://yavuzceliker.github.io/sample-images/image-245.jpg", isMain: true }]);
      form.setFieldsValue({
        images: [{ imageUrl: "https://yavuzceliker.github.io/sample-images/image-245.jpg", isMain: true }]
      });
    }
  }, [initialValues?.images, form]);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadImage(file);
      const currentImages = form.getFieldValue("images") || [];
      currentImages.push({ imageUrl: response, isMain: currentImages.length === 0 });
      form.setFieldsValue({ images: currentImages });
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      message.error("Tải ảnh lên thất bại.");
    }
  };

  const handleAddAttribute = () => {
    const currentAttributes = form.getFieldValue('attributesDefinition') || [];
    const currentVariants = form.getFieldValue('variants') || [];
    
    // Thêm thuộc tính mới
    form.setFieldsValue({
      attributesDefinition: [...currentAttributes, { name: '', values: [] }],
      // Cập nhật tất cả các biến thể hiện có với giá trị rỗng cho thuộc tính mới
      variants: currentVariants.map((variant: ProductVariant) => ({
        ...variant,
        attributes: {
          ...variant.attributes,
          '': ''  // Thêm thuộc tính mới với giá trị rỗng
        }
      }))
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const currentAttributes = form.getFieldValue('attributesDefinition') || [];
    const currentVariants = form.getFieldValue('variants') || [];
    const attributeToRemove = currentAttributes[index]?.name;
    
    // Xóa thuộc tính
    const newAttributes = currentAttributes.filter((_: any, i: number) => i !== index);
    form.setFieldsValue({
      attributesDefinition: newAttributes,
      // Cập nhật tất cả các biến thể hiện có, xóa thuộc tính bị xóa
      variants: currentVariants.map((variant: ProductVariant) => {
        const newAttributes = { ...variant.attributes };
        delete newAttributes[attributeToRemove];
        return {
          ...variant,
          attributes: newAttributes
        };
      })
    });
  };

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      images: imageList.map((img) => ({
        imageUrl: img.imageUrl,
        isMain: img.isMain
      })),
      variants: values.variants?.map((variant: ProductVariant) => ({
        attributes: variant.attributes,
        price: variant.price,
        stock: variant.stock
      })) || []
    };

    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Thông Tin Cơ Bản
              </Title>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  { max: 50, message: "Tên sản phẩm không được vượt quá 50 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Mô Tả"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
                  { max: 200, message: "Mô tả không được vượt quá 200 ký tự" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="categoryId"
                label="Danh Mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select size="large" placeholder="Chọn danh mục">
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="storeId"
                label="Cửa Hàng"
                rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
              >
                <Select size="large" placeholder="Chọn cửa hàng">
                  {stores.map(store => (
                    <Select.Option key={store.id} value={store.id}>
                      {store.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="basePrice"
                label="Giá Cơ Bản"
                rules={[
                  { required: true, message: "Vui lòng nhập giá cơ bản" },
                  { type: "number", min: 0.01, message: "Giá cơ bản phải lớn hơn 0.01" }
                ]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  size="large"
                  formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Dimensions */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Kích Thước
              </Title>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="weight"
                label="Khối Lượng (kg)"
                rules={[
                  { required: true, message: "Vui lòng nhập khối lượng" },
                  { type: "number", min: 0.01, message: "Khối lượng phải lớn hơn 0.01" }
                ]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="length"
                label="Chiều Dài (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều dài" },
                  { type: "number", min: 0.01, message: "Chiều dài phải lớn hơn 0.01" }
                ]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label="Chiều Cao (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều cao" },
                  { type: "number", min: 0.01, message: "Chiều cao phải lớn hơn 0.01" }
                ]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  precision={2}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Product Attributes & Variants */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Thuộc Tính Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Định nghĩa các thuộc tính và giá trị của sản phẩm. Mỗi tổ hợp thuộc tính sẽ có giá và số lượng riêng.
          </Text>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <Form.List name="attributesDefinition">
                    {(attrFields, { add: addAttribute, remove: removeAttribute }) => (
                      <>
                        {attrFields.map(({ key, name, ...restField }) => (
                          <th key={key} style={{ padding: '8px', border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[{ required: true, message: 'Nhập tên thuộc tính' }]}
                                style={{ margin: 0, flex: 1 }}
                              >
                                <Input placeholder={`Thuộc tính ${name + 1}`} />
                              </Form.Item>
                              <Space>
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => handleRemoveAttribute(name)}
                                />
                                {name === attrFields.length - 1 && (
                                  <Button 
                                    type="text" 
                                    icon={<PlusOutlined />}
                                    onClick={handleAddAttribute}
                                  />
                                )}
                              </Space>
                            </Space>
                          </th>
                        ))}
                        {attrFields.length === 0 && (
                          <th style={{ padding: '8px', border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>
                            <Button 
                              type="dashed" 
                              onClick={handleAddAttribute}
                              icon={<PlusOutlined />}
                              style={{ width: '100%' }}
                            >
                              Thêm thuộc tính
                            </Button>
                          </th>
                        )}
                        <th style={{ padding: '8px', border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>
                          <Text strong>Giá</Text>
                        </th>
                        <th style={{ padding: '8px', border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>
                          <Text strong>Số lượng</Text>
                        </th>
                      </>
                    )}
                  </Form.List>
                </tr>
              </thead>
              <tbody>
                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <tr key={key}>
                          {form.getFieldValue('attributesDefinition')?.map((attr: AttributeDefinition, index: number) => (
                            <td key={index} style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'attributes', attr.name]}
                                rules={[{ required: true, message: 'Nhập giá trị' }]}
                                style={{ margin: 0 }}
                              >
                                <Input placeholder="Giá trị" />
                              </Form.Item>
                            </td>
                          ))}
                          <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                            <Form.Item
                              {...restField}
                              name={[name, 'price']}
                              rules={[{ required: true, message: 'Nhập giá' }]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber
                                min={0}
                                step={0.01}
                                precision={2}
                                style={{ width: '100%' }}
                                formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              />
                            </Form.Item>
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                            <Form.Item
                              {...restField}
                              name={[name, 'stock']}
                              rules={[{ required: true, message: 'Nhập số lượng' }]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                            <Button 
                              type="text" 
                              danger 
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                          <Button 
                            type="dashed" 
                            onClick={() => {
                              const attributesDefinition = form.getFieldValue('attributesDefinition') || [];
                              const newVariant = {
                                attributes: attributesDefinition.reduce((acc: Record<string, string>, attr: AttributeDefinition) => {
                                  acc[attr.name] = '';
                                  return acc;
                                }, {}),
                                price: 0,
                                stock: 0
                              };
                              add(newVariant);
                            }}
                            icon={<PlusOutlined />}
                            style={{ width: '100%' }}
                          >
                            Thêm biến thể
                          </Button>
                        </td>
                      </tr>
                    </>
                  )}
                </Form.List>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Images */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Hình Ảnh Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Form.List
            name="images"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(new Error("Vui lòng thêm ít nhất một hình ảnh"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'imageUrl']}
                      rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
                    >
                      <Input placeholder="URL hình ảnh" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isMain']}
                      valuePropName="checked"
                    >
                      <Select style={{ width: 120 }}>
                        <Select.Option value={true}>Ảnh chính</Select.Option>
                        <Select.Option value={false}>Ảnh phụ</Select.Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Upload
                    customRequest={({ file }) => handleImageUpload(file as File)}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Tải Ảnh Lên</Button>
                  </Upload>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Thêm Sản Phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;