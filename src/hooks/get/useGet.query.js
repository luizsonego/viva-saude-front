import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const getAtendimentos = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/atendimentos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getGrupos = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/grupos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getEtiquetas = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/etiquetas`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getMedicos = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/medicos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getPrioridades = async () => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/prioridade`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getAcoes = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/acoes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getUnidades = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/unidades`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getMedico = async (values) => {
  try {
    const { data } = await api.get(
      `${process.env.REACT_APP_API}/v1/get/medico?id=${values}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

const getOrigem = async (values) => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/origem`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getAtendente = async () => {
  try {
    const request = await api.patch(
      `${process.env.REACT_APP_API}/v1/get/atendente`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    const { data } = request.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useAtendimentosFetch() {
  return useQuery({
    queryKey: ["atendimentos"],
    queryFn: getAtendimentos,
  });
}

export function useGruposFetch() {
  return useQuery({
    queryKey: ["grupos"],
    queryFn: getGrupos,
  });
}

export function useEtiquetasFetch() {
  return useQuery({
    queryKey: ["etiquetas"],
    queryFn: getEtiquetas,
  });
}

export function useMedicosFetch() {
  return useQuery({
    queryKey: ["medicos"],
    queryFn: getMedicos,
  });
}

export function usePrioridadesFetch() {
  return useQuery({
    queryKey: ["prioridades"],
    queryFn: getPrioridades,
  });
}

export function useAcoesFetch() {
  return useQuery({
    queryKey: ["acoes"],
    queryFn: getAcoes,
  });
}

export function useUnidadesFetch() {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: getUnidades,
  });
}

export function useOrigemFetch() {
  return useQuery({
    queryKey: ["origem"],
    queryFn: getOrigem,
  });
}

export function useAtendenteFetch() {
  return useQuery({
    queryKey: ["atendentes"],
    queryFn: getAtendente,
  });
}

export function useMedicoFetch(id) {
  return useQuery({
    queryKey: ["medico", id],
    queryFn: () => getMedico(id),
  });
}
