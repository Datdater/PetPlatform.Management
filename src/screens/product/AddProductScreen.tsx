import React from 'react';
import { Card, message } from 'antd';
import ProductForm from '../../components/features/product/ProductForm';
import { IAddProduct } from '../../types/IProduct';
import { useAddProduct } from '../../hooks/product/useAddProduct';
import { getCategories, getStores } from '../../services/product.service';

const AddProductScreen: React.FC = () => {
  const { mutate: addProduct, isPending } = useAddProduct();

  const handleSubmit = async (values: IAddProduct) => {
    try {
      await addProduct(values);
      message.success('Product added successfully');
    } catch (error) {
      message.error('Failed to add product');
    }
  };

  const categories = getCategories();
  const stores = getStores();

  return (
    <div className="p-6">
      <Card title="Add New Product" loading={isPending}>
        <ProductForm
          onSubmit={handleSubmit}
          categories={categories}
          stores={stores}
        />
      </Card>
    </div>
  );
};

export default AddProductScreen;
