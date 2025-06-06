import {IServiceDetailResponse, ServicesResponse} from "../types/IServices.ts";
import { serviceClient } from "./clients";

const fetchServices = async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    const response = await serviceClient.get<ServicesResponse>('/services', {
        params: {
            PageNumber: pageIndex,
            PageSize: pageSize,
            StoreId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        }
    });
    return response.data;
};

const fetchService = async (serviceId: string | undefined) => {
    const response = await serviceClient.get(`/services/${serviceId}`);
    return response.data;
};

const fetchUpdateService = async (serviceId: string | undefined, updateBody: IServiceDetailResponse) => {
    const response = await serviceClient.put(`/services/${serviceId}`, updateBody);
    return response.data;
};

const fetchCreateService = async (createBody: IServiceDetailResponse) => {
    const response = await serviceClient.post(`/services`, createBody);
    return response.data;
}

const fetchDeleteService = async (serviceId: string | undefined) => {
    const response = await serviceClient.delete(`/services/${serviceId}`);
    return response.data;
}

const fetchDeleteServiceDetail = async (serviceId: string | undefined, serviceDetailId: string | undefined) => {
    const response = await serviceClient.delete(`/services/${serviceId}/service-details/${serviceDetailId}`);
    return response.data;
}

const fetchDeleteServiceStep = async (serviceId: string | undefined, serviceStepId: string | undefined) => {
    const response = await serviceClient.delete(`/services/${serviceId}/service-steps/${serviceStepId}`);
    return response.data;
}

export { fetchServices, fetchService, fetchUpdateService, fetchCreateService, fetchDeleteService, fetchDeleteServiceStep, fetchDeleteServiceDetail };
