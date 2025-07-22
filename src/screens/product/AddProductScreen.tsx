import React from 'react';
import { Card, message, Typography, Space } from 'antd';
import ProductForm from '../../components/features/product/ProductForm';
import { IAddProduct } from '../../types/IProduct';
import { useAddProduct } from '../../hooks/product/useAddProduct';

const AddProductScreen: React.FC = () => {
  const addProduct = useAddProduct();

  const handleSubmit = (values: any) => {
    // Chuyển đổi dữ liệu từ form sang IAddProduct
    const data = {
      categoryId: values.categoryId,
      name: values.name,
      description: values.description,
      basePrice: values.basePrice,
      weight: values.weight,
      length: values.length,
      width: values.width,
      height: values.height,
      variants: (values.variants || []).map((variant: any) => ({
        attributes: variant.attributes,
        price: variant.price,
        stock: variant.stock
      })),
      images: (values.images || []).map((img: any) => ({ imageUrl: img.imageUrl, isMain: img.isMain })),
    };
    addProduct.mutate(data as any);
  };

  return (
    <Space
      style={{ width: '100%', padding: '0px 20px' }}
      direction="vertical"
    >
      <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
        Tạo mới sản phẩm
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
          loading={addProduct.isPending}
          bordered={false}
        >
          <ProductForm
            onSubmit={handleSubmit}
            initialValues={{}}
          />
        </Card>
      </div>
    </Space>
  );
};

export default AddProductScreen;
