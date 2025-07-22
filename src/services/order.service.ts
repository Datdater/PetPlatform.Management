import { feClient } from './clients';
import { IOrderResponse } from '../types/IOrder';

export const fetchOrders = async (pageIndex: number, pageSize: number) => {
  const response = await feClient.get<IOrderResponse>('/Orders', {
    params: {
      PageNumber: pageIndex,
      PageSize: pageSize
    }
  });
  return response.data;
};

export const confirmOrder = async (orderId: string) => {
  const response = await feClient.put(`/Orders/${orderId}/confirm`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: number) => {
  const response = await feClient.put(`/Orders/${orderId}`, {
    orderId: orderId,
    enumOrderStatus: status
  });
  return response.data;
};
