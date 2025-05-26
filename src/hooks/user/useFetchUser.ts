import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { IUser } from "../../types/IUser";
import { fetchUser } from "../../services/users.service";

export const useFetchUser = (userId: number) : QueryObserverResult<IUser, Error> => {
  return useQuery<IUser, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId)
  })
}
