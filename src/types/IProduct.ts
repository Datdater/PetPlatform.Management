export interface ProductTypeDetail {
  name: string;
}

export interface ProductType {
  name: string;
  productTypeDetails: ProductTypeDetail[];
}

export interface ProductPrice {
  price: number;
  inventory: number;
  productTypeDetails1: string;
  productTypeDetails2: string;
}

export interface IAddProduct {
  name: string;
  productDescription: string;
  productCategoryId: string;
  brandId: string;
  storeId: string;
  isActive: boolean;
  weight: number;
  length: number;
  height: number;
  width: number;
  productImages: { url: string }[];
  productTypes: {
    name: string;
    productTypeDetails: { name: string }[];
  }[];
  productPrices: {
    price: number;
    inventory: number;
    productTypeDetails1: string;
    productTypeDetails2: string;
  }[];
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  storeId: string;
  storeName: string;
  storeLogoUrl: string;
  storeProvince: string;
  storeDistrict: string;
  storeWard: string;
  storeStreet: string;
  categoryId: string;
  productImage: string;
  starAverage: number;
  reviewCount: number;
  sold: number;
}

export interface ProductVariant {
  attributes: {
    [key: string]: string;
  };
  price: number;
  stock: number;
}

export interface ProductImage {
  imageUrl: string;
  isMain: boolean;
}

export interface IProductDetail {
  id: string;
  name: string;
  description: string;
  storeId: string;
  storeName: string;
  storeUrl: string | null;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  weight: number;
  length: number;
  height: number;
  sold: number;
  starAverage: number;
  reviewCount: number;
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: any | null;
}

export interface IProductImages {
  id: string;
  url: string;
}

export interface IUpdateProduct {
  id: string;
  productCategoryId: string;
  name: string;
  isActive: boolean;
  productDescription: string;
  views: number;
  brandId: string;
  storeId: string;
  productTypes: ProductType[];
  productPrices: ProductPrice[];
}