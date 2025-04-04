import React, { useState, useMemo, useCallback } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { CustomModal } from "../Configuracoes/Components";
import EditAtendimentoDadosPessoais from "./edits/dadosPessoais";
import EditAtendimentoDadosMedicos from "./edits/dadosMedicos";
import CustomTimeline from "./timeline";
import AddComentario from "./edits/comentario";
import Upload from "../../components/uploads";
import { formatarDataBr } from "../../helpers";
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
  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);
  const [openModalMedicos, setOpenModalMedicos] = useState(false);
  const [openModalTimeLine, setOpenModalTimeLine] = useState(false);
  const [openModalComentario, setOpenModalComentario] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState("ABERTO");
  const [filtros, setFiltros] = useState({
    prioridade: "",
    medico: "",
    local: "",
    cliente: "",
    atendente: ""
  });

  const { data, isLoading, error } = useAtendimentosFetch();
  const { data: prioridadeData } = useGetResources("prioridades", "prioridade");
  const { data: atendenteData } = useGetResources("atendentes", "atendente");
  const { data: medicoData } = useGetResources("medico", "medicos");
  const { data: locaisData } = useGetResources("locais", "onde-ser-atendido");

  const { mutateAsync: mutateStatus, isPending: isPendingStatus } = useResourcePut(
    "atendimentos",
    "troca-status",
    {
      // onSuccess: () => toast.success("Status atualizado com sucesso!"),
      // onError: (error) => toast.error("Erro ao atualizar status: " + error.message)
    }
  );

  const { mutateAsync: mutatePrioridade, isPending: isPendingPrioridade } =
    useResourcePut("atendimentos", "troca-prioridade", {
      // onSuccess: () => toast.success("Prioridade atualizada com sucesso!"),
      // onError: (error) => toast.error("Erro ao atualizar prioridade: " + error.message)
    });

  const { mutateAsync: mutateAtendente, isPending: isPendingAtendente } =
    useResourcePut("atendimentos", "troca-atendente", {
      // onSuccess: () => toast.success("Atendente atualizado com sucesso!"),
      // onError: (error) => toast.error("Erro ao atualizar atendente: " + error.message)
    });

  const handleFiltroChange = useCallback((key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  }, []);

  const atendimentosFiltrados = useMemo(() => {
    if (!data) return [];
    
    return data.filter((item) => {
      const statusFiltro =
        statusSelecionado === "TODOS" ||
        statusSelecionado === "ABERTOS" ||
        item?.status === statusSelecionado;
      
      const prioridadeFiltro = filtros.prioridade
        ? item?.prioridadeAtendimento?.nome === filtros.prioridade
        : true;
      
      const medicoFiltro = filtros.medico
        ? item?.medico_atendimento === filtros.medico
        : true;
      
      const localFiltro = filtros.local
        ? item?.onde_deseja_ser_atendido === filtros.local
        : true;
      
      const atendenteFiltro = filtros.atendente
        ? item?.profile?.name === filtros.atendente
        : true;
      
      const clienteFiltro = filtros.cliente
        ? item?.titular_plano?.toLowerCase().includes(filtros.cliente.toLowerCase()) ||
          item?.cpf_titular?.includes(filtros.cliente)
        : true;

      return (
        statusFiltro &&
        prioridadeFiltro &&
        medicoFiltro &&
        localFiltro &&
        atendenteFiltro &&
        clienteFiltro
      );
    });
  }, [data, statusSelecionado, filtros]);

  const handleOpenModalConsulta = useCallback((item) => {
    if (!item) return;
    setDataModal(item);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setDataModal(null);
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

  if (isLoading) {
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
            onClick={() => setStatusSelecionado(status)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          <Select
            label="Prioridade"
            value={filtros.prioridade}
            onChange={(value) => handleFiltroChange('prioridade', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todas Prioridades</Option>
            {prioridadeData?.map((item) => (
              <Option key={item?.id} value={item?.nome}>
                {item?.nome}
              </Option>
            ))}
          </Select>

          <Select
            label="Médico"
            value={filtros.medico}
            onChange={(value) => handleFiltroChange('medico', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todos Médicos</Option>
            {medicoData?.map((item) => (
              <Option key={item?.id} value={item?.nome}>
                {item?.nome}
              </Option>
            ))}
          </Select>

          <Select
            label="Local"
            value={filtros.local}
            onChange={(value) => handleFiltroChange('local', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todos Locais</Option>
            {locaisData?.map((item) => (
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
            onChange={(value) => handleFiltroChange('atendente', value)}
            className="border p-2 rounded"
          >
            <Option value="">Todos Atendentes</Option>
            {atendenteData?.map((item) => (
              <Option key={item?.id} value={item?.profile?.name}>
                {item?.profile?.name}
              </Option>
            ))}
          </Select>

          <Input
            label="Filtrar Cliente"
            value={filtros.cliente}
            onChange={(e) => handleFiltroChange('cliente', e.target.value)}
            placeholder="Nome ou CPF"
            className="border p-2 rounded"
          />
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
              {atendimentosFiltrados.map((item) => (
                <tr
                  key={item?.id}
                  className={`${
                    item?.temporizador?.tempo_restante <= 0
                      ? "text-gray-100 bold"
                      : "hover:bg-gray-50"
                  }`}
                  style={{
                    background:
                    item?.temporizador?.tempo_restante <= 0
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
                    {formatarDataBr(item?.medico_atendimento_data)}
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {dataModal && (
        <Dialog
          open={openModal}
          handler={handleCloseModal}
          size="lg"
          className="overflow-y-auto"
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
