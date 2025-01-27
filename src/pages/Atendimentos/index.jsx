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
import { useUpdateAgendamento } from "../../hooks/update/useUpdate.query";
import GenericTable from "../../components/Table/genericTable";

const Atendimentos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAtendimento, setOpenModalAtendimento] = useState(false);

  const [dataModal, setDataModal] = useState({});

  const { register, handleSubmit } = useForm();

  const { data, isLoading } = useAtendimentosFetch();
  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();
  const { data: acaoData, isLoading: loadingAcao } = useAcoesFetch();
  const { data: medicosData, isLoading: loadingMedicos } = useMedicosFetch();

  const handleOpenModalConsulta = (item) => {
    setDataModal(item);
    setOpenModal(!openModal);
  };

  const handleOpenModalAjustesAtendimento = () => {
    // setDataModalAtendimento(item);
    setOpenModalAtendimento(!openModalAtendimento);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useUpdateAgendamento,
  });

  const onSubmit = (data) => {
    mutateAsync(data);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between md:items-center">
        <div className="mt-6 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full ">
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
          <Button fullWidth variant="outlined" color="green">
            Concluídos
          </Button>
        </div>
      </div>

      <Card>
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
      </Card>

      <Dialog open={openModal} handler={handleOpenModalConsulta} size="lg">
        <DialogHeader>Detalhes do agendamento</DialogHeader>
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

                  {/* <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Grupo"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.grupo}
                  </Typography>
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Etiqueta"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.etiqueta}
                  </Typography>
                </div> */}

                  <div className="flex gap-1">
                    <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                      {"Perfil do Cliente "}:
                    </Typography>
                    <Typography
                      className="text-xs !font-bold"
                      color="blue-gray"
                    >
                      {dataModal.descricao} {/*perfil do cliente*/}
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
                  {/* <div className="flex gap-1">
                  <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                    {"Inicio de atendimento:"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.atendimento_iniciado}
                  </Typography>
                </div> */}
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

              {/* <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Medico
                </Typography>
                <Input
                  size="lg"
                  placeholder="name@mail.com"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  {...register("medico")}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Clinica
                </Typography>
                <Input
                  size="lg"
                  placeholder="name@mail.com"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  {...register("medico_atendimento_local")}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Data Agendada
                </Typography>
                <Input
                  size="lg"
                  placeholder="name@mail.com"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  {...register("medico_atendimento_data")}
                />
                <Input
                  className="hidden"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  disabled
                  defaultValue={dataModal.id}
                  {...register("id")}
                />
              </div>
              <input
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
              />
            </form> */}
            </Card>
            <div className="basis-1/5 ">
              <Card
                shadow={false}
                className="rounded-lg border border-gray-300 p-2 mb-4"
              >
                {/* <CardBody className=""> */}
                <div className="flex flex-col gap-1">
                  {/* <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                    {"Ação"}:
                  </Typography> */}
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    <Chip value={dataModal.o_que_deseja} />
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                    {"Atendido por"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.atendido_por}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography className="mt-1 text-xs !font-medium !text-gray-600">
                    {"inicio do atendimento"}:
                  </Typography>
                  <Typography className="text-xs !font-bold" color="blue-gray">
                    {dataModal.atendimento_iniciado}
                  </Typography>
                </div>
                {/* </CardBody> */}
              </Card>
              <Card
                shadow={false}
                className="rounded-lg border border-gray-300 p-4 basis-3/12"
              >
                {/* <CardBody ;className=""> */}
                <Card className="mt-5 p-0">
                  <Button
                    variant="text"
                    onClick={() => handleOpenModalAjustesAtendimento(dataModal)}
                  >
                    <CardBody>Ajustar dados Atendimento</CardBody>
                  </Button>
                </Card>
                <Card className="mt-5 ">
                  <CardBody>
                    {/* {dataModal?.etapas?.map((item) => {
                      return (
                        <p>
                          <Typography className="text-xs">
                            {item.hora}
                          </Typography>
                          <Typography className="text-xs">
                            {item.descricao}
                          </Typography>
                          <hr />
                        </p>
                      );
                    })} */}
                  </CardBody>
                </Card>

                {/* </CardBody> */}
              </Card>
            </div>
          </div>
          {/* //// */}
        </DialogBody>
        <Dialog
          open={openModalAtendimento}
          handler={handleOpenModalAjustesAtendimento}
          size="md"
        >
          <DialogHeader>Ajustar dados do atendimento</DialogHeader>
          <DialogBody>
            <form
              className="mt-8 mb-2 w-full flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input label="nome titular" {...register("nome_titular")} />
              <Input label="cpf titular" {...register("cpf_titular")} />
              <Input
                label="whatsapp titular"
                {...register("whatsapp_titular")}
              />
              {dataModal.para_quem === "outro" ? (
                <>
                  <Input label="nome outro" {...register("nome_outro")} />
                  <Input label="cpf outro" {...register("cpf_outro")} />
                </>
              ) : (
                ""
              )}

              {loadingMedicos ? (
                "carregando..."
              ) : (
                <Select
                  label="Selecione o medico"
                  name="medico_atendimento"
                  // value={qualMedico}
                  // onChange={(val) => setQualMedico(val)}
                >
                  {medicosData?.map((item) => (
                    <Option key={item.id} value={item.nome}>
                      {item.nome}
                    </Option>
                  ))}
                </Select>
              )}
              {loadingAcao ? (
                "carregando..."
              ) : (
                <Select
                  label="O que deseja realizar?"
                  name="o_que_deseja"
                  // value={queDeseja}
                  // onChange={(val) => setQueDeseja(val)}
                >
                  {acaoData?.map((item) => (
                    <Option key={item.id} value={item.nome}>
                      {item.nome}
                    </Option>
                  ))}
                </Select>
              )}

              {loadingUnidades ? (
                "carregando..."
              ) : (
                <Select
                  label="Onde deseja ser atendido"
                  name="onde_deseja_ser_atendido"
                  // value={onde}
                  // onChange={(val) => setOnde(val)}
                >
                  {unidadesData?.map((item) => (
                    <Option key={item.id} value={item.nome}>
                      {item.nome}
                    </Option>
                  ))}
                </Select>
              )}

              <Input
                // className="hidden"
                disabled
                value={dataModal.id}
                defaultValue={dataModal.id}
                {...register("id")}
              />
            </form>
          </DialogBody>
        </Dialog>
      </Dialog>
    </div>
  );
};

export default Atendimentos;
