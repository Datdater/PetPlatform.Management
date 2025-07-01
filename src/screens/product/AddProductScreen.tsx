import React from 'react';
import { Card, message } from 'antd';
import ProductForm from '../../components/features/product/ProductForm';
import { IAddProduct } from '../../types/IProduct';
import { useAddProduct } from '../../hooks/product/useAddProduct';
import { getCategories, getStores } from '../../services/product.service';

const AddProductScreen: React.FC = () => {
  const addProduct = useAddProduct();

  const handleSubmit = (values: any) => {
    // Chuyển đổi dữ liệu từ form sang IAddProduct
    const data: IAddProduct = {
      name: values.name,
      productDescription: values.description || '',
      productCategoryId: values.categoryId || '',
      brandId: values.brandId || '',
      storeId: values.storeId || '',
      isActive: values.isActive ?? true,
      weight: values.weight,
      length: values.length,
      height: values.height,
      width: values.width,
      productImages: (values.images || []).map((img: any) => ({ url: img.imageUrl })),
      productTypes: (values.attributesDefinition || []).map((attr: any) => ({
        name: attr.name,
        productTypeDetails: (attr.values || []).map((v: any) => ({ name: v.value || v }))
      })),
      productPrices: (values.variants || []).map((variant: any) => ({
        price: variant.price,
        inventory: variant.stock,
        productTypeDetails1: Object.values(variant.attributes)[0] || '',
        productTypeDetails2: Object.values(variant.attributes)[1] || ''
      })),
    };
    addProduct.mutate(data);
  };

  const categories = getCategories();
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
