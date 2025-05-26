import { IResponse } from "../types/IResponse";
import { IStore, IStoreAddress } from "../types/IStore";
import { client } from "./clients";

export const getAllStores = async () => {
  const response = await client.get<IResponse<IStore>>(
    "/store?PageNumber=1&PageSize=10"
  );
  return response.data;
};

export const getStore = async (id: string) => {
  const response = await client.get<IStore>(`/store/${id}`);
  return response.data;
};

export const addStore = async (store: any) => {
  const response = await client.post("/store", store);
  return response.data;
};

export const updateStore = async (store: IStore) => {
  const response = await client.put<IStore>(`/store/${store.id}`, store);
  return response.data;
};

export const deleteStore = async (id: number) => {
  const response = await client.delete<IStore>(`/store/${id}`);
  return response.data;
};

export const getStoreAddress = async () => {
  const response = await client.get<IStoreAddress[]>(`/store/addresses`);
  return response.data;
};
