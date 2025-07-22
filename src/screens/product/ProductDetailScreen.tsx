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
    Breadcrumb,
    Pagination,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { getProductById, getProductReviews } from '../../services/product.service';
import { IProductDetail, ProductVariant, ProductImage } from '../../types/IProduct';
import { Link } from 'react-router';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../styles/ckeditor-custom.css';
import ProductForm from '../../components/features/product/ProductForm';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// Helper: Map product detail to ProductForm initialValues
function mapProductToFormValues(product: IProductDetail) {
  if (!product) return {};
  // Lấy tất cả thuộc tính từ các variants
  const attributeNames = Array.from(new Set(
    product.variants.flatMap((v: ProductVariant) => Object.keys(v.attributes || {}))
  ));
  // Tạo attributesDefinition
  const attributesDefinition = attributeNames.map(name => ({
    name,
    values: Array.from(new Set(product.variants.map((v: ProductVariant) => v.attributes?.[name]).filter(Boolean)))
  }));
  return {
    categoryId: product.categoryId,
    storeId: product.storeId,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    images: (product.images || []).map((img: ProductImage) => ({ imageUrl: img.imageUrl, isMain: img.isMain })),
    variants: (product.variants || []).map((v: ProductVariant) => ({
      attributes: v.attributes,
      price: v.price,
      stock: v.stock
    })),
    attributesDefinition
  };
}

const ProductDetailScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const [quantity, setQuantity] = useState<number>(1);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedProduct, setEditedProduct] = useState<Partial<IProductDetail>>({});
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const reviewsPerPage = 10;
    const paginatedReviews = reviews.slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage);

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
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                const data = await getProductReviews(id!);
                setReviews(data);
            } catch (error) {
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };
        if (id) {
            fetchProduct();
            fetchReviews();
        }
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
                        onClick={() => navigate(`/products/${id}/edit`)}
                    >
                        Chỉnh sửa
                    </Button>
                ) : (
                    <Card style={{ marginBottom: 24, borderRadius: 10, boxShadow: '0 2px 8px #e6e6e6', padding: 0, background: '#fff' }}>
                        <ProductForm
                            initialValues={mapProductToFormValues(product)}
                            onSubmit={(values) => {
                                // TODO: call update product API
                                setProduct(prev => prev ? { ...prev, ...values } : null);
                                message.success('Cập nhật sản phẩm thành công');
                                setIsEditing(false);
                            }}
                            loading={loading}
                        />
                        <Button
                            icon={<CloseOutlined />}
                            onClick={handleCancel}
                            style={{ marginTop: 16 }}
                        >
                            Hủy
                        </Button>
                    </Card>
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

            {/* Product Basic Info Card */}
            <Card style={{ marginBottom: 24 }}>
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
                            {/* Product Name & Category */}
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

                            {/* Price & Rating */}
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
                                        addonAfter="VNĐ"
                                    />
                                ) : (
                                    <Title level={4} style={{ margin: 0 }}>
                                        {Object.keys(selectedAttributes).length === Object.keys(attributeTypes).length && selectedVariant
                                            ? selectedVariant.price.toLocaleString('vi-VN')
                                            : product.basePrice.toLocaleString('vi-VN')}
                                        {' '}VNĐ
                                    </Title>
                                )}
                                <Space>
                                    <Rate disabled value={product.starAverage} />
                                    <Text type="secondary">
                                        ({product.reviewCount} đánh giá)
                                    </Text>
                                </Space>
                            </div>

                            {/* Product Specs */}
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
                                            <Col span={8}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    value={editedProduct.length}
                                                    onChange={(value) => handleInputChange('length', value)}
                                                    addonAfter="cm"
                                                    placeholder="Chiều dài"
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    value={editedProduct.width}
                                                    onChange={(value) => handleInputChange('width', value)}
                                                    addonAfter="cm"
                                                    placeholder="Chiều rộng"
                                                />
                                            </Col>
                                            <Col span={8}>
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
                                        <Text type="secondary">
                                            Kích thước: {product.length}cm x {product.width}cm x {product.height}cm
                                        </Text>
                                    </>
                                )}
                                <Text type="secondary">Đã bán: {product.sold}</Text>
                            </Space>

                            {/* Attribute Selection */}
                            <div>
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
                                    <div key={attributeType} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, fontSize: 16, minWidth: 100, marginRight: 16 }}>{attributeType}</span>
                                        <div className="attribute-options-grid">
                                            {attributeTypes[attributeType].map(value => {
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
                                                    <div
                                                        key={value}
                                                        className={`attribute-option-btn${isSelected ? ' selected' : ''}${!isAvailable ? ' disabled' : ''}`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                const newSelected = { ...selectedAttributes };
                                                                delete newSelected[attributeType];
                                                                setSelectedAttributes(newSelected);
                                                            } else if (isAvailable) {
                                                                handleAttributeSelect(attributeType, value);
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: (isSelected || isAvailable) ? 'pointer' : 'not-allowed',
                                                            opacity: (isSelected || isAvailable) ? 1 : 0.5,
                                                        }}
                                                    >
                                                        <span>{value}</span>
                                                        {isSelected && (
                                                            <CloseOutlined
                                                                style={{ marginLeft: 4, fontSize: 10 }}
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    const newSelected = { ...selectedAttributes };
                                                                    delete newSelected[attributeType];
                                                                    setSelectedAttributes(newSelected);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quantity & Stock */}
                            <Title level={5} style={{ marginBottom: 8 }}>Số lượng & Kho: {maxStock}</Title>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Product Description Card */}
            <Card>
                <div>
                    <Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
                        Mô tả chi tiết sản phẩm
                    </Title>
                    {isEditing ? (
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                            <CKEditor
                                editor={ClassicEditor as any}
                                data={editedProduct.description || ''}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    handleInputChange('description', data);
                                }}
                                config={{
                                    toolbar: [
                                        'heading',
                                        '|',
                                        'bold',
                                        'italic',
                                        'link',
                                        'bulletedList',
                                        'numberedList',
                                        '|',
                                        'outdent',
                                        'indent',
                                        '|',
                                        'blockQuote',
                                        'insertTable',
                                        'undo',
                                        'redo'
                                    ],
                                    language: 'vi'
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            className="ck-content"
                            dangerouslySetInnerHTML={{ __html: product.description || '' }}
                            style={{ 
                                fontSize: '16px',
                                lineHeight: '1.8',
                                color: '#333',
                                padding: '24px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '8px',
                                backgroundColor: '#fafafa',
                                minHeight: '200px'
                            }}
                        />
                    )}
                </div>
            </Card>

            {/* Product Reviews Card */}
            <Card style={{ marginTop: 24 }}>
              <Title level={4} style={{ marginBottom: 16, color: '#1570EF' }}>Đánh giá sản phẩm</Title>
              {loadingReviews ? (
                <Spin />
              ) : reviews.length === 0 ? (
                <Text type="secondary">Chưa có đánh giá nào cho sản phẩm này.</Text>
              ) : (
                <>
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {paginatedReviews.map((review) => (
                      <Row key={review.id} gutter={16} align="middle" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
                        <Col>
                          <div style={{
                            width: 48, height: 48, borderRadius: '50%', background: '#E0E7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#1570EF', fontWeight: 700
                          }}>
                            <UserOutlined />
                          </div>
                        </Col>
                        <Col flex="auto">
                          <Space direction="vertical" size={0} style={{ width: '100%' }}>
                            <Space>
                              <Text strong>{review.userName}</Text>
                              <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
                            </Space>
                            <Text style={{ fontSize: 15 }}>{review.comment}</Text>
                            <Text type="secondary" style={{ fontSize: 13 }}>{new Date(review.createdAt).toLocaleString('vi-VN')}</Text>
                          </Space>
                        </Col>
                      </Row>
                    ))}
                  </Space>
                  {/* Pagination controls */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 24,
                    }}
                  >
                    <Pagination
                      current={currentReviewPage}
                      total={reviews.length}
                      pageSize={reviewsPerPage}
                      onChange={(page) => setCurrentReviewPage(page)}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              )}
            </Card>
        </div>
    );
};

export default ProductDetailScreen;
