import { feClient } from './clients';

export interface IPet {
  id: string;
  name: string;
  dob: string;
  petType: boolean;
  color: string;
}

export interface IService {
  id: string;
  serviceDetailName: string;
  serviceName: string;
  price: number;
}

export interface IPetWithServices {
  pet: IPet;
  services: IService[];
}

export interface IBookingItem {
  bookingId: string;
  shopName: string;
  userName: string;
  userPhone: string;
  status: number;
  totalPrice: number;
  bookingTime: string;
  petWithServices: IPetWithServices[];
}

export interface IBookingResponse {
  totalItemsCount: number;
  pageSize: number;
  pageIndex: number;
  totalPagesCount: number;
  next: boolean;
  previous: boolean;
  items: IBookingItem[];
}

export const fetchBookings = async (
  pageIndex = 1,
  pageSize = 10,
  status?: number
): Promise<IBookingResponse> => {
  const params: any = {
    PageNumber: pageIndex,
    PageSize: pageSize,
  };
  if (status !== undefined) {
    params.Status = status;
  }
  const response = await feClient.get<IBookingResponse>(
    '/booking',
    {
      params,
    }
  );
  return response.data;
};

export const updateBookingStatus = async (id: string, bookingStatus: number) => {
  const response = await feClient.patch(`/Booking/${id}`, {
    id,
    bookingStatus
  });
  return response.data;
}; 