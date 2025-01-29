import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

const deleteResource = async (resource, id) => {
  try {
    const response = await api.post(
      `${process.env.REACT_APP_API}/v1/delete/${resource}?id=${id}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error(`Erro ao deletar ${resource}:`, error.message);
    throw error;
  }
};

export const useDeleteMutation = (queries, resource) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteResource(resource, id),
    onSuccess: () => {
      console.log(resource);
      queryClient.invalidateQueries({ queryKey: [queries] });
    },
  });
};
