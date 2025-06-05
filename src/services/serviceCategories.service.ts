import {IServiceCategories} from "../types/IServiceCategories.ts";
import { serviceClient } from "./clients";

export const fetchServiceCategories = async () => {
    const response = await serviceClient.get<IServiceCategories[]>(`/services/categories`);
    return response.data;
};