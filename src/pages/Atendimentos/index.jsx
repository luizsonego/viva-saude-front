import React, { useEffect, useState } from "react";
import { Select, Option, Chip } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import {
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  useAcoesFetch,
  useAtendimentosFetch,
  useMedicosFetch,
  useUnidadesFetch,
} from "../../hooks/get/useGet.query";
import { getPrioridade } from "../../helpers";
import { useMutation } from "@tanstack/react-query";
import {
  useResourcePut,
  useUpdateAgendamento,
} from "../../hooks/update/useUpdate.query";
import GenericTable from "../../components/Table/genericTable";
import { Link } from "react-router-dom";
import { CustomModal } from "../Configuracoes/Components";
import EditAtendimentoDadosPessoais from "./edits/dadosPessoais";
import EditAtendimentoDadosMedicos from "./edits/dadosMedicos";
import CustomTimeline from "./timeline";

const classThTable =
  "border-b border-blue-gray-50 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400";
const classTdTable = "py-3 px-5 border-b border-blue-gray-50 ";

const Atendimentos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);
  const [openModalMedicos, setOpenModalMedicos] = useState(false);
  const [openModalTimeLine, setOpenModalTimeLine] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [statusSelecionado, setStatusSelecionado] = useState("ABERTO");

  const { data, isLoading } = useAtendimentosFetch();

  const { mutateAsync, isPending } = useResourcePut(
    "atendimentos",
    "troca-status",
    () => {}
  );

  const filtrarPorStatus = () => {
    if (statusSelecionado === "NOVOS") return data;
    return data.filter((item) => item.status === statusSelecionado);
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

  const handleChangeStatusCartao = ({ id, status }) => {
    let dataStatus = {
      id,
      status,
    };
    mutateAsync(dataStatus);
  };

  if (isLoading) {
    return "carregando...";
  }
  return (
    <>
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

      <Card className="mt-5">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between "
        >
          <Typography variant="h6" color="white" className="">
            Atendimentos
          </Typography>
          <div className="mb-4 flex gap-2">
            {[
              "AGUARDANDO VAGA",
              "FILA DE ESPERA",
              "NOVOS",
              "ABERTO",
              "EM ANALISE",
              "PAGAMENTO",
              "AGUARDANDO AUTORIZACAO",
              "CONCLUIDO",
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
        </CardHeader>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className={classThTable}>Titular</th>
              <th className={classThTable}>Procedimento</th>
              <th className={classThTable}>Medico</th>
              <th className={classThTable}>Local</th>
              <th className={classThTable}>Status</th>
              <th className={classThTable}>Atendimento</th>
              <th className={classThTable}></th>
            </tr>
          </thead>
          <tbody>
            {filtrarPorStatus().map((item) => (
              <tr key={item.id} className="">
                <td className={classTdTable}>{item.titular_plano}</td>
                <td className={classTdTable}>{item.o_que_deseja}</td>
                <td className={classTdTable}>{item.medico_atendimento}</td>
                <td className={classTdTable}>
                  {item.onde_deseja_ser_atendido}
                </td>
                <td className={classTdTable}>{item.status}</td>
                <td className={classTdTable}>{item.atendimento_iniciado}</td>
                <td className={classTdTable}>
                  <Button
                    onClick={() => handleOpenModalConsulta(item)}
                    variant="outlined"
                  >
                    Detalhes
                  </Button>
                </td>
              </tr>
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
        {/* <div className="flex justify-between md:items-center">
          <div className="mt-1 grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full ">
            <Button fullWidth variant="outlined" color="indigo">
              Novos
            </Button>
            <Button fullWidth variant="outlined" color="cyan">
              Abertos
            </Button>
            <Button fullWidth variant="outlined" color="orange">
              Em análise
            </Button>
            <Button fullWidth variant="outlined" color="deep-orange">
              Pagamento
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="green"
              className="py-3 px-0"
            >
              Aguardando autorização
            </Button>
            <Button fullWidth variant="outlined" color="indigo">
              Concluidos
            </Button>
          </div>
        </div> */}

        {/* <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Atendimentos
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full  table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Titular
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Ação
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Onde
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Médico
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      Hora solicitação
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    ></Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={index + 1}>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item?.titular_plano}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item.titular_plano}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item.onde_deseja_ser_atendido}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item.medico_atendimento}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item.status}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        {item.atendimento_iniciado}
                      </td>
                      <td className={`py-3 px-5 border-b border-blue-gray-50`}>
                        <Button
                          onClick={() => handleOpenModalConsulta(item)}
                          variant="outlined"
                        >
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card> */}

        <Dialog open={openModal} handler={handleOpenModalConsulta} size="lg">
          <DialogHeader>
            Detalhes do agendamento{" "}
            {dataModal.em_espera ? (
              <Chip className="ml-8" value="Item Em fila de espera" />
            ) : (
              ""
            )}
          </DialogHeader>
          <DialogBody>
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
                    {dataModal.para_quem === "outro" ? (
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
                        {getPrioridade(dataModal.prioridade)}
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
                  label="Status"
                  onChange={(status) =>
                    handleChangeStatusCartao({ status, id: dataModal.id })
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
                    onClick={() => handleOpenModalTimeLine(dataModal)}
                    color="blue-gray"
                  >
                    Visualizar linha do tempo
                  </Button>
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
            <EditAtendimentoDadosPessoais data={dataModal} />
          </CustomModal>
          <CustomModal
            title={"Ajustar dados do atendimento"}
            open={openModalMedicos}
            handler={handleOpenModalAjustesMedico}
          >
            <EditAtendimentoDadosMedicos data={dataModal} />
          </CustomModal>

          <CustomModal
            title={"Linha do tempo"}
            open={openModalTimeLine}
            handler={handleOpenModalTimeLine}
          >
            <CustomTimeline data={dataModal} />
          </CustomModal>
        </Dialog>
      </div>
    </>
  );
};

export default Atendimentos;
