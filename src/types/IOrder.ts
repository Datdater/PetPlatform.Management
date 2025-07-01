export interface IOrderDetail {
  quantity: number;
  price: number;
  productVariationId: string;
  productName: string;
  pictureUrl: string;
  productId: string;
  attribute: string;
}

export interface IOrder {
  id: string;
  storeId: string;
  price: number;
  createdTime: string;
  deliveryPrice: number;
  orderDetailDTOs: IOrderDetail[];
  orderStatus: 'Confirmed' | 'PendingPayment';
}

export interface IOrderResponse {
  totalItemsCount: number;
  pageSize: number;
  pageIndex: number;
  totalPagesCount: number;
  next: boolean;
  previous: boolean;
  items: IOrder[];
} 