import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const getSearch = async (resource, search) => {
  try {
    console.log(resource);
    const response = await api.post(
      `${process.env.REACT_APP_API}/v1/search/${resource}?search=${search}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { data } = response.data;
    return data || [];
  } catch (error) {
    console.error(`Erro ao deletar ${resource}:`, error.message);
    throw error;
  }
};

/**
 * Essa função é responsavel por buscar no controllet VIEW da api, ela trás os dados especificos da tabela buscando pelo ID
 * @example
 *  useGetResource("querie", "controller", id)
 *
 * @param {String} queries    é a querie responsavel por armazenas os dados, usado para recarregar os dados
 * @param {String} resource   é o controller para buscar na api
 * @param {Number} search     é o  parametro de busca para busca na api
 */
export function useSearchResource(queries, resource, search, enabled) {
  return useQuery({
    queryKey: [queries, enabled],
    queryFn: () => getSearch(resource, search),
    enabled: !!enabled,
  });
}
