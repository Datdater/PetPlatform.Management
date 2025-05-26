import { useQuery } from "@tanstack/react-query";
import { getStore } from "../../services/store.service";
import { IStore } from "../../types/IStore";

export const useFetchStore = (id: string) => {
  return useQuery<IStore, Error>({
    queryKey: ["store", id],
    queryFn: () => getStore(id),
  });
};
