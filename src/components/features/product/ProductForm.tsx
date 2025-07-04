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
  Spin,
  UploadProps,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { uploadImage } from "../../../services/image.service";
import { getProductCategories } from "../../../services/product.service";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const { Title, Text } = Typography;

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
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState<string>(initialValues?.description || "");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    setCategoriesLoading(true);
    getProductCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const uploadProps: UploadProps = {
    action: `${import.meta.env.VITE_BACKEND_URL}/image`,
    listType: "picture-card",
    fileList: fileList,
    onChange(info) {
      let fl = [...info.fileList];
      // Only keep files with response or done status
      fl = fl.map(file => {
        if (file.response && file.status === "done") {
          return {
            ...file,
            url: file.response, // for preview
          };
        }
        return file;
      });
      setFileList(fl);
      // Update form images field with uploaded URLs
      const images = fl
        .filter(f => f.status === "done" && f.response)
        .map((f, idx) => ({ imageUrl: f.response, isMain: idx === 0 }));
      form.setFieldsValue({ images });
    },
    onRemove(file) {
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
      // Update form images field
      const images = newFileList
        .filter(f => f.status === "done" && f.response)
        .map((f, idx) => ({ imageUrl: f.response, isMain: idx === 0 }));
      form.setFieldsValue({ images });
    },
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
    // Validate images
    if (!fileList || fileList.length === 0) {
      message.error("Vui lòng thêm ít nhất một hình ảnh");
      return;
    }
    const formData = {
      ...values,
      description: description,
      images: fileList.map(f => ({ imageUrl: f.url, isMain: f.isMain })),
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
                label="Mô Tả"
                required
                validateStatus={(!description || description.length === 0) ? "error" : (description.length > 2000 ? "error" : "success")}
                help={
                  !description || description.length === 0
                    ? "Vui lòng nhập mô tả sản phẩm"
                    : description.length > 2000
                    ? "Mô tả không được vượt quá 2000 ký tự"
                    : null
                }
              >
                <CKEditor
                  editor={ClassicEditor as any}
                  data={description}
                  onChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                  config={{
                    placeholder: "Nhập mô tả sản phẩm...",
                  }}
                />
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
                <Select
                  size="large"
                  placeholder={categoriesLoading ? "Đang tải..." : "Chọn danh mục"}
                  loading={categoriesLoading}
                  disabled={categoriesLoading}
                >
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
            <Col span={6}>
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
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item
                name="width"
                label="Chiều Rộng (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều rộng" },
                  { type: "number", min: 0.01, message: "Chiều rộng phải lớn hơn 0.01" }
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
            <Col span={6}>
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
            <span style={{ fontWeight: 600 }}>
              Hình Ảnh Sản Phẩm
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <Upload {...uploadProps}>
            {fileList.length >= 8 ? null : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PlusOutlined style={{ fontSize: 24 }} />
                <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Tải Ảnh</div>
              </div>
            )}
          </Upload>
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