import { useQuery } from "@tanstack/react-query";
import { IUser } from "../../types/IUser";
import { fetchUsers } from "../../services/users.service";

const useFetchUsers = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers
  })
}

export default useFetchUsers;