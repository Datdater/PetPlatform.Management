import React, { useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Switch,
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
  Image,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  DollarOutlined,
  TagOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { uploadImage } from "../../../services/image.service";
import {
  IAddProduct,
  ProductPrice,
  ProductTypeDetail,
} from "../../../types/IProduct";

const { Title, Text } = Typography;

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

  const productTypes = Form.useWatch("productTypes", form);

  const priceCombinations = useMemo(() => {
    if (!productTypes || productTypes.length === 0) return [];

    const type1 = productTypes[0];
    const type2 = productTypes[1];

    if (!type1?.productTypeDetails?.length) return [];
    if (!type2?.productTypeDetails?.length) {
      return type1.productTypeDetails.map((detail1: ProductTypeDetail) => ({
        price: 0,
        inventory: 0,
        productTypeDetails1: detail1?.name,
        productTypeDetails2: "",
      }));
    }

    return type1.productTypeDetails.flatMap((detail1: ProductTypeDetail) =>
      type2.productTypeDetails.map((detail2: ProductTypeDetail) => ({
        price: 0,
        inventory: 0,
        productTypeDetails1: detail1?.name,
        productTypeDetails2: detail2?.name,
      }))
    );
  }, [productTypes]);

  useEffect(() => {
    const currentPrices = form.getFieldValue("productPrices") || [];

    if (JSON.stringify(currentPrices) !== JSON.stringify(priceCombinations)) {
      const newPrices = priceCombinations.map((combination: ProductPrice) => {
        const existingPrice = currentPrices.find(
          (price: ProductPrice) =>
            price.productTypeDetails1 === combination.productTypeDetails1 &&
            price.productTypeDetails2 === combination.productTypeDetails2
        );
        return existingPrice || combination;
      });

      form.setFieldValue("productPrices", newPrices);
    }
  }, [priceCombinations, form]);

  const handleImageUpload = async (file: File, index: number) => {
    try {
      const response = await uploadImage(file);
      const currentImages = form.getFieldValue("productImages") || [];

      currentImages[index] = { url: response };

      form.setFieldsValue({ productImages: [...currentImages] }); // ⚠️ Dùng setFieldsValue để trigger re-render
      message.success("Image uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload image.");
    }
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <TagOutlined className="text-blue-500" />
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
                  {
                    max: 50,
                    message: "Tên sản phẩm không được vượt quá 50 ký tự",
                  },
                  {
                    pattern: /^[a-zA-Z0-9À-ỹ\s]+$/,
                    message: "Tên sản phẩm không được chứa ký tự đặc biệt",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập tên sản phẩm"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productDescription"
                label="Mô Tả Sản Phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả sản phẩm",
                  },
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
                name="productCategoryId"
                label="Danh Mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  size="large"
                  placeholder="Chọn danh mục"
                  className="rounded-lg"
                >
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="brandId"
                label="Thương Hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Chọn thương hiệu"
                  className="rounded-lg"
                >
                  {brands.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
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
                <Select
                  size="large"
                  placeholder="Chọn cửa hàng"
                  className="rounded-lg"
                >
                  {stores.map((store) => (
                    <Select.Option key={store.id} value={store.id}>
                      {store.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isActive"
            valuePropName="checked"
            label="Trạng Thái Sản Phẩm"
          >
            <Space>
              <Switch />
              <Text type="secondary">
                Sản phẩm đang hoạt động sẽ hiển thị với khách hàng
              </Text>
            </Space>
          </Form.Item>
        </Card>

        {/* Dimensions */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <TagOutlined className="text-green-500" />
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
                label="Khối Lượng (gram)"
                rules={[
                  { required: true, message: "Vui lòng nhập khối lượng" },
                  {
                    type: "number",
                    min: 0,
                    message: "Khối lượng phải là số dương",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="length"
                label="Chiều Dài (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều dài" },
                  {
                    type: "number",
                    min: 0,
                    message: "Chiều dài phải là số dương",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="height"
                label="Chiều Cao (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều cao" },
                  {
                    type: "number",
                    min: 0,
                    message: "Chiều cao phải là số dương",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="width"
                label="Chiều Rộng (cm)"
                rules={[
                  { required: true, message: "Vui lòng nhập chiều rộng" },
                  {
                    type: "number",
                    min: 0,
                    message: "Chiều rộng phải là số dương",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Product Images */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <TagOutlined className="text-purple-500" />
              <Title level={4} style={{ margin: 0 }}>
                Hình Ảnh Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Form.List
            name="productImages"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length === 0) {
                    console.log("Vui lòng tải lên ít nhất một hình ảnh");
                    return Promise.reject(
                      new Error("Vui lòng tải lên ít nhất một hình ảnh")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-4 mb-4 rounded">
                    <Upload
                      beforeUpload={(file) => {
                        handleImageUpload(file, name);
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>
                        Tải Lên Hình Ảnh
                      </Button>
                    </Upload>
                    {/* Hiển thị ảnh đã upload */}
                    {form.getFieldValue("productImages")?.[name] && (
                      <Image
                        src={form.getFieldValue("productImages")[name].url}
                        alt="Uploaded Image"
                        style={{ marginTop: 10, maxWidth: "100px" }}
                      />
                    )}
                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa Hình Ảnh
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  <PlusOutlined /> Thêm Hình Ảnh
                </Button>
                <div style={{ color: "red", marginBottom: "10px" }}>
                  <Form.ErrorList errors={errors} />
                </div>
              </>
            )}
          </Form.List>
        </Card>

        {/* Product Types */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <TagOutlined className="text-green-500" />
              <Title level={4} style={{ margin: 0 }}>
                Loại Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Form.List
            name="productTypes"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      new Error("Vui lòng thêm ít nhất một loại sản phẩm")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-4 mb-4 rounded">
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      label="Tên Loại"
                      rules={[
                        { required: true, message: "Vui lòng nhập tên loại" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.List
                      name={[name, "productTypeDetails"]}
                      rules={[
                        {
                          validator: async (_, value) => {
                            if (!value || value.length === 0) {
                              return Promise.reject(
                                new Error(
                                  "Vui lòng thêm ít nhất một chi tiết loại"
                                )
                              );
                            }
                          },
                        },
                      ]}
                    >
                      {(
                        subFields,
                        { add: addDetail, remove: removeDetail },
                        { errors }
                      ) => (
                        <>
                          {subFields.map((subField, index) => (
                            <Space key={subField.key} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[subField.name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập tên chi tiết",
                                  },
                                ]}
                              >
                                <Input placeholder="Tên chi tiết" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => removeDetail(index)}
                              />
                            </Space>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addDetail()}
                            block
                          >
                            <PlusOutlined /> Thêm Chi Tiết
                          </Button>
                        </>
                      )}
                    </Form.List>

                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa Loại
                    </Button>
                  </div>
                ))}
                {fields.length < 2 && (
                  <Button type="dashed" onClick={() => add()} block>
                    <PlusOutlined /> Thêm Loại Sản Phẩm
                  </Button>
                )}
                <div style={{ color: "red", marginBottom: "10px" }}>
                  <Form.ErrorList errors={errors} />
                </div>
              </>
            )}
          </Form.List>
        </Card>

        {/* Product Prices */}
        <Card
          className="shadow-md hover:shadow-lg transition-shadow"
          title={
            <Space>
              <DollarOutlined className="text-yellow-500" />
              <Title level={4} style={{ margin: 0 }}>
                Giá Sản Phẩm
              </Title>
            </Space>
          }
        >
          <Form.List
            name="productPrices"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      new Error("Vui lòng thêm ít nhất một cấu hình giá")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-4 mb-4 rounded">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Giá"
                          rules={[
                            { required: true, message: "Vui lòng nhập giá" },
                            {
                              type: "number",
                              min: 0,
                              message: "Giá phải là số dương",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) =>
                              `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "inventory"]}
                          label="Tồn Kho"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tồn kho",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Tồn kho phải là số dương",
                            },
                          ]}
                        >
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "productTypeDetails1"]}
                          label="Chi Tiết Loại 1"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "productTypeDetails2"]}
                          label="Chi Tiết Loại 2"
                        >
                          <Input readOnly />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="h-12 text-lg font-semibold rounded-lg"
          >
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
