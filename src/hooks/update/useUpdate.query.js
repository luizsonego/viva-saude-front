import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

const updateResource = async (resource, data) => {
  try {
    const response = await api.post(
      `${process.env.REACT_APP_API}/v1/update/${resource}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar ${resource}:`, error.message);
    throw error;
  }
};

/**
 *
 * @param {String} queries
 * @param {String} resource
 * @param {Function} onSuccessCallback
 * @returns
 */
export const useResourcePut = (queries, resource, onSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateResource(resource, data),
    onSuccess: (data) => {
    // Invalidar a query específica para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: [queries] });

      // Atualizar o cache com os novos dados se disponíveis
      if (data?.data?.data) {
        queryClient.setQueryData([queries], data.data.data);
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error(`Erro ao atualizar ${resource}:`, error);
      // Não invalidar o cache em caso de erro para manter os dados antigos
    }
  });
};

const putAgendamento = async (values) => {
  console.log("ENVIANDO: ", values);
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/update/agendamento`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useUpdateAgendamento(data) {
  return putAgendamento(data);
}
