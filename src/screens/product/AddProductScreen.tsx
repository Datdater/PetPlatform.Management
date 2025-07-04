import React from 'react';
import { Card, message } from 'antd';
import ProductForm from '../../components/features/product/ProductForm';
import { IAddProduct } from '../../types/IProduct';
import { useAddProduct } from '../../hooks/product/useAddProduct';
import { getStores } from '../../services/product.service';

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

  const stores = getStores();

  return (
    <div className="p-6">
      <Card title="Add New Product" loading={addProduct.isPending}>
        <ProductForm
          onSubmit={handleSubmit}
          initialValues={{}}
        />
      </Card>
    </div>
  );
};

export default AddProductScreen;
