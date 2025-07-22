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
  UploadFile,
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
  id?: string;
  attributes: Record<string, string>;  // key là tên thuộc tính, value là giá trị
  price: number;
  stock: number;
}

interface ProductImage {
  id?: string;
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
  onSubmit: (values: any) => void;
  initialValues?: Partial<any>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm<ProductFormValues>();
  const [fileList, setFileList] = useState<(UploadFile<any> & { id?: string })[]>([]);
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

  // Handle initialValues for images
  useEffect(() => {
    if (initialValues?.images && initialValues.images.length > 0) {
      const initialFileList = initialValues.images.map((img: any, index: number) => ({
        uid: `existing-${index}`,
        name: `image-${index}`,
        status: 'done' as const,
        url: img.imageUrl,
        response: img.imageUrl,
        isMain: img.isMain,
        id: img.id // giữ lại id nếu có
      }));
      setFileList(initialFileList);
    }
  }, [initialValues?.images]);

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
        .map((f, idx) => {
          const fileWithId = f as UploadFile<any> & { id?: string };
          return { imageUrl: fileWithId.response, isMain: idx === 0, id: fileWithId.id };
        });
      form.setFieldsValue({ images });
    },
    onRemove(file) {
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
      // Update form images field
      const images2 = newFileList
        .filter(f => f.status === "done" && f.response)
        .map((f, idx) => {
          const fileWithId = f as UploadFile<any> & { id?: string };
          return { imageUrl: fileWithId.response, isMain: idx === 0, id: fileWithId.id };
        });
      form.setFieldsValue({ images: images2 });
    },
  };

  const handleAddAttribute = () => {
    const currentAttributes = form.getFieldValue('attributesDefinition') || [];
    form.setFieldsValue({
      attributesDefinition: [...currentAttributes, { name: '', values: [] }],
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const currentAttributes = form.getFieldValue('attributesDefinition') || [];
    const currentVariants = form.getFieldValue('variants') || [];
    const attributeToRemove = currentAttributes[index]?.name;
    
    // Xóa thuộc tính
    const newAttributes = currentAttributes.filter((_: any, i: number) => i !== index);
    
    // Cập nhật tất cả các biến thể hiện có, xóa thuộc tính bị xóa
    const updatedVariants = currentVariants.map((variant: ProductVariant) => {
      const newAttributes = { ...variant.attributes };
      if (attributeToRemove) {
        delete newAttributes[attributeToRemove];
      }
      return {
        ...variant,
        attributes: newAttributes
      };
    });
    
    form.setFieldsValue({
      attributesDefinition: newAttributes,
      variants: updatedVariants
    });
  };

  const handleSubmit = (values: any) => {
    // Validate images - allow existing images from initialValues
    const hasImages = fileList && fileList.length > 0;
    if (!hasImages) {
      message.error("Vui lòng thêm ít nhất một hình ảnh");
      return;
    }

    // Validate variants - đảm bảo không có thuộc tính rỗng
    const cleanedVariants = (values.variants || []).map((variant: ProductVariant) => {
      const cleanedAttributes: Record<string, string> = {};
      
      // Chỉ giữ lại những thuộc tính có tên và giá trị hợp lệ
      Object.entries(variant.attributes || {}).forEach(([key, value]) => {
        if (key && key.trim() && value && value.trim()) {
          cleanedAttributes[key.trim()] = value.trim();
        }
      });

      // Giữ lại id nếu có
      return {
        id: variant.id,
        attributes: cleanedAttributes,
        price: variant.price || 0,
        stock: variant.stock || 0
      };
    });

    const formData = {
      ...values,
      description: description,
      images: fileList
        .filter(f => f.status === "done")
        .map((f, idx) => {
          const fileWithId = f as UploadFile<any> & { id?: string };
          return {
            id: fileWithId.id,
            imageUrl: fileWithId.response || fileWithId.url,
            isMain: idx === 0
          };
        }),
      variants: cleanedVariants
    };
    
    onSubmit(formData);
  };

  const getCurrentAttributeNames = () => {
    const attributesDefinition = form.getFieldValue('attributesDefinition') || [];
    return attributesDefinition
      .filter((attr: AttributeDefinition) => attr.name && attr.name.trim())
      .map((attr: AttributeDefinition) => attr.name.trim());
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
                validateStatus={(!description || description.length === 0) ? "error" : (description.length > 5000 ? "error" : "success")}
                help={
                  !description || description.length === 0
                    ? "Vui lòng nhập mô tả sản phẩm"
                    : description.length > 5000
                    ? "Mô tả không được vượt quá 5000 ký tự"
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

        {/* Product Attributes Definition */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Định Nghĩa Thuộc Tính
              </Title>
            </Space>
          }
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Định nghĩa các thuộc tính sản phẩm (ví dụ: Size, Màu sắc, v.v.)
          </Text>

          <Form.List name="attributesDefinition">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle">
                      <Col span={20}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="Tên thuộc tính"
                          rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]}
                        >
                          <Input placeholder="Ví dụ: Size, Màu sắc, Chất liệu..." />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            remove(name);
                            handleRemoveAttribute(name);
                          }}
                        >
                          Xóa
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add({ name: '', values: [] })}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  Thêm thuộc tính
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Product Variants */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Biến Thể Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Tạo các biến thể với từng tổ hợp thuộc tính, giá và số lượng riêng biệt.
          </Text>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}>
                    <Row gutter={16}>
                      {/* Dynamic attribute fields */}
                      <Col span={14}>
                        <Row gutter={8}>
                          {getCurrentAttributeNames().map((attrName: string) => (
                            <Col span={8} key={attrName}>
                              <Form.Item
                                {...restField}
                                name={[name, 'attributes', attrName]}
                                label={attrName}
                                rules={[{ required: true, message: `Nhập giá trị cho ${attrName}` }]}
                              >
                                <Input placeholder={`Giá trị ${attrName}`} />
                              </Form.Item>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                      
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          label="Giá"
                          rules={[{ required: true, message: 'Nhập giá' }]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            style={{ width: '100%' }}
                            formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'stock']}
                          label="Số lượng"
                          rules={[{ required: true, message: 'Nhập số lượng' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button 
                            type="text" 
                            danger 
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                
                <Button 
                  type="dashed" 
                  onClick={() => {
                    const attributeNames = getCurrentAttributeNames();
                    const newVariant = {
                      attributes: attributeNames.reduce((acc: Record<string, string>, attrName: string) => {
                        acc[attrName] = '';
                        return acc;
                      }, {}),
                      price: 0,
                      stock: 0
                    };
                    add(newVariant);
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  disabled={getCurrentAttributeNames().length === 0}
                >
                  Thêm biến thể
                </Button>
                
                {getCurrentAttributeNames().length === 0 && (
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                    Vui lòng định nghĩa thuộc tính trước khi thêm biến thể
                  </Text>
                )}
              </>
            )}
          </Form.List>
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
            {initialValues ? 'Cập nhật sản phẩm' : 'Thêm Sản Phẩm'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;