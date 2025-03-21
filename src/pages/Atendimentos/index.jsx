import React, { useState } from "react";
import { Select, Option, Chip } from "@material-tailwind/react";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
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
  const [dataModal, setDataModal] = useState({});
  const [statusSelecionado, setStatusSelecionado] = useState("ABERTO");

  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState("");
  const [medicoSelecionado, setMedicoSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [atendenteSelecionado, setAtendenteSelecionado] = useState("");

  const { data, isLoading } = useAtendimentosFetch();
  const { data: prioridadeData } = useGetResources("prioridades", "prioridade");
  const { data: atendenteData } = useGetResources("atendentes", "atendente");
  const { data: medicoData } = useGetResources("medico", "medicos");
  const { data: locaisData } = useGetResources("locais", "onde-ser-atendido");

  const { mutateAsync, isPending } = useResourcePut(
    "atendimentos",
    "troca-status",
    () => {}
  );
  const { mutateAsync: mutatePrioridade, isPending: pendingPrioridade } =
    useResourcePut("atendimentos", "troca-prioridade", () => {});
  const { mutateAsync: mutateAtendente, isPending: pendingAtendente } =
    useResourcePut("atendimentos", "troca-atendente", () => {});

  const filtrarPorStatus = () => {
    if (statusSelecionado === "ABERTOS") return data;
    return data?.filter((item) => item.status === statusSelecionado);
  };

  const filtrarAtendimentos = () => {
    return data?.filter((item) => {
      const statusFiltro =
        statusSelecionado === "TODOS" ||
        statusSelecionado === "ABERTOS" ||
        item.status === statusSelecionado;
      const prioridadeFiltro = prioridadeSelecionada
        ? item.prioridadeAtendimento?.nome === prioridadeSelecionada
        : true;
      const medicoFiltro = medicoSelecionado
        ? item.medico_atendimento === medicoSelecionado
        : true;
      const localFiltro = localSelecionado
        ? item.onde_deseja_ser_atendido === localSelecionado
        : true;
      const atendenteFiltro = atendenteSelecionado
        ? item?.profile?.name === atendenteSelecionado
        : true;
      const clienteFiltro = clienteSelecionado
        ? item.titular_plano.includes(clienteSelecionado) ||
          item.cpf_titular.includes(clienteSelecionado)
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

  const handleChangeAtendenteCartao = ({ id, atendente }) => {
    let dataStatus = {
      id,
      atendente,
    };
    mutateAtendente(dataStatus);
  };
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

  const handleViewCartao = (resource, id) => {
    navigate(`ver/${resource}/${id}`);
  };

  if (isLoading) {
    return "carregando...";
  }
  return (
    <>
      {/* <MainAlert
        handleOpen={openModalError}
        handleClose={() => setOpenModalError(!openModalError)}
        message={dataError}
        color={"red"}
      /> */}
      <div className="flex flex-col gap-12">
        <div className="flex justify-between md:items-center">
          <div className="mt-1 mb-5 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full ">
            <Link to={"create"}>
              <Button fullWidth variant="outlined" color="indigo">
                Criar Cartão
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-10 flex gap-2">
        {[
          "TODOS",
          "AGUARDANDO VAGA",
          "FILA DE ESPERA",
          // "NOVOS",
          "ABERTO",
          "EM ANALISE",
          "PAGAMENTO",
          "AGUARDANDO AUTORIZACAO",
          "CONCLUIDO",
          "INATIVIDADE",
        ].map((status) => (
          <Button
            key={status}
            className={`px-4 py-2 border rounded ${
              statusSelecionado === status ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setStatusSelecionado(status)}
          >
            {status}
          </Button>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between "
        >
          <Typography variant="h6" color="white" className="">
            Atendimentos
          </Typography>
        </CardHeader>
        <div className="flex flex-wrap gap-2 mt-4 w-full grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1">
          <select
            onChange={(e) => setPrioridadeSelecionada(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todas Prioridades</option>
            {prioridadeData?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setMedicoSelecionado(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todos Médicos</option>
            {medicoData?.map((item) => (
              <option key={item.id} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setLocalSelecionado(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todos Locais</option>
            {locaisData?.map((item) => (
              <option
                key={item.onde_deseja_ser_atendido}
                value={item.onde_deseja_ser_atendido}
              >
                {item.onde_deseja_ser_atendido}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setAtendenteSelecionado(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todos Atendentes</option>
            {atendenteData?.map((item) => (
              <option key={item.id} value={item?.profile?.name}>
                {item?.profile?.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filtrar Cliente (Nome ou CPF)"
            onChange={(e) => setClienteSelecionado(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className={classThTable}>Titular</th>
              <th className={classThTable}>Procedimento</th>
              <th className={classThTable} width="auto">
                Prioridade
              </th>
              <th className={classThTable}>Medico</th>
              <th className={classThTable}>Local</th>
              <th className={classThTable}>Status</th>
              <th className={classThTable}>Atendimento</th>
              <th className={classThTable}></th>
            </tr>
          </thead>
          <tbody>
            {filtrarAtendimentos()?.map((item) => (
              <div
                key={item.id}
                style={{ display: "contents", backgroundColor: "tomato" }}
              >
                <tr className="">
                  <td className={classTdTable}>{item.titular_plano}</td>
                  <td className={classTdTable}>{item.o_que_deseja}</td>
                  <td
                    className={classTdTable}
                    style={{
                      background:
                        item?.prioridadeAtendimento?.cor || "transparent",
                    }}
                  >
                    <Chip
                      value={item?.prioridadeAtendimento?.nome}
                      style={{
                        background:
                          item?.prioridadeAtendimento?.cor || "transparent",
                      }}
                    />
                  </td>
                  <td className={classTdTable}>{item.medico_atendimento}</td>
                  <td className={classTdTable}>
                    {item.onde_deseja_ser_atendido}
                  </td>
                  <td className={classTdTable}>{item.status}</td>
                  <td className={classTdTable}>
                    {item.medico_atendimento_data}
                  </td>
                  <td className={classTdTable}>
                    {/* <Button
                      onClick={() => handleOpenModalConsulta(item)}
                      variant="outlined"
                    >
                      Detalhes
                    </Button> */}
                    <Button
                      onClick={() => handleViewCartao("atendimento", item.id)}
                    >
                      ver
                    </Button>
                  </td>
                  {/* <tr span={8} aria-rowspan={5}>
                    <td colspan={8} className={class2ThTable}>
                      Procedimento: {item.acoes?.nome}
                    </td>
                  </tr> */}
                </tr>
              </div>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-2 mb-2 flex flex-col gap-12">
        <div className="flex justify-between md:items-center">
          <div className="mt-1 mb-3 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full ">
            {/* <Link to={"create"}>
              <Button fullWidth variant="outlined" color="indigo">
                Criar Cartão
              </Button>
            </Link> */}
            {/* <Link to={"create"}>
            <Button fullWidth variant="outlined" color="indigo">
              Fila de espera{" "}
            </Button>
          </Link> */}
            {/* <Link to={"create"}>
            <Button fullWidth variant="outlined" color="indigo">
              Buscar vagas{" "}
            </Button>
          </Link> */}
          </div>
        </div>

        <Dialog open={openModal} handler={handleOpenModalConsulta} size="lg">
          <DialogHeader>
            Detalhes do agendamento{" "}
            {dataModal.em_espera ? (
              <Chip className="ml-8" value="Item Em fila de espera" />
            ) : (
              ""
            )}
          </DialogHeader>
          <DialogBody className="h-[42rem] overflow-scroll">
            {/* //// */}
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
                  {dataModal.titulo}
                </Typography>

                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3>Dados do titular</h3>
                    <Typography color="blue-gray" className="mb-1 ">
                      Nome:{" "}
                      <span className="mb-1 font-bold font-lg">
                        {dataModal.titular_plano}
                      </span>
                    </Typography>
                    <Typography color="blue-gray" className="mb-1 ">
                      CPF:{" "}
                      <span className="mb-1 font-bold font-lg">
                        {dataModal.cpf_titular}
                      </span>
                    </Typography>
                    <Typography color="blue-gray" className="mb-1 ">
                      Whatsapp:{" "}
                      <span className="mb-1 font-bold font-lg">
                        {dataModal.whatsapp_titular}
                      </span>
                    </Typography>
                    {dataModal.para_quem === "outra" ? (
                      <>
                        <hr />
                        <h3>Dados de quem vai ser atendido</h3>
                        <Typography color="blue-gray" className="mb-1 ">
                          Nome:{" "}
                          <span className="mb-1 font-bold font-lg">
                            {dataModal.nome_outro}
                          </span>
                        </Typography>
                        <Typography color="blue-gray" className="mb-1 ">
                          CPF:{" "}
                          <span className="mb-1 font-bold font-lg">
                            {dataModal.cpf_outro}
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
                        {dataModal.status}
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
                          value={dataModal?.prioridadeAtendimento?.nome}
                          style={{
                            background:
                              dataModal?.prioridadeAtendimento?.cor ||
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
                        {dataModal.perfil_cliente} {/*perfil do cliente*/}
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
                        {dataModal.observacoes} {/*perfil do cliente*/}
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
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal?.profile?.name}
                  </Typography>
                </div>

                <hr className="mt-5 mb-5" />
                <h3>Dados atendimento</h3>
                <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Medico selecionado"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.medico_atendimento}
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"O que deseja"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.acoes?.nome}
                    {dataModal.o_que_deseja}
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Onde deseja ser atendido"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.onde_deseja_ser_atendido}
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Data"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.medico_atendimento_data}
                  </Typography>
                </div>
                <hr className="mt-5 mb-5" />
                <h3>Resumo do atendimento</h3>
                <div className="flex gap-1">
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.comentario}
                  </Typography>
                </div>
                <hr className="mt-5 mb-5" />
                <h3>Anexo</h3>
                <div className="flex gap-1">
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal?.anexos?.map((item) =>
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
                  {/* <CardBody className=""> */}
                  <div className="flex flex-col gap-1">
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      <Chip value={dataModal.acoes?.nome} />
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
                      {dataModal.atendido_por}
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
                      {dataModal.atendimento_iniciado}
                    </Typography>
                  </div>
                  {/* </CardBody> */}
                </Card>

                <Select
                  label="Prioridade"
                  onChange={(prioridade) =>
                    handleChangePrioridadeCartao({
                      prioridade,
                      id: dataModal.id,
                    })
                  }
                >
                  {prioridadeData?.map((item, index) => (
                    <Option key={index + 1} value={item.id}>
                      {item.nome}
                    </Option>
                  ))}
                </Select>
                <Select
                  label="Status"
                  onChange={(status) =>
                    handleChangeStatusCartao({ status, id: dataModal.id })
                  }
                >
                  {/* {isPending && <Option value="">ENVIANDO</Option>} */}
                  <Option value="ABERTO">Aberto</Option>
                  <Option value="EM ANALISE">Em Analise</Option>
                  <Option value="PAGAMENTO">Para pagamento</Option>
                  <Option value="AGUARDANDO AUTORIZACAO">
                    Aguardando Autorização
                  </Option>

                  <Option value="AGUARDANDO VAGA">Aguardando Vaga</Option>
                  <Option value="FILA DE ESPERA">Fila de espera</Option>
                  <Option value="CONCLUIDO">Concluído</Option>
                </Select>

                <Select
                  label="Atendente"
                  onChange={(atendente) =>
                    handleChangeAtendenteCartao({
                      atendente,
                      id: dataModal.id,
                    })
                  }
                >
                  {atendenteData?.map((item, index) => (
                    <Option key={index + 1} value={item.id}>
                      {item?.profile?.name}
                    </Option>
                  ))}
                </Select>

                <Card
                  shadow={true}
                  className="rounded-lg border border-gray-300 p-4 basis-3/12 flex gap-4 mt-3"
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModalAjustesAtendimento(dataModal)}
                  >
                    Ajustar dados paciente
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModalAjustesMedico(dataModal)}
                  >
                    Ajustar dados atendimento
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModalComentario(dataModal)}
                    color="light-blue"
                  >
                    Resumo do atendimento
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModalTimeLine(dataModal)}
                    color="blue-gray"
                  >
                    Visualizar linha do tempo
                  </Button>
                  <Upload
                    title={`Anexo-${dataModal.id}-${getRandomIntInclusive(
                      1,
                      100000
                    )}`}
                    id={dataModal.id}
                    label={"Enviar Anexo"}
                    folder={"anexos"}
                    controller={"atendimentos"}
                    action={"anexo"}
                    callback={() => {}}
                  />
                </Card>
              </div>
            </div>
            {/* //// */}
          </DialogBody>

          {/* modal de ajustar paciente */}
          <CustomModal
            title={"Ajustar dados do paciente"}
            open={openModalAtendimento}
            handler={handleOpenModalAjustesAtendimento}
          >
            <EditAtendimentoDadosPessoais
              data={dataModal}
              modal={() => setOpenModalAtendimento(false)}
            />
          </CustomModal>
          <CustomModal
            title={"Ajustar dados do atendimento"}
            open={openModalMedicos}
            handler={handleOpenModalAjustesMedico}
            modal={() => setOpenModalMedicos(false)}
          >
            <EditAtendimentoDadosMedicos data={dataModal} />
          </CustomModal>

          <CustomModal
            title={"Linha do tempo"}
            open={openModalTimeLine}
            handler={handleOpenModalTimeLine}
            modal={() => setOpenModalTimeLine(false)}
          >
            <CustomTimeline data={dataModal} />
          </CustomModal>
          <CustomModal
            title={"Resumo do atendimento"}
            open={openModalComentario}
            handler={handleOpenModalComentario}
            modal={() => setOpenModalComentario(false)}
          >
            <AddComentario data={dataModal} />
          </CustomModal>
        </Dialog>
      </div>
    </>
  );
};

export default Atendimentos;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RenderHtml(props) {
  return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
}
