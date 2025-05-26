import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { addProduct } from "../../services/product.service";
import { IAddProduct } from "../../types/IProduct";
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (product: IAddProduct) => addProduct(product),
    onSuccess: (product: IAddProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products", { replace: true });
    },
  });
};
