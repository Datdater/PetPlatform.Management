import { useMutation, useQueryClient } from "@tanstack/react-query";
import {fetchCreateService} from "../../services/services.service";
import {IServiceDetailResponse} from "../../types/IServices.ts";
import {useNavigate} from "react-router";

export const useCreateService = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (createdService: IServiceDetailResponse) => fetchCreateService(createdService),
        onSuccess: (createdService: IServiceDetailResponse) => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            navigate("/services", { replace: true });
            console.log("Service added successfully", createdService);
        },
    });
};
