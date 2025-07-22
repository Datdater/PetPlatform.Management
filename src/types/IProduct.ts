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
  variants: ProductVariantInput[];
  images: ProductImageInput[];
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
  categoryName: string;
  productImage: string;
  starAverage: number;
  reviewCount: number;
  sold: number;
}

export interface ProductVariant {
  id: string;
  attributes: {
    [key: string]: string;
  };
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
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
  width: number;
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
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  weight: number;
  width: number;
  length: number;
  height: number;
  storeId: string;
  variants: ProductVariantUpdate[];
  images: ProductImageUpdate[];
}

export interface ProductVariantInput {
  attributes: { [key: string]: string };
  price: number;
  stock: number;
}
export interface ProductVariantUpdate extends ProductVariantInput {
  id?: string; // id chỉ có khi update
}

export interface ProductImageInput {
  imageUrl: string;
  isMain: boolean;
}
export interface ProductImageUpdate extends ProductImageInput {
  id?: string; // id chỉ có khi update
}