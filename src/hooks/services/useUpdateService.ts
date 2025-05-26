import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUpdateService } from "../../services/services.service";
import {IServiceDetailResponse} from "../../types/IServices.ts";

export const useUpdateService = (serviceId: string | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updateBody: IServiceDetailResponse) => fetchUpdateService(serviceId, updateBody),
        onSuccess: (updatedService: IServiceDetailResponse) => {
            queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
            localStorage.removeItem(`serviceDetail_${serviceId}`);
            console.log("Service updated successfully", updatedService);
        },
    });
};
