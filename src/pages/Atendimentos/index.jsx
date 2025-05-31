import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Select, Option, Chip, Input } from "@material-tailwind/react";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import {
  useAtendimentosFetch,
  useGetResources,
} from "../../hooks/get/useGet.query";
import { useResourcePut } from "../../hooks/update/useUpdate.query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CustomModal } from "../Configuracoes/Components";
import EditAtendimentoDadosPessoais from "./edits/dadosPessoais";
import EditAtendimentoDadosMedicos from "./edits/dadosMedicos";
import CustomTimeline from "./timeline";
import AddComentario from "./edits/comentario";
import Upload from "../../components/uploads";
import { formatarDataBr } from "../../helpers";
import { formatarDataBrHora } from "../../helpers/formatarDataBr";
// import { toast } from "react-toastify";

// Constantes para tipos de arquivo permitidos e tamanho máximo
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const classThTable =
  "py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400";
const class2ThTable =
  "border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400";
const classTdTable = "py-3 px-5 border-b border-blue-gray-50 ";

const Atendimentos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);
  const [openModalMedicos, setOpenModalMedicos] = useState(false);
  const [openModalTimeLine, setOpenModalTimeLine] = useState(false);
  const [openModalComentario, setOpenModalComentario] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  
  // Get status from URL or use default
  const statusFromUrl = searchParams.get("status") || "ABERTO";
  const [statusSelecionado, setStatusSelecionado] = useState(statusFromUrl);
  
  // Get pagination from URL or use defaults
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const pageSizeFromUrl = parseInt(searchParams.get("pageSize")) || 20;
  
  const [filtros, setFiltros] = useState({
    prioridade: searchParams.get("prioridade") || "",
    medico: searchParams.get("medico") || "",
    local: searchParams.get("local") || "",
    cliente: searchParams.get("cliente") || "",
    atendente: searchParams.get("atendente") || "",
    dataInicio: searchParams.get("dataInicio") || "",
    dataFim: searchParams.get("dataFim") || "",
    procedimento: searchParams.get("procedimento") || "",
    convenio: searchParams.get("convenio") || "",
    especialidade: searchParams.get("especialidade") || ""
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: pageFromUrl,
    pageSize: pageSizeFromUrl,
    total: 0,
    totalPages: 0
  });

  // Add debounce for cliente filter
  const [clienteInput, setClienteInput] = useState(filtros.cliente);
  const [isSearching, setIsSearching] = useState(false);

  const handleFiltroChange = useCallback((key, value) => {
    console.log(`Alterando filtro ${key} para:`, value);
    
    setFiltros(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL with filter
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.set("page", "1"); // Reset to first page
      return newParams;
    });
  }, [setSearchParams]);
  
  // Debounce cliente filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (clienteInput !== filtros.cliente) {
        setIsSearching(true);
        handleFiltroChange('cliente', clienteInput);
      }
    }, 500); // Aumentado para 500ms para reduzir chamadas à API
    
    return () => clearTimeout(timer);
  }, [clienteInput, handleFiltroChange, filtros.cliente]);

  // Otimizar as chamadas de API com staleTime e cacheTime
  const { data, isLoading, error, refetch } = useAtendimentosFetch({
    page: pagination.page,
    pageSize: pagination.pageSize,
    status: statusSelecionado !== "TODOS" && statusSelecionado !== "ABERTOS" ? statusSelecionado : "",
    ...filtros
  }, {
    staleTime: 30000, // 30 segundos
    cacheTime: 300000, // 5 minutos
  });

  // Reset searching state when data is loaded
  useEffect(() => {
    if (!isLoading) {
      setIsSearching(false);
    }
  }, [isLoading]);

  // Update pagination when data changes
  useEffect(() => {
    if (data?.pagination) {
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    }
  }, [data]);

  // Update filters and pagination when URL changes
  useEffect(() => {
    const status = searchParams.get("status") || "ABERTO";
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 20;
    
    // Update status if changed
    if (status !== statusSelecionado) {
      setStatusSelecionado(status);
    }
    
    // Update pagination if changed
    if (page !== pagination.page || pageSize !== pagination.pageSize) {
      setPagination(prev => ({
        ...prev,
        page,
        pageSize
      }));
    }
    
    // Update filters if changed
    const newFiltros = {
      prioridade: searchParams.get("prioridade") || "",
      medico: searchParams.get("medico") || "",
      local: searchParams.get("local") || "",
      cliente: searchParams.get("cliente") || "",
      atendente: searchParams.get("atendente") || "",
      dataInicio: searchParams.get("dataInicio") || "",
      dataFim: searchParams.get("dataFim") || "",
      procedimento: searchParams.get("procedimento") || "",
      // convenio: searchParams.get("convenio") || "",
      especialidade: searchParams.get("especialidade") || ""
    };
    
    // Check if any filter has changed
    const hasFilterChanged = Object.keys(newFiltros).some(
      key => newFiltros[key] !== filtros[key]
    );
    
    if (hasFilterChanged) {
      setFiltros(newFiltros);
      setClienteInput(newFiltros.cliente);
    }
  }, [searchParams, statusSelecionado, pagination.page, pagination.pageSize, filtros]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Update URL with page
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  }, [setSearchParams]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    
    // Update URL with pageSize and reset page
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("pageSize", newPageSize.toString());
      newParams.set("page", "1");
      return newParams;
    });
  }, [setSearchParams]);

  const { data: prioridadeData } = useGetResources("prioridades", "prioridade");
  const { data: atendenteData } = useGetResources("atendentes", "atendente");
  const { data: medicoData } = useGetResources("medico", "medicos");
  const { data: locaisData } = useGetResources("locais", "onde-ser-atendido");
  const { data: procedimentosData } = useGetResources("procedimentos", "procedimentos");
  // const { data: conveniosData } = useGetResources("convenios", "convenios");
  const { data: especialidadesData } = useGetResources("especialidades", "especialidade");

  // Adicionar log para debug dos convênios
  // useEffect(() => {
  //   console.log("Dados dos convênios:", conveniosData);
  // }, [conveniosData]);

  // Adicionar verificações de loading
  const isResourcesLoading = !prioridadeData || !atendenteData || !medicoData || !locaisData || 
                           !procedimentosData  || !especialidadesData;

  const { mutateAsync: mutateStatus, isPending: isPendingStatus } = useResourcePut(
    "atendimentos",
    "troca-status",
    {
      onSuccess: () => {
        // Atualizar os dados após a mudança de status
        refetch();
      }
    }
  );

  const { mutateAsync: mutatePrioridade, isPending: isPendingPrioridade } =
    useResourcePut("atendimentos", "troca-prioridade", {
      onSuccess: () => {
        // Atualizar os dados após a mudança de prioridade
        refetch();
      }
    });

  const { mutateAsync: mutateAtendente, isPending: isPendingAtendente } =
    useResourcePut("atendimentos", "troca-atendente", {
      onSuccess: () => {
        // Atualizar os dados após a mudança de atendente
        refetch();
      }
    });

  // No need to filter data client-side anymore as it's done on the server
  const atendimentosFiltrados = useMemo(() => {
    console.log("Dados recebidos da API:", data);
    return data?.items || [];
  }, [data]);

  const handleOpenModalConsulta = useCallback((item) => {
    if (!item) return;
    setDataModal(item);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    // Limpar os dados do modal ao fechar
    setTimeout(() => {
      setDataModal(null);
    }, 300); // Aguardar a animação de fechamento do modal
  }, []);

  const handleChangeAtendenteCartao = useCallback(async ({ id, atendente }) => {
    if (!id || !atendente) {
      // toast.error("Dados inválidos para atualização do atendente");
      return;
    }
    try {
      await mutateAtendente({ id, atendente });
    } catch (error) {
      console.error("Erro ao atualizar atendente:", error);
    }
  }, [mutateAtendente]);

  const handleChangePrioridadeCartao = useCallback(async ({ id, prioridade }) => {
    if (!id || !prioridade) {
      // toast.error("Dados inválidos para atualização da prioridade");
      return;
    }
    try {
      await mutatePrioridade({ id, prioridade });
    } catch (error) {
      console.error("Erro ao atualizar prioridade:", error);
    }
  }, [mutatePrioridade]);

  const handleChangeStatusCartao = useCallback(async ({ id, status }) => {
    if (!id || !status) {
      // toast.error("Dados inválidos para atualização do status");
      return;
    }
    try {
      await mutateStatus({ id, status });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }, [mutateStatus]);

  const handleViewCartao = useCallback((resource, id) => {
    if (!resource || !id) return;
    // Limpar o estado antes de navegar
    setDataModal(null);
    navigate(`ver/${resource}/${id}`);
  }, [navigate]);

  const handleUpload = useCallback((file) => {
    if (!file) return;
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      // toast.error("Tipo de arquivo não permitido");
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      // toast.error("Arquivo muito grande. Tamanho máximo: 5MB");
      return false;
    }
    
    return true;
  }, []);

  // Update status in URL when it changes
  const handleStatusChange = useCallback((status) => {
    setStatusSelecionado(status);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("status", status);
      newParams.set("page", "1"); // Reset to page 1 when status changes
      return newParams;
    });
    // Reset to first page when status changes
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [setSearchParams]);

  const handleClearFilters = useCallback(() => {
    setFiltros({
      prioridade: "",
      medico: "",
      local: "",
      cliente: "",
      atendente: "",
      dataInicio: "",
      dataFim: "",
      procedimento: "",
      convenio: "",
      especialidade: ""
    });
    setClienteInput("");
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("prioridade");
      newParams.delete("medico");
      newParams.delete("local");
      newParams.delete("cliente");
      newParams.delete("atendente");
      newParams.delete("dataInicio");
      newParams.delete("dataFim");
      newParams.delete("procedimento");
      newParams.delete("convenio");
      newParams.delete("especialidade");
      newParams.set("page", "1");
      return newParams;
    });
  }, [setSearchParams]);

  // Limpar o estado quando o componente for desmontado
  useEffect(() => {
    return () => {
      setDataModal(null);
      setOpenModal(false);
    };
  }, []);

  // Função para depuração
  const debugParams = useCallback(() => {
    console.log("Parâmetros atuais:", {
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: statusSelecionado !== "TODOS" && statusSelecionado !== "ABERTOS" ? statusSelecionado : "",
      ...filtros
    });
    
    // Forçar uma nova busca
    refetch();
  }, [pagination.page, pagination.pageSize, statusSelecionado, filtros, refetch]);

  if (isResourcesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography color="red" variant="h6">
          Erro ao carregar atendimentos: {error.message}
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-12">
        <div className="flex justify-between md:items-center">
          <div className="mt-1 mb-5 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full">
            <Link to={"create"}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="indigo"
                aria-label="Criar novo cartão de atendimento"
              >
                Criar Cartão
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            {Object.values(filtros).some(value => value) && (
              <Button
                variant="text"
                color="red"
                className="flex items-center gap-2"
                onClick={handleClearFilters}
                aria-label="Limpar todos os filtros"
              >
                <i className="fas fa-times-circle"></i>
                Limpar Filtros
              </Button>
            )}
            {/* <Button
              variant="text"
              color="blue"
              className="flex items-center gap-2"
              onClick={debugParams}
              aria-label="Depurar parâmetros"
            >
              <i className="fas fa-bug"></i>
              Depurar
            </Button> */}
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {[
          "TODOS",
          "AGUARDANDO VAGA",
          "FILA DE ESPERA",
          "ABERTO",
          "EM ANALISE",
          "AGUARDANDO AUTORIZACAO",
          "AGUARDANDO PAGAMENTO",
          "PAGAMENTO EFETUADO",
          "CONCLUIDO",
          "INATIVIDADE",
        ].map((status) => (
          <Button
            key={status}
            className={`px-4 py-2 border rounded transition-colors duration-200 ${
              statusSelecionado === status 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleStatusChange(status)}
            aria-pressed={statusSelecionado === status}
          >
            {status}
          </Button>
        ))}
      </div>

      <Card className="mt-5">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between"
        >
          <Typography variant="h6" color="white">
            Atendimentos
          </Typography>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <Select
            label="Prioridade"
            value={filtros.prioridade}
            onChange={(value) => {
              console.log("Valor da prioridade selecionada:", value);
              handleFiltroChange('prioridade', value);
            }}
            className="border p-2 rounded"
          >
            <Option value="">Todas Prioridades</Option>
            {Array.isArray(prioridadeData) && prioridadeData.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.nome}
              </Option>
            ))}
          </Select>

          <Select
            label="Médico"
            value={filtros.medico}
            onChange={(value) => {
              console.log("Valor do médico selecionado:", value);
              handleFiltroChange('medico', value);
            }}
            className="border p-2 rounded"
          >
            <Option value="">Todos Médicos</Option>
            {Array.isArray(medicoData) && medicoData.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.nome || item?.nome_medico}
              </Option>
            ))}
          </Select>

          <Select
            label="Local"
            value={filtros.local}
            onChange={(value) => {
              console.log("Valor do local selecionado:", value);
              handleFiltroChange('local', value);
            }}
            className="border p-2 rounded"
          >
            <Option value="">Todos Locais</Option>
            {Array.isArray(locaisData) && locaisData.map((item) => (
              <Option
                key={item?.onde_deseja_ser_atendido}
                value={item?.onde_deseja_ser_atendido}
              >
                {item?.onde_deseja_ser_atendido}
              </Option>
            ))}
          </Select>

          <Select
            label="Atendente"
            value={filtros.atendente}
            onChange={(value) => {
              console.log("Valor do atendente selecionado:", value);
              handleFiltroChange('atendente', value);
            }}
            className="border p-2 rounded"
          >
            <Option value="">Todos Atendentes</Option>
            {Array.isArray(atendenteData) && atendenteData.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.profile?.name}
              </Option>
            ))}
          </Select>

           <Input
            label="Filtrar Cliente"
            value={clienteInput}
            onChange={(e) => {
              const value = e.target.value;
              setClienteInput(value);
            }}
            placeholder="Nome, CPF ou procedimento"
            className="border p-2 rounded"
            icon={isSearching ? <Spinner className="h-4 w-4" /> : <i className="fas fa-search" />}
          />
            {/*

          <Input
            type="date"
            label="Data Início"
            value={filtros.dataInicio}
            onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
            className="border p-2 rounded"
          />

          <Input
            type="date"
            label="Data Fim"
            value={filtros.dataFim}
            onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
            className="border p-2 rounded"
          /> */}

          {/* <Select
            label="Procedimento"
            value={filtros.procedimento}
            onChange={(value) => handleFiltroChange('procedimento', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todos Procedimentos</Option>
            {Array.isArray(procedimentosData) && procedimentosData.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select> */}

          {/* <Select
            label="Convênio"
            value={filtros.convenio}
            onChange={(value) => handleFiltroChange('convenio', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todos Convênios</Option>
            {Array.isArray(conveniosData) && conveniosData.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.nome}
              </Option>
            ))}
          </Select> */}

          {/* <Select
            label="Especialidade"
            value={filtros.especialidade}
            onChange={(value) => handleFiltroChange('especialidade', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todas Especialidades</Option>
            {Array.isArray(especialidadesData) && especialidadesData.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.nome}
              </Option>
            ))}
          </Select> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={classThTable}>Titular</th>
                <th className={classThTable}>Procedimento</th>
                <th className={classThTable}>Prioridade</th>
                <th className={classThTable}>Médico</th>
                <th className={classThTable}>Local</th>
                <th className={classThTable}>Status</th>
                <th className={classThTable}>Atendimento</th>
                <th className={classThTable}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atendimentosFiltrados.length > 0 ? (
                atendimentosFiltrados.map((item) => (
                  <tr
                    key={item?.id}
                    className={`${
                      item?.temporizador?.em_atraso
                        ? "text-gray-100 bold"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      background:
                      item?.temporizador?.em_atraso 
                      && "red"
                    }}
                  >
                    <td className={classTdTable}>{item?.titular_plano}</td>
                    <td className={classTdTable}>{item?.o_que_deseja}</td>
                    <td className={classTdTable} style={{
                          backgroundColor: item?.prioridadeAtendimentos?.cor || "transparent"
                        }}>
                      <Chip
                        value={item?.prioridadeAtendimentos?.nome}
                        className="w-fit"
                        style={{
                          backgroundColor: item?.prioridadeAtendimentos?.cor || "transparent"
                        }}
                      />
                    </td>
                    <td className={classTdTable}>{item?.medico_atendimento}</td>
                    <td className={classTdTable}>{item?.onde_deseja_ser_atendido}</td>
                    <td className={classTdTable}>{item?.status}</td>
                    <td className={classTdTable}>
                      {formatarDataBrHora(item?.medico_atendimento_data)}
                    </td>
                    <td className={classTdTable}>
                      <Button
                        onClick={() => handleViewCartao("atendimento", item?.id)}
                        variant="text"
                        className="text-blue-500 hover:text-blue-700"
                        aria-label={`Ver detalhes do atendimento ${item?.id}`}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    {isSearching ? (
                      <div className="flex justify-center items-center">
                        <Spinner className="h-6 w-6 mr-2" />
                        <span>Buscando atendimentos...</span>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">Nenhum atendimento encontrado</p>
                        {Object.values(filtros).some(value => value) && (
                          <Button
                            variant="text"
                            color="blue"
                            onClick={handleClearFilters}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center">
            <span className="mr-2">Itens por página:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">
              {pagination.total > 0 
                ? `${(pagination.page - 1) * pagination.pageSize + 1} - ${Math.min(pagination.page * pagination.pageSize, pagination.total)} de ${pagination.total}`
                : 'Nenhum resultado'}
            </span>
            
            <div className="flex">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`px-3 py-1 mx-1 rounded ${
                  pagination.page <= 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Anterior
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className={`px-3 py-1 mx-1 rounded ${
                  pagination.page >= pagination.totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </Card>

      {dataModal && (
        <Dialog
          open={openModal}
          handler={handleCloseModal}
          size="lg"
          className="overflow-y-auto"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogHeader>
            Detalhes do Atendimento
            {dataModal.em_espera && (
              <Chip
                value="Em fila de espera"
                className="ml-4"
                color="amber"
              />
            )}
          </DialogHeader>
          <DialogBody>
            {/* Conteúdo do modal aqui */}
            <Upload
              title={`Anexo-${dataModal.id}`}
              id={dataModal.id}
              label="Enviar Anexo"
              folder="anexos"
              controller="atendimentos"
              action="anexo"
              onFileSelect={handleUpload}
              allowedTypes={ALLOWED_FILE_TYPES}
              maxSize={MAX_FILE_SIZE}
            />
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
};

export default Atendimentos;
