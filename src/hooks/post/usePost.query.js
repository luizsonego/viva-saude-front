import api from "../../services/api";

const postGroups = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/grupo`,
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

const postPrioridade = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/prioridade`,
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

const postAcoes = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/acoes`,
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

const postUnidades = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/unidade`,
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

const postOrigem = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/origem`,
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

const postEtiqueta = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/create/etiqueta`,
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

export function useGroupPost(data) {
  return postGroups(data);
}

export function useMedicoPost(data) {
  return postMedico(data);
}

export function usePrioridadePost(data) {
  return postPrioridade(data);
}

export function useAcoesPost(data) {
  return postAcoes(data);
}

export function useUnidadesPost(data) {
  return postUnidades(data);
}

export function useOrigemPost(data) {
  return postOrigem(data);
}

export function useEtiquetaPost(data) {
  return postEtiqueta(data);
}

export function useAtendentePost(data) {
  return postAtendente(data);
}

export function useAtendimentoPost(data) {
  return postAtendimento(data);
}
