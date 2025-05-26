import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { addUser } from "../../services/users.service";
import { IUser } from "../../types/IUser";

export const useAddUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (user: IUser) => addUser(user),
    onSuccess: (user: IUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users", { replace: true });
    },
  });
};
