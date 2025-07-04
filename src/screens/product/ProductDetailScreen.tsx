import React, { useEffect, useState } from 'react';
import {
    Card,
    Space,
    Typography,
    Row,
    Col,
    Table,
    Button,
    Image,
    Spin,
    message,
    Tag,
    Rate,
    Divider,
    InputNumber,
    Popconfirm,
    Input,
    Breadcrumb
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { getProductById } from '../../services/product.service';
import { IProductDetail } from '../../types/IProduct';
import { Link } from 'react-router';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const ProductDetailScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const [quantity, setQuantity] = useState<number>(1);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedProduct, setEditedProduct] = useState<Partial<IProductDetail>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id!) as IProductDetail;
                setProduct(data);
                setEditedProduct(data);
                setSelectedAttributes({});
            } catch (error) {
                message.error('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAttributeSelect = (attributeType: string, value: string) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attributeType]: value
        }));
    };

    const getAvailableVariants = () => {
        if (!product?.variants) return [];
        return product.variants.filter(variant =>
            Object.keys(selectedAttributes).every(attr =>
                variant.attributes[attr] === selectedAttributes[attr]
            )
        );
    };

    const handleUpdate = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProduct(product || {});
    };

    const handleSave = async () => {
        try {
            // TODO: Implement update product API call
            setProduct(prev => prev ? { ...prev, ...editedProduct } : null);
            message.success('Cập nhật sản phẩm thành công');
            setIsEditing(false);
        } catch (error) {
            message.error('Không thể cập nhật sản phẩm');
        }
    };

    const handleDelete = async () => {
        try {
            // TODO: Implement delete product API call
            message.success('Xóa sản phẩm thành công');
            navigate('/products');
        } catch (error) {
            message.error('Không thể xóa sản phẩm');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const selectedVariant = getAvailableVariants()[0] || null;
    const maxStock = selectedVariant ? selectedVariant.stock : 0;

    // Breadcrumb label
    const breadcrumbName = product?.name || 'Chi tiết sản phẩm';

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Typography.Title level={4}>Không tìm thấy sản phẩm</Typography.Title>
                <Button type="primary" onClick={() => navigate('/products')}>
                    Quay lại Danh sách Sản phẩm
                </Button>
            </div>
        );
    }

    // Build attribute options
    const attributeTypes: { [key: string]: string[] } = {};
    product.variants.forEach(variant => {
        Object.entries(variant.attributes).forEach(([key, value]) => {
            if (!attributeTypes[key]) attributeTypes[key] = [];
            if (!attributeTypes[key].includes(value)) {
                attributeTypes[key].push(value);
            }
        });
    });

    return (
        <div style={{ padding: '20px' }}>
            <Breadcrumb style={{ marginBottom: 20 }}>
                <Breadcrumb.Item>
                    <Link to="/products">Sản phẩm</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{breadcrumbName}</Breadcrumb.Item>
            </Breadcrumb>

            <Space style={{ marginBottom: 20 }}>
                {!isEditing ? (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleUpdate}
                    >
                        Chỉnh sửa
                    </Button>
                ) : (
                    <>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                        >
                            Lưu
                        </Button>
                        <Button
                            icon={<CloseOutlined />}
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                    </>
                )}
                <Popconfirm
                    title="Xóa sản phẩm"
                    description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                    onConfirm={handleDelete}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                    >
                        Xóa
                    </Button>
                </Popconfirm>
            </Space>

            <Card>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Image
                            src={product.images.find(img => img.isMain)?.imageUrl || product.images[0]?.imageUrl}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' }}
                        />
                        <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                            {product.images.map((image, index) => (
                                <Col span={8} key={index}>
                                    <Image
                                        src={image.imageUrl}
                                        alt={`${product.name} - Hình ảnh ${index + 1}`}
                                        style={{ width: '100%', height: 100, objectFit: 'cover' }}
                                    />
                                    {image.isMain && (
                                        <Tag color="blue" style={{ marginTop: 4 }}>Ảnh chính</Tag>
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                {isEditing ? (
                                    <Input
                                        size="large"
                                        value={editedProduct.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                                    />
                                ) : (
                                    <Title level={3}>{product.name}</Title>
                                )}
                                <Space>
                                    <Tag color="yellow">{product.categoryName}</Tag>
                                </Space>
                            </div>

                            <div>
                                {isEditing ? (
                                    <InputNumber
                                        style={{ width: '100%', fontSize: '20px' }}
                                        value={editedProduct.basePrice}
                                        onChange={(value) => handleInputChange('basePrice', value)}
                                        formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                        parser={(displayValue) => {
                                            const parsed = displayValue ? displayValue.replace(/\$\s?|(,*)/g, '') : '';
                                            const num = Number(parsed);
                                            return isNaN(num) ? 0 : num;
                                        }}
                                        addonAfter="VND"
                                    />
                                ) : (
                                    <Title level={4} style={{ margin: 0 }}>
                                        {(selectedVariant ? selectedVariant.price : product.basePrice).toLocaleString('vi-VN')} VND
                                    </Title>
                                )}
                                <Space>
                                    <Rate disabled defaultValue={product.starAverage} />
                                    <Text type="secondary">
                                        ({product.reviewCount} đánh giá)
                                    </Text>
                                </Space>
                            </div>

                            {isEditing ? (
                                <TextArea
                                    rows={4}
                                    value={editedProduct.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    style={{ fontSize: '16px' }}
                                />
                            ) : (
                                <Paragraph>{product.description}</Paragraph>
                            )}

                            <Space direction="vertical" size="small">
                                {isEditing ? (
                                    <>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            value={editedProduct.weight}
                                            onChange={(value) => handleInputChange('weight', value)}
                                            addonAfter="kg"
                                            placeholder="Cân nặng"
                                        />
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    value={editedProduct.length}
                                                    onChange={(value) => handleInputChange('length', value)}
                                                    addonAfter="cm"
                                                    placeholder="Chiều dài"
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    value={editedProduct.height}
                                                    onChange={(value) => handleInputChange('height', value)}
                                                    addonAfter="cm"
                                                    placeholder="Chiều cao"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        <Text type="secondary">Cân nặng: {product.weight}kg</Text>
                                        <Text type="secondary">Kích thước: {product.length}cm x {product.height}cm</Text>
                                    </>
                                )}
                                <Text type="secondary">Đã bán: {product.sold}</Text>
                            </Space>
                           {/* Attribute Selection */}
                            <Title level={5} style={{ marginBottom: 8 }}>
                                <Space>
                                    Tùy chọn
                                    {Object.keys(selectedAttributes).length > 0 && (
                                        <Button 
                                            size="small" 
                                            type="link" 
                                            danger
                                            onClick={() => setSelectedAttributes({})}
                                            style={{ padding: 0, height: 'auto' }}
                                        >
                                            Xóa tất cả
                                        </Button>
                                    )}
                                </Space>
                            </Title>

                            {Object.keys(attributeTypes).map(attributeType => (
                                <div key={attributeType} style={{ marginBottom: 16 }}>
                                    <Text style={{ fontWeight: 600, fontSize: 16 }}>{attributeType}</Text>
                                    <Space wrap style={{ marginTop: 8 }}>
                                        {attributeTypes[attributeType].map(value => {
                                            // Kiểm tra xem tùy chọn này có available không
                                            const isAvailable = product.variants.some(variant => {
                                                const thisAttrMatch = variant.attributes[attributeType] === value;
                                                if (!thisAttrMatch) return false;
                                                
                                                const otherAttrsMatch = Object.entries(selectedAttributes).every(
                                                    ([attr, val]) => {
                                                        if (attr === attributeType) return true;
                                                        return variant.attributes[attr] === val;
                                                    }
                                                );
                                                
                                                return otherAttrsMatch && variant.price > 0 && variant.stock > 0;
                                            });

                                            const isSelected = selectedAttributes[attributeType] === value;
                                            
                                            return (
                                                <Tag
                                                    key={value}
                                                    color={isSelected ? 'processing' : (isAvailable ? 'default' : 'default')}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            // Nếu đã chọn, click để bỏ chọn
                                                            const newSelected = { ...selectedAttributes };
                                                            delete newSelected[attributeType];
                                                            setSelectedAttributes(newSelected);
                                                        } else if (isAvailable) {
                                                            // Nếu chưa chọn và available, click để chọn
                                                            handleAttributeSelect(attributeType, value);
                                                        }
                                                    }}
                                                    style={{
                                                        cursor: (isSelected || isAvailable) ? 'pointer' : 'not-allowed',
                                                        opacity: (isSelected || isAvailable) ? 1 : 0.5,
                                                        padding: '6px 12px',
                                                        fontSize: 14,
                                                        borderRadius: 4,
                                                        border: isSelected ? '1px solid #1890ff' : undefined,
                                                        backgroundColor: isSelected ? '#e6f7ff' : undefined,
                                                    }}
                                                >
                                                    {value}
                                                    {isSelected && (
                                                        <CloseOutlined 
                                                            style={{ marginLeft: 4, fontSize: 10 }} 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newSelected = { ...selectedAttributes };
                                                                delete newSelected[attributeType];
                                                                setSelectedAttributes(newSelected);
                                                            }}
                                                        />
                                                    )}
                                                </Tag>
                                            );
                                        })}
                                    </Space>
                                </div>
                            ))}
                            {/* Quantity & Stock */}
                            <Title level={5} style={{ marginBottom: 8 }}>Số lượng & Kho: {maxStock}</Title>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProductDetailScreen;
