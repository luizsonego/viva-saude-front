import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

const postResource = async (resource, data) => {
  console.log(resource, data);
  try {
    const response = await api.post(
      `${process.env.REACT_APP_API}/v1/create/${resource}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error(`Erro ao criar ${resource}:`, error.message);
    throw error;
  }
};

export const useResourcePost = (queries, resource, onSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => postResource(resource, data),
    onSuccess: () => {
      console.log(resource);
      queryClient.invalidateQueries({ queryKey: [queries] });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

const postMedico = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/medico`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const postAtendente = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/atendente`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const postAtendimento = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/atendimento`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useMedicoPost(data) {
  return postMedico(data);
}

// export function usePrioridadePost(data) {
//   return postPrioridade(data);
// }

// export function useAcoesPost(data) {
//   return postAcoes(data);
// }

// export function useUnidadesPost(data) {
//   return postUnidades(data);
// }

// export function useOrigemPost(data) {
//   return postOrigem(data);
// }

// export function useEtiquetaPost(data) {
//   return postEtiqueta(data);
// }

export function useAtendentePost(data) {
  return postAtendente(data);
}

export function useAtendimentoPost(data) {
  return postAtendimento(data);
}
