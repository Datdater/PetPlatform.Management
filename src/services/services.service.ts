import {IServiceDetailResponse, ServicesResponse, IServiceReview} from "../types/IServices.ts";
import { feClient } from "./clients";

const fetchServices = async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    const response = await feClient.get<ServicesResponse>('/services/my-store', {
        params: {
            PageNumber: pageIndex,
            PageSize: pageSize,
        }
    });
    return response.data;
};

const fetchService = async (serviceId: string | undefined) => {
    const response = await feClient.get(`/services/${serviceId}`);
    return response.data;
};

const fetchUpdateService = async (serviceId: string | undefined, updateBody: IServiceDetailResponse) => {
    const response = await feClient.put(`/services/${serviceId}`, updateBody);
    return response.data;
};

const fetchCreateService = async (createBody: IServiceDetailResponse) => {
    const response = await feClient.post(`/services`, createBody);
    return response.data;
}

const fetchDeleteService = async (serviceId: string | undefined) => {
    const response = await feClient.delete(`/services/${serviceId}`);
    return response.data;
}

const fetchDeleteServiceDetail = async (serviceId: string | undefined, serviceDetailId: string | undefined) => {
    const response = await feClient.delete(`/services/${serviceId}/service-details/${serviceDetailId}`);
    return response.data;
}

const fetchDeleteServiceStep = async (serviceId: string | undefined, serviceStepId: string | undefined) => {
    const response = await feClient.delete(`/services/${serviceId}/service-steps/${serviceStepId}`);
    return response.data;
}

// Lấy danh sách review của dịch vụ
export async function getServiceReviews(serviceId: string): Promise<IServiceReview[]> {
  const response = await feClient.get(`/services/${serviceId}/reviews`);
  return response.data;
}

export { fetchServices, fetchService, fetchUpdateService, fetchCreateService, fetchDeleteService, fetchDeleteServiceStep, fetchDeleteServiceDetail };
