export interface IOrderDetailDTO {
  quantity: number;
  price: number;
  productVariationId: string;
  productName: string;
  pictureUrl: string;
  productId: string;
  attribute: Record<string, string>;
}

export interface IOrder {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  price: number;
  createdTime: string;
  deliveryPrice: number;
  orderDetailDTOs: IOrderDetailDTO[];
  orderStatus: string;
}

export interface IOrderResponse {
  totalCount: number;
  items: IOrder[];
  pageIndex: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
} 