import { feClient } from './clients';
import { IOrderResponse } from '../types/IOrder';

export const fetchOrders = async (storeId: string, pageIndex: number, pageSize: number) => {
  const response = await feClient.get<IOrderResponse>('/Order', {
    params: {
      StoreId: storeId,
      PageNumber: pageIndex,
      PageSize: pageSize
    }
  });
  return response.data;
};

export const confirmOrder = async (orderId: string) => {
  const response = await feClient.put(`/Order/${orderId}/confirm`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: number) => {
  const response = await feClient.put('/Order', {
    orderId: orderId,
    orderStatus: status
  });
  return response.data;
};

export const updateDeliveryTime = async (orderId: string, deliveryTime: string) => {
  const response = await feClient.put(`/Order/${orderId}/delivery-time`, { deliveryTime });
  return response.data;
}; 