import { useQuery } from "@tanstack/react-query";
import { IServiceCategories } from "../../types/IServiceCategories";
import { fetchServiceCategories } from "../../services/serviceCategories.service";

const useFetchServiceCategories = () => {
    return useQuery<IServiceCategories[], Error>({
        queryKey: ["serviceCategories"],
        queryFn: fetchServiceCategories
    });
};

export default useFetchServiceCategories;

