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
  productCategoryId: string;
  name: string;
  isActive: boolean;
  productCode: string;
  views: number;
  brandId: string;
  storeId: string;
  productTypes: ProductType[];
  productPrices: ProductPrice[];
}
export interface IProduct {
  id: string;
  name: string;
  productCode: string;
  brandName: string;
  storeName: string;
  categoryName: string;
  minPrices: number;
}
export interface IProductDetail {
  id: string;
  categoryName: string;
  name: string;
  isActive: boolean;
  productDescription: string;
  views: number;
  brandName: string;
  storeName: string;
  productTypes: ProductType[];
  productPrices: ProductPrice[];
  productImages: IProductImages[];
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