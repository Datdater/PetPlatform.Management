import {IServiceDetailResponse, ServicesResponse} from "../types/IServices.ts";
import { client } from "./clients";

const fetchServices = async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    const response = await client.get<ServicesResponse>(`/services?PageNumber=${pageIndex}&PageSize=${pageSize}`);
    return response.data;
};

const fetchService = async (serviceId: string | undefined) => {
    const response = await client.get(`/services/${serviceId}`);
    return response.data;
};

const fetchUpdateService = async (serviceId: string | undefined, updateBody: IServiceDetailResponse) => {
    const response = await client.put(`/services/${serviceId}`, updateBody);
    return response.data;
};

const fetchCreateService = async (createBody: IServiceDetailResponse) => {
    const response = await client.post(`/services`, createBody);
    return response.data;
}

const fetchDeleteService = async (serviceId: string | undefined) => {
    const response = await client.delete(`/services/${serviceId}`);
    return response.data;
}

const fetchDeleteServiceDetail = async (serviceId: string | undefined, serviceDetailId: string | undefined) => {
    const response = await client.delete(`/services/${serviceId}/service-details/${serviceDetailId}`);
    return response.data;
}

const fetchDeleteServiceStep = async (serviceId: string | undefined, serviceStepId: string | undefined) => {
    const response = await client.delete(`/services/${serviceId}/service-steps/${serviceStepId}`);
    return response.data;
}

export { fetchServices, fetchService, fetchUpdateService, fetchCreateService, fetchDeleteService, fetchDeleteServiceStep, fetchDeleteServiceDetail };
