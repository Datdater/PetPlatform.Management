import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Typography, Spin, message, Space } from 'antd';
import ProductForm from '../../components/features/product/ProductForm';
import { getProductById, updateProduct } from '../../services/product.service';
import { IProductDetail, ProductVariant, ProductImage, IUpdateProduct } from '../../types/IProduct';

const { Title } = Typography;

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
  
  const mappedValues = {
    categoryId: product.categoryId,
    storeId: product.storeId,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    images: (product.images || []).map((img: ProductImage) => ({ 
      id: img.id, // giữ lại id
      imageUrl: img.imageUrl, 
      isMain: img.isMain 
    })),
    variants: (product.variants || []).map((v: ProductVariant) => ({
      id: v.id, // giữ lại id
      attributes: v.attributes,
      price: v.price,
      stock: v.stock
    })),
    attributesDefinition
  };
  
  console.log('Mapped product values:', mappedValues);
  return mappedValues;
}

const EditProductScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<IProductDetail | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id!);
        setProduct(data as IProductDetail);
      } catch (error) {
        message.error('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const body: IUpdateProduct = {
        id: id!,
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        basePrice: values.basePrice,
        weight: values.weight,
        width: values.width,
        length: values.length,
        height: values.height,
        storeId: values.storeId,
        variants: values.variants,
        images: values.images,
      };
      await updateProduct(id!, body);
      message.success('Cập nhật sản phẩm thành công');
      navigate(`/products/${id}`);
    } catch (error) {
      message.error('Cập nhật sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }
  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Title level={4}>Không tìm thấy sản phẩm</Title></div>;
  }

  return (
    <Space
      style={{ width: '100%', padding: '0px 20px' }}
      direction="vertical"
    >
      <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
        Chỉnh sửa sản phẩm
      </Typography>
      <div
        style={{
          backgroundColor: '#fff',
          width: '100%',
          borderRadius: 10,
          padding: '10px 20px',
          marginTop: 20,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Card
          style={{
            borderRadius: 10,
            boxShadow: 'none',
            padding: 0,
            background: 'transparent',
          }}
          loading={loading}
          bordered={false}
        >
          <ProductForm
            initialValues={mapProductToFormValues(product)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Card>
      </div>
    </Space>
  );
};

export default EditProductScreen; 