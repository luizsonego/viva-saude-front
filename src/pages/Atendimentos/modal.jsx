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
} from "@material-tailwind/react";
import { useResourcePut } from "../../hooks/update/useUpdate.query";
import Upload from "../../components/uploads";
import { CustomModal } from "../Configuracoes/Components";
import EditAtendimentoDadosPessoais from "./edits/dadosPessoais";
import EditAtendimentoDadosMedicos from "./edits/dadosMedicos";
import CustomTimeline from "./timeline";
import AddComentario from "./edits/comentario";

const ModalAtendimento = () => {
  const { id, resource } = useParams();
  const history = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);
  const [openModalMedicos, setOpenModalMedicos] = useState(false);
  const [openModalTimeLine, setOpenModalTimeLine] = useState(false);
  const [openModalComentario, setOpenModalComentario] = useState(false);
  const [dataModal, setDataModal] = useState({});

  const { data, isLoading } = useGetResource("atendimento", "atendimento", id);
  const { data: prioridadeData } = useGetResources("prioridades", "prioridade");
  const { data: atendenteData } = useGetResources("atendentes", "atendente");

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
    history(-1);
  };

  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChangePrioridadeCartao = ({ id, prioridade }) => {
    let dataStatus = {
      id,
      prioridade,
    };
    mutatePrioridade(dataStatus);
  };
  const handleChangeStatusCartao = ({ id, status }) => {
    let dataStatus = {
      id,
      status,
    };
    mutateAsync(dataStatus);
  };
  const handleChangeAtendenteCartao = ({ id, atendente }) => {
    let dataStatus = {
      id,
      atendente,
    };
    mutateAtendente(dataStatus);
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

  if (isLoading) return "carregando";

  return (
    <>
      <div
        className="absolute inset-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm "
        style={{
          zIndex: 999,
        }}
      >
        <span
          className="inline-block absolute top-0 right-0 mr-4 mt-4 cursor-pointer"
          onClick={closeModal}
        >
          <svg
            class="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <div className="w-4/5 h-[90%] overflow-y-auto">
          <Card shadow={true} className="w-full justify-center">
            <DialogHeader>
              Detalhes do agendamento{" "}
              {data.em_espera ? (
                <Chip className="ml-8" value="Item Em fila de espera" />
              ) : (
                ""
              )}
            </DialogHeader>
            <CardBody>
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
                    {data.titulo}
                  </Typography>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3>Dados do titular</h3>
                      <Typography color="blue-gray" className="mb-1 ">
                        Nome:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {data.titular_plano}
                        </span>
                      </Typography>
                      <Typography color="blue-gray" className="mb-1 ">
                        CPF:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {data.cpf_titular}
                        </span>
                      </Typography>
                      <Typography color="blue-gray" className="mb-1 ">
                        Whatsapp:{" "}
                        <span className="mb-1 font-bold font-lg">
                          {data.whatsapp_titular}
                        </span>
                      </Typography>
                      {data.para_quem === "outra" ? (
                        <>
                          <hr />
                          <h3>Dados de quem vai ser atendido</h3>
                          <Typography color="blue-gray" className="mb-1 ">
                            Nome:{" "}
                            <span className="mb-1 font-bold font-lg">
                              {data.nome_outro}
                            </span>
                          </Typography>
                          <Typography color="blue-gray" className="mb-1 ">
                            CPF:{" "}
                            <span className="mb-1 font-bold font-lg">
                              {data.cpf_outro}
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
                          {data.status}
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
                            value={data?.prioridadeAtendimento?.nome}
                            style={{
                              background:
                                data?.prioridadeAtendimento?.cor ||
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
                          {data.perfil_cliente} {/*perfil do cliente*/}
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
                          {data.observacoes} {/*perfil do cliente*/}
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
                      {data?.profile?.name}
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
                      {data.medico_atendimento}
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
                      {data.acoes?.nome}
                      {data.o_que_deseja}
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
                      {data.onde_deseja_ser_atendido}
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
                      {data.medico_atendimento_data}
                    </Typography>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Resumo do atendimento</h3>
                  <div className="flex gap-1">
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {data.comentario}
                    </Typography>
                  </div>
                  <hr className="mt-5 mb-5" />
                  <h3>Anexo</h3>
                  <div className="flex gap-1">
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {data?.anexos?.map((item) =>
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
                        <Chip value={data.acoes?.nome} />
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                        {"Atendido por"}:
                      </Typography>
                      <Typography
                        className="text-xs !font-bold"
                        color="blue-gray"
                      >
                        {data.atendido_por}
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                        {"inicio do atendimento"}:
                      </Typography>
                      <Typography
                        className="text-xs !font-bold"
                        color="blue-gray"
                      >
                        {data.atendimento_iniciado}
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
                            id: data.id,
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
                          handleChangeStatusCartao({ status, id: data.id })
                        }
                      >
                        <Option value="ABERTO">Aberto</Option>
                        <Option value="EM ANALISE">Em Analise</Option>
                        <Option value="PAGAMENTO">Para pagamento</Option>
                        <Option value="AGUARDANDO AUTORIZACAO">
                          Aguardando Autorização
                        </Option>
                        <Option value="CONCLUIDO">Concluído</Option>
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
                            id: data.id,
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
                      onClick={() => handleOpenModalAjustesAtendimento(data)}
                    >
                      Ajustar dados paciente
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModalAjustesMedico(data)}
                    >
                      Ajustar dados atendimento
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModalComentario(data)}
                      color="light-blue"
                    >
                      Resumo do atendimento
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModalTimeLine(data)}
                      color="blue-gray"
                    >
                      Visualizar linha do tempo
                    </Button>
                    <Upload
                      title={`Anexo-${data.id}-${getRandomIntInclusive(
                        1,
                        100000
                      )}`}
                      id={data.id}
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
        >
          <EditAtendimentoDadosPessoais
            data={data}
            modal={() => setOpenModalAtendimento(false)}
          />
        </CustomModal>
        <CustomModal
          title={"Ajustar dados do atendimento"}
          open={openModalMedicos}
          handler={handleOpenModalAjustesMedico}
          modal={() => setOpenModalMedicos(false)}
        >
          <EditAtendimentoDadosMedicos
            data={data}
            modal={() => setOpenModalMedicos(false)}
          />
        </CustomModal>

        <CustomModal
          title={"Linha do tempo"}
          open={openModalTimeLine}
          handler={handleOpenModalTimeLine}
          modal={() => setOpenModalTimeLine(false)}
        >
          <CustomTimeline data={data} />
        </CustomModal>
        <CustomModal
          title={"Resumo do atendimento"}
          open={openModalComentario}
          handler={handleOpenModalComentario}
          modal={() => setOpenModalComentario(false)}
        >
          <AddComentario
            data={data}
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
