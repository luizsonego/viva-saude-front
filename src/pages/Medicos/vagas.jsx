import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useGetResourceProps } from "../../hooks/get/useGet.query";

function Vagas() {
  // Data de hoje no formato yyyy-MM-dd
  const today = new Date().toISOString().slice(0, 10);
  // Estado do input de data e do filtro de busca
  const [dataInput, setDataInput] = useState(today);
  const [dataBusca, setDataBusca] = useState(today);
  const [medicoId, setMedicoId] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  // Busca na API
  const { data: vagas, isLoading, error, refetch } = useGetResourceProps(
    "vagas",
    "vagas-disponiveis-medicos",
    `data=${dataBusca}`,
    shouldFetch
  );

  // Função para realizar a busca
  const handleBuscar = async () => {
    console.log('Data Input:', dataInput);
    // Primeiro atualiza a data de busca
    setDataBusca(dataInput);
    // Força uma nova busca com a data atualizada
    setShouldFetch(true);
    // Aguarda um momento para garantir que o estado foi atualizado
    await new Promise(resolve => setTimeout(resolve, 0));
    // Refaz a busca
    refetch();
  };

  // Lista de médicos únicos para o select (sem duplicidade)
  const medicosUnicos = React.useMemo(() => {
    if (!vagas?.medicos) return [];
    const seen = new Set();
    return vagas.medicos
      .map((m) => m.medico)
      .filter((med) => {
        if (!med || seen.has(med.id)) return false;
        seen.add(med.id);
        return true;
      });
  }, [vagas]);

  // Resetar filtro de médico se o médico selecionado não estiver mais disponível
  useEffect(() => {
    if (medicoId && !medicosUnicos.some((m) => String(m.id) === String(medicoId))) {
      setMedicoId("");
    }
  }, [medicosUnicos, medicoId]);

  // Filtragem
  const vagasFiltradas = vagas?.medicos
    ? vagas.medicos.filter((item) => {
      if (medicoId) {
        return String(item.medico.id) === String(medicoId);
      }
      return true;
    })
    : [];

  // Debug logs
  useEffect(() => {
    console.log('Data Busca:', dataBusca);
    console.log('Vagas:', vagas);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
  }, [dataBusca, vagas, isLoading, error]);

  // Formatar data para exibição
  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6">
        Buscar Vagas Disponíveis
      </Typography>
      <Card className="mb-8 p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <Typography variant="h6">Data</Typography>
          <Input
            type="date"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <Typography variant="h6">Médico</Typography>
          <Select
            label="Selecione o médico (opcional)"
            value={medicoId}
            onChange={setMedicoId}
            className="w-full"
            disabled={isLoading || !medicosUnicos.length}
          >
            <Option value="">Todos</Option>
            {medicosUnicos.map((med) => (
              <Option key={med.id} value={med.id}>
                {med.nome} - {med.especialidade}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col justify-end w-full md:w-1/6 mt-4 md:mt-0">
          <Button
            color="blue"
            onClick={handleBuscar}
            className="w-full"
            disabled={isLoading}
            style={{ marginTop: '30px' }}
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : "Buscar"}
          </Button>
        </div>
      </Card>

      {/* Título com a data atual da busca */}
      <Typography variant="h5" className="mb-4 text-center">
        Vagas disponíveis para {formatarData(dataBusca)}
      </Typography>

      {/* Listagem de vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <Card className="col-span-full p-6 text-center">
            <Spinner className="mx-auto" />
            <Typography variant="h6" className="mt-2">Carregando vagas...</Typography>
          </Card>
        ) : error ? (
          <Card className="col-span-full p-6 text-center bg-red-50">
            <Typography variant="h6" color="red">Erro ao buscar vagas.</Typography>
            <Typography variant="small" color="red" className="mt-2">
              {error.message || "Tente novamente mais tarde."}
            </Typography>
          </Card>
        ) : vagasFiltradas.length === 0 ? (
          <Card className="col-span-full p-6 text-center">
            <Typography variant="h6">Nenhuma vaga encontrada para os filtros selecionados.</Typography>
          </Card>
        ) : (
          vagasFiltradas.map((item) => (
            <Card key={item.medico.id} className="shadow-md">
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h6" className="font-bold">
                    {item.medico.nome}
                  </Typography>
                  <Chip
                    value={item.medico.especialidade}
                    color="blue-gray"
                    className="text-xs px-2 py-1"
                  />
                </div>
                <div className="mb-2">
                  <Typography variant="small" color="gray">
                    Locais de atendimento:
                  </Typography>
                  {item.locais.map((local) => (
                    <div
                      key={local.local_id}
                      className="border rounded p-2 my-2 bg-blue-gray-50"
                    >
                      <Typography variant="small" className="font-semibold">
                        {local.local_nome}
                      </Typography>
                      <div className="flex gap-4 mt-1">
                        <div>
                          <span className="font-medium">Consultas:</span>{" "}
                          <span className="text-blue-700 font-bold">
                            {local.vagas_consulta.disponiveis}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /{local.vagas_consulta.total}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Retornos:</span>{" "}
                          <span className="text-green-700 font-bold">
                            {local.vagas_retorno.disponiveis}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /{local.vagas_retorno.total}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Procedimentos:</span>{" "}
                          <span className="text-purple-700 font-bold">
                            {local.vagas_procedimento.disponiveis}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /{local.vagas_procedimento.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Vagas;
