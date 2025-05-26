import { useQuery } from "@tanstack/react-query";
import {ServicesResponse} from "../../types/IServices";
import { fetchServices } from "../../services/services.service";

const useFetchServices = ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    return useQuery<ServicesResponse, Error>({
        queryKey: ["services", pageIndex, pageSize],
        queryFn: () => fetchServices({ pageIndex, pageSize }),
    });
};

export default useFetchServices;