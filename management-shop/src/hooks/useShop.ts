import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";

export const useShop = () => {
  const navigate = useNavigate();

  const registerShopMutation = useMutation({
    mutationFn: (formData: FormData) => authService.registerShop(formData),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return {
    registerShop: registerShopMutation.mutate,
    isLoading: registerShopMutation.isPending,
    error: registerShopMutation.error,
  };
};
