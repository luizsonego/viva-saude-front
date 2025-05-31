import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResource, useGetResources } from "../../hooks/get/useGet.query";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DialogHeader,
  Option,
  Select,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useResourcePut } from "../../hooks/update/useUpdate.query";
import Upload from "../../components/uploads";
import { CustomModal } from "../Configuracoes/Components";
import EditAtendimentoDadosPessoais from "./edits/dadosPessoais";
import EditAtendimentoDadosMedicos from "./edits/dadosMedicos";
import CustomTimeline from "./timeline";
import AddComentario from "./edits/comentario";
import { formatarDataBr } from "../../helpers";
import { 
  converterSegundosMinutos, 
  converterSegundosHorasMinutos,
  formatarTempoExpirado, 
  formatarDataBrHora
} from "../../helpers/formatarDataBr";

const ModalAtendimento = () => {
  const { id, resource } = useParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);
  const [openModalMedicos, setOpenModalMedicos] = useState(false);
  const [openModalTimeLine, setOpenModalTimeLine] = useState(false);
  const [openModalComentario, setOpenModalComentario] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const { data = {}, isLoading, error: fetchError, refetch } = useGetResource(
    "atendimento",
    "atendimento",
    id
  );
  const atendimentoData = data?.atendimento;
  const { data: prioridadeData = [], error: prioridadeError } = useGetResources(
    "prioridades",
    "prioridade"
  );
  const { data: atendenteData = [], error: atendenteError } = useGetResources(
    "atendentes",
    "atendente"
  );

  const { mutateAsync, isPending: pendingStatus } = useResourcePut(
    "atendimento",
    "troca-status",
    () => {}
  );
  const { mutateAsync: mutatePrioridade, isPending: pendingPrioridade } =
    useResourcePut("atendimento", "troca-prioridade", () => {});
  const { mutateAsync: mutateAtendente, isPending: pendingAtendente } =
    useResourcePut("atendimento", "troca-atendente", () => {});

  const closeModal = (e) => {
    e.stopPropagation();
    navigate(-1);
  };

  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  React.useEffect(() => {
    if (data?.temporizador?.tempo_restante && !data?.temporizador?.em_atraso) {
      setCountdown(data.temporizador.tempo_restante);
      
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [data?.temporizador?.tempo_restante, data?.temporizador?.em_atraso]);

  const handleChangePrioridadeCartao = ({ id, prioridade }) => {
    let dataStatus = {
      id,
      prioridade,
    };
    try {
      mutatePrioridade(dataStatus).then(() => {
        refetch();
      });
    } catch (error) {
      setError("Erro ao alterar prioridade. Tente novamente.");
    }
  };
  const handleChangeStatusCartao = ({ id, status }) => {
    let dataStatus = {
      id,
      status,
    };
    try {
      mutateAsync(dataStatus).then(() => {
        refetch();
      });
    } catch (error) {
      setError("Erro ao alterar status. Tente novamente.");
    }
  };
  const handleChangeAtendenteCartao = ({ id, atendente }) => {
    let dataStatus = {
      id,
      atendente,
    };
    try {
      mutateAtendente(dataStatus).then(() => {
        refetch();
      });
    } catch (error) {
      setError("Erro ao alterar atendente. Tente novamente.");
    }
  };

  const handleOpenModalConsulta = (item) => {
    setDataModal(item);
    setOpenModal(!openModal);
  };

  const handleOpenModalAjustesAtendimento = () => {
    setOpenModalAtendimento(!openModalAtendimento);
  };
  const handleOpenModalAjustesMedico = () => {
    setOpenModalMedicos(!openModalMedicos);
  };
  const handleOpenModalTimeLine = () => {
    setOpenModalTimeLine(!openModalTimeLine);
  };

  const handleOpenModalComentario = () => {
    setOpenModalComentario(!openModalComentario);
  };

  if (isLoading) return (
    <div className="absolute inset-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center">
        <Spinner className="h-12 w-12 text-blue-500" />
        <Typography variant="h6" color="white" className="mt-4">
          Carregando dados do atendimento...
        </Typography>
      </div>
    </div>
  );
  
  if (fetchError || prioridadeError || atendenteError) {
    return (
      <div className="absolute inset-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
          <p>{fetchError?.message || prioridadeError?.message || atendenteError?.message || "Ocorreu um erro ao carregar os dados. Tente novamente."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          absolute inset-0 w-screen h-screen bg-black bg-opacity-60 
          flex items-center justify-center backdrop-blur-sm 
          transition-opacity duration-300 ease-in-out
        "
        style={{
          zIndex: 999,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <p>{error}</p>
          </div>
        )}
        <span
          className="
          inline-block absolute top-0 right-0 mr-4 mt-4 cursor-pointer
          transition-transform duration-200 ease-in-out hover:scale-110
          "
          onClick={closeModal}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Fechar modal"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <div className="w-4/5 h-[90%] flex items-center justify-center">
          <Card
            shadow={true}
            className="w-full h-full flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-lg"
            style={{
              border:
                data.expirado?.tempo_restante <= 0 || data.expirado
                  ? "2px solid red"
                  : "",
            }}
          >
            <DialogHeader>
              Detalhes do agendamento{" "}
              {atendimentoData?.em_espera ? (
                <Chip className="ml-8" value="Item Em fila de espera" />
              ) : (
                ""
              )}
            </DialogHeader>
            <DialogHeader>
              <small>
                Expira em: {data?.temporizador?.em_atraso ? 
                <span 
                className="inline-flex items-center rounded-md bg-red-900 px-4 py-2 text-sm font-medium text-red-50 ring-1 ring-red-800 ring-inset animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  ATENDIMENTO ATRASADO
                </span> : formatarDataBr(data?.temporizador?.expira_em)} {" - "}
                {!data?.temporizador?.em_atraso ? (
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Resta: {converterSegundosHorasMinutos(countdown !== null ? countdown : data?.temporizador?.tempo_restante)}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-red-700/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Atrasado há: {converterSegundosHorasMinutos(Math.abs(data?.temporizador?.tempo_restante || 0))}
                  </span>
                )}
              </small>
            </DialogHeader>
            <CardBody className="flex-1 overflow-y-auto custom-scrollbar">
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(241, 241, 241, 0.5);
                  border-radius: 10px;
                  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(136, 136, 136, 0.7);
                  border-radius: 10px;
                  transition: all 0.3s ease;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(85, 85, 85, 0.9);
                  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                }
                
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(136, 136, 136, 0.7) rgba(241, 241, 241, 0.5);
                  scroll-behavior: smooth;
                }
                
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                  background: rgba(85, 85, 85, 0.9);
                }
              `}</style>
              <div className="flex flex-row gap-4">
                <Card
                  shadow={false}
                  className="rounded-lg border border-gray-300 p-4 basis-9/12"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-3 font-bold"
                  >
                    {atendimentoData?.titulo}
                  </Typography>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3>Dados do titular</h3>
                      <Typography color="blue-gray" className="mb-1 ">
                        Nome:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {atendimentoData?.titular_plano}
                        </span>
                      </Typography>
                      <Typography color="blue-gray" className="mb-1 ">
                        CPF:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {atendimentoData?.cpf_titular}
                        </span>
                      </Typography>
                      <Typography color="blue-gray" className="mb-1 ">
                        Whatsapp:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {atendimentoData?.whatsapp_titular}
                        </span>
                      </Typography>
                      {atendimentoData?.para_quem === "outra" ? (
                        <>
                          <hr />
                          <h3>Dados de quem vai ser atendido</h3>
                          <Typography color="blue-gray" className="mb-1 ">
                            Nome:{" "}
                            <span className="mb-1 font-bold font-lg">
                              {atendimentoData?.nome_outro}
                            </span>
                          </Typography>
                          <Typography color="blue-gray" className="mb-1 ">
                            CPF:{" "}
                            <span className="mb-1 font-bold font-lg">
                              {atendimentoData?.cpf_outro}
                            </span>
                          </Typography>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="flex gap-1">
                        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                          {"Status"}:
                        </Typography>
                        <Typography
                          className="text-xs !font-bold"
                          color="blue-gray"
                        >
                          {atendimentoData?.status}
                        </Typography>
                      </div>
                      <div className="flex gap-1">
                        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                          {"Prioridade"}:
                        </Typography>
                        <Typography
                          className="text-xs !font-bold"
                          color="blue-gray"
                        >
                          <Chip
                            value={atendimentoData?.prioridadeAtendimentos?.nome}
                            style={{
                              background:
                                atendimentoData?.prioridadeAtendimentos?.cor ||
                                "transparent",
                            }}
                          />
                        </Typography>
                      </div>

                      <div className="flex gap-1">
                        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                          {"Perfil do Cliente "}:
                        </Typography>
                        <Typography
                          className="text-xs !font-bold"
                          color="blue-gray"
                        >
                          {atendimentoData?.perfil_cliente}{" "}
                          {/*perfil do cliente*/}
                        </Typography>
                      </div>
                      <div className="flex gap-1">
                        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                          {"Observação "}:
                        </Typography>
                        <Typography
                          className="text-xs !font-bold"
                          color="blue-gray"
                        >
                          {atendimentoData?.observacoes} {/*perfil do cliente*/}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Atendente</h3>
                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"Atendente"}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.profile?.name}
                    </Typography>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Dados atendimento</h3>
                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"Medico selecionado"}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.medico_atendimento}
                    </Typography>
                  </div>
                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"O que deseja"}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.acoes?.nome}
                      {atendimentoData?.o_que_deseja}
                    </Typography>
                  </div>
                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"Onde deseja ser atendido"}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.onde_deseja_ser_atendido}
                    </Typography>
                  </div>
                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"Data"}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {formatarDataBrHora(atendimentoData?.medico_atendimento_data)}
                    </Typography>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Resumo do atendimento</h3>
                  <div className="flex gap-1">
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.comentario}
                    </Typography>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Anexo</h3>
                  <div className="flex gap-1">
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {atendimentoData?.anexos?.map((item) =>
                        item.fileType === "image" ? (
                          <img src={item.url} alt="imagem" width={200} />
                        ) : (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.nome}
                          </a>
                        )
                      )}
                    </Typography>
                  </div>
                </Card>
                <div className="basis-1/5 ">
                  <Card
                    shadow={false}
                    className="rounded-lg border border-gray-300 p-2 mb-3"
                  >
                    <div className="flex flex-col gap-1">
                      <Typography
                        className="text-xs !font-bold"
                        color="blue-gray"
                      >
                        {atendimentoData?.o_que_deseja}
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography className="mt-3 text-xs !font-medium !text-gray-600">
                        {"Atendido por"}:{" "}
                        <span className="text-xs !font-bold" color="blue-gray">
                          {atendimentoData?.atendido_por}
                        </span>
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                        {"inicio do atendimento"}:{" "}
                        <span className="text-xs !font-bold" color="blue-gray">
                          {formatarDataBrHora(atendimentoData?.atendimento_iniciado)}
                        </span>
                      </Typography>
                    </div>
                  </Card>
                  <div className={"flex flex-col gap-2"}>
                    {pendingPrioridade ? (
                      "Enviando..."
                    ) : (
                      <Select
                        label="Prioridade"
                        onChange={(prioridade) =>
                          handleChangePrioridadeCartao({
                            prioridade,
                            id: atendimentoData?.id,
                          })
                        }
                      >
                        {prioridadeData?.map((item, index) => (
                          <Option key={index + 1} value={item.id}>
                            {item.nome}
                          </Option>
                        ))}
                      </Select>
                    )}

                    {pendingStatus ? (
                      "Enviando..."
                    ) : (
                      <Select
                        label="Status"
                        onChange={(status) =>
                          handleChangeStatusCartao({
                            status,
                            id: atendimentoData?.id,
                          })
                        }
                      >
                        <Option value="ABERTO">Aberto</Option>
                        <Option value="AGUARDANDO AUTORIZACAO">
                          Aguardando Autorização
                        </Option>
                        <Option value="AGUARDANDO PAGAMENTO">
                          Aguardando pagamento
                        </Option>
                        <Option value="AGUARDANDO VAGA">Aguardando Vaga</Option>
                        <Option value="CONCLUIDO">Concluído</Option>
                        <Option value="EM ANALISE">Em Analise</Option>
                        <Option value="FILA DE ESPERA">Fila de espera</Option>
                        <Option value="INATIVIDADE">Inatividade</Option>
                        <Option value="PAGAMENTO EFETUADO">
                          Pagamento efetuado
                        </Option>
                      </Select>
                    )}
                    {pendingAtendente ? (
                      "Enviando..."
                    ) : (
                      <Select
                        label="Atendente"
                        onChange={(atendente) =>
                          handleChangeAtendenteCartao({
                            atendente,
                            id: atendimentoData?.id,
                          })
                        }
                      >
                        {atendenteData?.map((item, index) => (
                          <Option key={index + 1} value={item.id}>
                            {item?.profile?.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>

                  <Card
                    shadow={true}
                    className="rounded-lg border border-gray-300 p-4 basis-3/12 flex gap-4 mt-3"
                  >
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleOpenModalAjustesAtendimento(atendimentoData)
                      }
                      aria-label="Ajustar dados do paciente"
                    >
                      Ajustar dados paciente
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleOpenModalAjustesMedico(atendimentoData)
                      }
                      aria-label="Ajustar dados do atendimento"
                    >
                      Ajustar dados atendimento
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModalComentario(atendimentoData)}
                      color="light-blue"
                      aria-label="Adicionar resumo do atendimento"
                    >
                      Resumo do atendimento
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModalTimeLine(atendimentoData)}
                      color="blue-gray"
                      aria-label="Visualizar linha do tempo"
                    >
                      Visualizar linha do tempo
                    </Button>
                    <Upload
                      title={`Anexo-${
                        atendimentoData?.id
                      }-${getRandomIntInclusive(1, 100000)}`}
                      id={atendimentoData?.id}
                      label={"Enviar Anexo"}
                      folder={"anexos"}
                      controller={"atendimentos"}
                      action={"anexo"}
                      callback={() => {}}
                    />
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <CustomModal
          title={"Ajustar dados do paciente"}
          open={openModalAtendimento}
          handler={handleOpenModalAjustesAtendimento}
          aria-labelledby="modal-title-paciente"
        >
          <EditAtendimentoDadosPessoais
            data={atendimentoData}
            modal={() => setOpenModalAtendimento(false)}
          />
        </CustomModal>
        <CustomModal
          title={"Ajustar dados do atendimento"}
          open={openModalMedicos}
          handler={handleOpenModalAjustesMedico}
          modal={() => setOpenModalMedicos(false)}
          aria-labelledby="modal-title-atendimento"
          width={1000}
        >
          <EditAtendimentoDadosMedicos
            data={atendimentoData}
            modal={() => setOpenModalMedicos(false)}
          />
        </CustomModal>

        <CustomModal
          title={"Linha do tempo"}
          open={openModalTimeLine}
          handler={handleOpenModalTimeLine}
          modal={() => setOpenModalTimeLine(false)}
          aria-labelledby="modal-title-timeline"
        >
          <CustomTimeline data={atendimentoData} />
        </CustomModal>
        <CustomModal
          title={"Resumo do atendimento"}
          open={openModalComentario}
          handler={handleOpenModalComentario}
          modal={() => setOpenModalComentario(false)}
          aria-labelledby="modal-title-comentario"
        >
          <AddComentario
            data={atendimentoData}
            modal={() => setOpenModalComentario(false)}
          />
        </CustomModal>
      </div>
    </>
  );
};

export default ModalAtendimento;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
