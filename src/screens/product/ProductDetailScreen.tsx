import React, { useEffect, useState, useMemo } from "react";
import {
    Card,
    Space,
    Typography,
    Row,
    Col,
    Table,
    Badge,
    Button,
    Image,
    Statistic,
    Spin,
    message,
    Input,
    InputNumber,
    Form,
    Select,
    Popconfirm,
    Switch,
    Tag,
    Divider,
    Upload
} from "antd";
import {
    TagOutlined,
    ShopOutlined,
    BarcodeOutlined,
    DollarOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    LoadingOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from "react-router";
import { getProductById, deleteProduct, updateProduct, getCategories, getBrands, getStores } from "../../services/product.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IUpdateProduct, ProductTypeDetail, ProductPrice } from "../../types/IProduct";
import { uploadImage } from "../../services/image.service";

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ProductDetailScreen: React.FC = () => {
    const categories = getCategories();
    
      const brands = getBrands();
    
      const stores = getStores();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const {
        data: productDetail,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!),
        enabled: !!id
    });
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadImage(file);
            const currentImages = form.getFieldValue("productImages") || [];
            form.setFieldsValue({ productImages: [...currentImages, { url: response.url }] });
            message.success("Image uploaded successfully!");
        } catch (error) {
            message.error("Failed to upload image.");
        }
    };

    const handleDeleteImage = (index: number) => {
        const currentImages = form.getFieldValue("productImages") || [];
        currentImages.splice(index, 1); // Remove the image at the specified index
        form.setFieldsValue({ productImages: [...currentImages] });
        message.success("Image deleted successfully!");
    };

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            message.success('Product deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/products');
        },
        onError: (error) => {
            message.error('Failed to delete product');
            console.error('Delete error:', error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (updatedProduct: IUpdateProduct) =>
            updateProduct(id!, updatedProduct),
        onSuccess: () => {
            message.success('Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            setIsEditing(false);
        },
        onError: (error) => {
            message.error('Failed to update product');
            console.error('Update error:', error);
        }
    });

    useEffect(() => {
        if (productDetail) {
            form.setFieldsValue(productDetail);
        }
    }, [productDetail, form]);

    useEffect(() => {
        if (isEditing && productDetail) {
            form.setFieldsValue(productDetail);
        }
    }, [isEditing, productDetail, form]);

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const { id, ...rest } = productDetail || {}; // Tách id ra khỏi object
            const productUpdate: IUpdateProduct = {
                ...rest,
                id: id || '', // Đảm bảo id luôn là string
                name: values.name || '', // Đảm bảo name luôn là string

                // Tìm ID của category, brand, store từ danh sách tương ứng
                productCategoryId: categories.find(c => c.name.toLocaleLowerCase === values.categoryName.toLocaleLowerCase)?.id || '',
                brandId: brands.find(b => b.name === values.brandName)?.id || '',
                storeId: stores.find(s => s.name === values.storeName)?.id || '',

                isActive: values.isActive ?? false, // Đảm bảo giá trị boolean
                productDescription: values.productDescription || '',
                views: values.views ?? 1,

                productTypes: values.productTypes,
                productPrices: values.productPrices
            };


            updateMutation.mutate({
                ...productUpdate,
                ...values
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.setFieldsValue(productDetail);
        setIsEditing(false);
    };

    const productTypes = Form.useWatch('productTypes', form);

    const priceCombinations = useMemo(() => {
        if (!productTypes || productTypes.length === 0) return [];

        const combinations: ProductPrice[] = [];

        const type1 = productTypes[0];
        const type2 = productTypes[1];

        if (!type1?.productTypeDetails?.length) return [];
        if (!type2?.productTypeDetails?.length) {
            return type1.productTypeDetails.map((detail1: ProductTypeDetail) => ({
                price: 0,
                inventory: 0,
                productTypeDetails1: detail1?.name,
                productTypeDetails2: '',
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
        const currentPrices = form.getFieldValue('productPrices') || [];

        if (JSON.stringify(currentPrices) !== JSON.stringify(priceCombinations)) {
            const newPrices = priceCombinations.map((combination: ProductPrice) => {
                const existingPrice = currentPrices.find(
                    (price: ProductPrice) =>
                        price.productTypeDetails1 === combination.productTypeDetails1 &&
                        price.productTypeDetails2 === combination.productTypeDetails2
                );
                return existingPrice || combination;
            });

            form.setFieldsValue({ productPrices: newPrices });
        }
    }, [priceCombinations, form]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={antIcon} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <Card>
                    <div className="text-center">
                        <Title level={4} type="danger">Error Loading Product</Title>
                        <Text type="secondary">{(error as Error)?.message}</Text>
                        <div className="mt-4">
                            <Button onClick={() => navigate('/products')}>
                                Back to Products
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className="p-6">
                <Card>
                    <div className="text-center">
                        <Title level={4}>Product Not Found</Title>
                        <div className="mt-4">
                            <Button onClick={() => navigate('/products')}>
                                Back to Products
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card className="mb-6">
                <Space className="w-full justify-between">
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/products')}
                        >
                            Back to Products
                        </Button>
                        <Title level={4} style={{ margin: 0 }}>Product Details</Title>
                    </Space>
                    <Space>
                        {isEditing ? (
                            <>
                                <Button
                                    type="primary"
                                    onClick={handleSave}
                                    loading={updateMutation.isPending}
                                >
                                    Save Changes
                                </Button>
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    type="primary"
                                    onClick={handleEdit}
                                >
                                    Edit Product
                                </Button>
                                <Popconfirm
                                    title="Delete Product"
                                    description="Are you sure you want to delete this product?"
                                    onConfirm={handleDelete}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        loading={deleteMutation.isPending}
                                    >
                                        Delete Product
                                    </Button>
                                </Popconfirm>
                            </>
                        )}
                    </Space>
                </Space>
            </Card>

            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24} xl={16}>
                        <Card
                            title={
                                <Space>
                                    <TagOutlined className="text-blue-500" />
                                    <span>Basic Information</span>
                                </Space>
                            }
                            className="mb-6"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[{ required: true, message: 'Please enter product name' }]}
                                    >
                                        {isEditing ? (
                                            <Input />
                                        ) : (
                                            <Text strong>{productDetail?.name}</Text>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="productDescription"
                                        label="Product Description"
                                        rules={[{ required: true, message: 'Please enter product description' }]}
                                    >
                                        {isEditing ? (
                                            <Input />
                                        ) : (
                                            <Space>
                                                {productDetail?.productDescription}
                                            </Space>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="brandName"
                                        label="Brand"
                                        rules={[{ required: true }]}
                                    >
                                        {isEditing ? (
                                            <Select value={brands.find(b => b.name === productDetail?.brandName)?.id}>
                                                {brands.map((brand) => (
                                                    <Select.Option key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Tag color="blue">{productDetail?.brandName}</Tag>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="storeName"
                                        label="Store"
                                        rules={[{ required: true }]}
                                    >
                                        {isEditing ? (
                                            <Select value={stores.find(b => b.name === productDetail?.storeName)?.id}>
                                                {stores.map((store) => (
                                                    <Select.Option key={store.id} value={store.id}>
                                                        {store.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Tag color="green">{productDetail?.storeName}</Tag>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="categoryName"
                                        label="Category"
                                        rules={[{ required: true }]}
                                    >
                                        {isEditing ? (
                                            <Select value={categories.find(b => b.name === productDetail?.categoryName)?.id}>
                                                {categories.map((category) => (
                                                    <Select.Option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Tag color="yellow">{productDetail?.categoryName}</Tag>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="isActive"
                                        label="Status"
                                        valuePropName="checked"
                                    >
                                        {isEditing ? (
                                            <Switch />
                                        ) : (
                                            <Badge
                                                status={productDetail?.isActive ? "success" : "error"}
                                                text={productDetail?.isActive ? "Active" : "Inactive"}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <TagOutlined className="text-green-500" />
                                    <span>Product Types</span>
                                </Space>
                            }
                            className="mb-6"
                        >
                            {isEditing ? (
                                <Form.List name="productTypes">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <div key={field.key} className="border p-4 mb-4 rounded">
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'name']}
                                                        label={`Type ${index + 1} Name`}
                                                        rules={[{ required: true, message: 'Missing type name' }]}
                                                    >
                                                        <Input placeholder="e.g., Size, Color" />
                                                    </Form.Item>

                                                    <Form.List name={[field.name, 'productTypeDetails']}>
                                                        {(subFields, { add: addDetail, remove: removeDetail }) => (
                                                            <>
                                                                {subFields.map((subField, subIndex) => (
                                                                    <Space key={subField.key} align="baseline">
                                                                        <Form.Item
                                                                            {...subField}
                                                                            name={[subField.name, 'name']}
                                                                            rules={[{ required: true, message: 'Missing detail name' }]}
                                                                        >
                                                                            <Input placeholder={`Enter ${form.getFieldValue(['productTypes', index, 'name'])} option`} />
                                                                        </Form.Item>
                                                                        <Button
                                                                            type="text"
                                                                            danger
                                                                            icon={<MinusCircleOutlined />}
                                                                            onClick={() => removeDetail(subIndex)}
                                                                        />
                                                                    </Space>
                                                                ))}
                                                                <Button type="dashed" onClick={() => addDetail()} block>
                                                                    <PlusOutlined /> Add Option
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Form.List>

                                                    {fields.length > 1 && (
                                                        <Button type="link" danger onClick={() => remove(field.name)}>
                                                            Remove Type
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            {fields.length < 2 && (
                                                <Button type="dashed" onClick={() => add()} block>
                                                    <PlusOutlined /> Add Product Type
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </Form.List>
                            ) : (
                                productDetail.productTypes.map((type, index) => (
                                    <div key={type.name} className="mb-4">
                                        <Title level={5}>
                                            <Badge
                                                count={`Type ${index + 1}: ${type.name}`}
                                                style={{
                                                    backgroundColor: index === 0 ? '#1890ff' : '#52c41a'
                                                }}
                                            />
                                        </Title>
                                        <div className="ml-6 mt-2">
                                            <Space wrap>
                                                {type.productTypeDetails.map(detail => (
                                                    <Tag key={detail.name}>{detail.name}</Tag>
                                                ))}
                                            </Space>
                                        </div>
                                        {index < productDetail.productTypes.length - 1 && <Divider />}
                                    </div>
                                ))
                            )}
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <DollarOutlined className="text-yellow-500" />
                                    <span>Product Prices</span>
                                </Space>
                            }
                        >
                            <Form.List name="productPrices">
                                {(fields, { }) => (
                                    <>
                                        {isEditing ? (
                                            <Table
                                                dataSource={fields.map(field => ({
                                                    ...field,
                                                    key: field.key,
                                                    ...form.getFieldValue(['productPrices', field.name])
                                                }))}
                                                pagination={false}
                                                scroll={{ x: true }}
                                                columns={[
                                                    {
                                                        title: 'Type 1',
                                                        dataIndex: 'productTypeDetails1',
                                                        key: 'productTypeDetails1',
                                                    },
                                                    {
                                                        title: 'Type 2',
                                                        dataIndex: 'productTypeDetails2',
                                                        key: 'productTypeDetails2',
                                                    },
                                                    {
                                                        title: 'Price',
                                                        key: 'price',
                                                        render: (_, __, index) => (
                                                            <Form.Item
                                                                name={[index, 'price']}
                                                                rules={[{ required: true, message: 'Required' }]}
                                                                noStyle
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    style={{ width: '100%' }}
                                                                    placeholder="Enter price"
                                                                    formatter={(value) =>
                                                                        `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        ),
                                                    },
                                                    {
                                                        title: 'Inventory',
                                                        key: 'inventory',
                                                        render: (_, __, index) => (
                                                            <Form.Item
                                                                name={[index, 'inventory']}
                                                                rules={[{ required: true, message: 'Required' }]}
                                                                noStyle
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    style={{ width: '100%' }}
                                                                    placeholder="Enter inventory"
                                                                />
                                                            </Form.Item>
                                                        ),
                                                    }
                                                ]}
                                            />
                                        ) : (
                                            <Table
                                                dataSource={fields.map(field => ({
                                                    ...field,
                                                    key: field.key,
                                                    ...form.getFieldValue(['productPrices', field.name])
                                                }))}
                                                pagination={false}
                                                scroll={{ x: true }}
                                                columns={[
                                                    {
                                                        title: 'Type 1',
                                                        dataIndex: 'productTypeDetails1',
                                                        key: 'productTypeDetails1',
                                                    },
                                                    {
                                                        title: 'Type 2',
                                                        dataIndex: 'productTypeDetails2',
                                                        key: 'productTypeDetails2',
                                                    },
                                                    {
                                                        title: 'Price',
                                                        key: 'price',
                                                        render: (_, __, index) => (
                                                            <Form.Item
                                                                name={[index, 'price']}
                                                                rules={[{ required: true, message: 'Required' }]}
                                                                noStyle
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    style={{ width: '100%' }}
                                                                    placeholder="Enter price"
                                                                    formatter={(value) =>
                                                                        `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                    }
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        ),
                                                    },
                                                    {
                                                        title: 'Inventory',
                                                        key: 'inventory',
                                                        render: (_, __, index) => (
                                                            <Form.Item
                                                                name={[index, 'inventory']}
                                                                rules={[{ required: true, message: 'Required' }]}
                                                                noStyle
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    style={{ width: '100%' }}
                                                                    placeholder="Enter inventory"
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        ),
                                                    }
                                                ]}
                                            />
                                        )}

                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>

                    <Col xs={24} xl={8}>
                        <Card className="mb-6">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Total Variants"
                                        value={productDetail?.productPrices.length}
                                        prefix={<TagOutlined />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Total Inventory"
                                        value={productDetail?.productPrices.reduce(
                                            (sum, price) => sum + price.inventory,
                                            0
                                        )}
                                        prefix={<ShopOutlined />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Min Price"
                                        value={Math.min(
                                            ...productDetail?.productPrices.map(p => p.price)
                                        )}
                                        prefix="$"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Max Price"
                                        value={Math.max(
                                            ...productDetail?.productPrices.map(p => p.price)
                                        )}
                                        prefix="$"
                                    />
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <TagOutlined className="text-purple-500" />
                                    <span>Product Images</span>
                                </Space>
                            }
                        >
                            {isEditing ? (
                                <div>
                                    <Row gutter={[8, 8]}>
                                        {form.getFieldValue("productImages")?.map((image: { url: string }, index: number) => (
                                            <Col span={12} key={index}>
                                                <Image src={image.url} alt={`Product Image ${index}`} className="rounded-lg" />
                                                <Button
                                                    type="link"
                                                    danger
                                                    onClick={() => handleDeleteImage(index)}
                                                    style={{ marginTop: 8 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Col>
                                        ))}
                                    </Row>
                                    <Upload
                                        beforeUpload={(file) => {
                                            handleImageUpload(file);
                                            return false; // Prevent default upload behavior
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button type="dashed" className="mt-4" icon={<UploadOutlined />}>
                                            Add Image
                                        </Button>
                                    </Upload>
                                </div>
                            ) : (
                                <Image.PreviewGroup>
                                    <Row gutter={[8, 8]}>
                                        {productDetail?.productImages.map((image, index) => (
                                            <Col span={12} key={index}>
                                                <Image
                                                    src={image.url}
                                                    alt={`Product Image ${index}`}
                                                    className="rounded-lg"
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Image.PreviewGroup>
                            )}

                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ProductDetailScreen;