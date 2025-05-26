import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { IServiceDetailResponse } from "../../types/IServices";
import { fetchService } from "../../services/services.service";

export const useFetchService = (serviceId: string | undefined): QueryObserverResult<IServiceDetailResponse, Error> => {
    return useQuery<IServiceDetailResponse, Error>({
        queryKey: ["service", serviceId],
        queryFn: () => fetchService(serviceId),
        select: (data) => {
            localStorage.setItem(`serviceDetail_${serviceId}`, JSON.stringify(data));
            return data;
        },
    });
};