import {IServiceCategories} from "../types/IServiceCategories.ts";
import { client } from "./clients";

export const fetchServiceCategories = async () => {
    const response = await client.get<IServiceCategories[]>("/service-categories");
    return response.data;
};