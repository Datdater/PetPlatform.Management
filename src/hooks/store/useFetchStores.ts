import { useQuery } from "@tanstack/react-query";
import { getAllStores } from "../../services/store.service";
import { IResponse } from "../../types/IResponse";
import { IStore } from "../../types/IStore";

const useFetchStores = () => {
  return useQuery<IResponse<IStore>, Error>({
    queryKey: ["stores"],
    queryFn: getAllStores,
  });
};
export default useFetchStores;
