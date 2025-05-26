import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { addStore } from "../../services/store.service";

export const useAddStore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (store) => addStore(store),
    onSuccess: () => {
      navigate("/stores", { replace: true });

      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: (error) => {
      console.log("Add store failed", error);
    },
  });
};
