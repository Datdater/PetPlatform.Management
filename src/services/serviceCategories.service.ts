import {IServiceCategories} from "../types/IServiceCategories.ts";
import { feClient } from "./clients";

export const fetchServiceCategories = async () => {
    const response = await feClient.get<IServiceCategories[]>(`/services/categories`);
    return response.data;
};