import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDeleteService, fetchDeleteServiceDetail, fetchDeleteServiceStep } from "../../services/services.service";

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceId }: { serviceId: string | undefined}) => fetchDeleteService(serviceId),
        onSuccess: (_, { serviceId }) => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            localStorage.removeItem(`serviceDetail_${serviceId}`);
        },
    });
};

export const useDeleteServiceDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceId, serviceDetailId }: { serviceId: string | undefined, serviceDetailId: string | undefined }) => fetchDeleteServiceDetail(serviceId, serviceDetailId),
        onSuccess: (_, { serviceId, serviceDetailId }) => {
            queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
            localStorage.removeItem(`serviceDetail_${serviceId}_detail_${serviceDetailId}`);
        },
    });
};

export const useDeleteServiceStep = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceId, serviceStepId }: { serviceId: string | undefined, serviceStepId: string | undefined }) => fetchDeleteServiceStep(serviceId, serviceStepId),
        onSuccess: (_, { serviceId, serviceStepId }) => {
            queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
            localStorage.removeItem(`serviceDetail_${serviceId}_step_${serviceStepId}`);
        },
    });
};