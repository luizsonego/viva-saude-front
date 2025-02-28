import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMedicoPost } from "../../hooks/post/usePost.query";
import {
  useAcoesFetch,
  useGetResources,
  useGruposFetch,
  useUnidadesFetch,
} from "../../hooks/get/useGet.query";
import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useSearchResource } from "../../hooks/search/useSearch.query";
import MultiSelectDropdown from "../../components/Forms/MultiSelectDropdown";

const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
}) => {
  return (
    <>
      <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography>
      <Input
        size="lg"
        placeholder={placeholder}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...register(name, { required })}
      />
    </>
  );
};

const daysOfWeek = [
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
];

const lista = [];
const Create = () => {
  const { register, handleSubmit } = useForm();
  const [onde, setOnde] = useState();
  const [modalSchedules, setModalSchedules] = useState();
  const [date, setDate] = useState();
  const [listaProcedimentos, setListaProcedimentos] = useState(lista);
  const [listaEtiquetas, setListaEtiquetas] = useState(lista);
  const [addProcedimento, setAddProcedimento] = useState("");
  const [addProcedimentoValor, setAddProcedimentoValor] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const [queGrupo, setQueGrupo] = useState("");
  const [queEtiqueta, setQueEtiqueta] = useState("");

  const [listaLocalAtendimento, setListaLocalAtendimento] = useState([]);
  const [addLocalAtendimento, setAddLocalAtendimento] = useState("");
  const [
    addLocalAtendimentoVagasConsulta,
    setAddLocalAtendimentoVagasConsulta,
  ] = useState();
  const [addLocalAtendimentoVagasRetorno, setAddLocalAtendimentoVagasRetorno] =
    useState();
  const [
    addLocalAtendimentoVagasProcedimento,
    setAddLocalAtendimentoVagasProcedimento,
  ] = useState();

  const [schedule, setSchedule] = useState([]);

  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();
  const { data: procedimentoData, isLoading: loadingProcedimento } =
    useAcoesFetch();
  const { data: especialidadeData, isLoading: loadingEspecialidade } =
    useGetResources("especialidade", "especialidade");

  const { data: grupoData, isLoading: loadingGrupo } = useGetResources(
    "grupos",
    "grupos"
  );
  const { data: searchEtiquetas = [], isLoading: loadingEtiquetas } =
    useSearchResource("medicosSearch", "etiquetas-grupo", queGrupo, queGrupo);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useMedicoPost,
  });

  const onSubmit = (data) => {
    const sendForm = {
      // procedimento_valor: JSON.stringify(listaProcedimentos, null, 2),
      // horarios: JSON.stringify(schedule, null, 2),
      procedimento_valor: listaProcedimentos,
      horarios: schedule,
      especialidade,
      local: listaLocalAtendimento,
      etiquetas: queEtiqueta,
      ...data,
    };
    mutateAsync(sendForm);
  };

  const handleOpenModalSchedule = () => {
    setModalSchedules(!modalSchedules);
  };

  function handleChangeEspecialidade(e) {
    setEspecialidade(e);
  }
  function handleChangeProcedimento(e) {
    setAddProcedimento(e);
  }
  function handleChangeValor(e) {
    setAddProcedimentoValor(e.target.value);
  }

  function handleAdd() {
    let min = Math.ceil(1);
    let max = Math.ceil(100);
    let mt = Math.floor(Math.random() * (10 - 2) + 1);
    const novaLista = listaProcedimentos.concat({
      id: Math.floor(Math.random() * (max - min) + min) * mt,
      procedimento: addProcedimento,
      valor: addProcedimentoValor,
    });
    setListaProcedimentos(novaLista);
  }
  function handleAddEtiqueta() {
    let min = Math.ceil(1);
    let max = Math.ceil(100);
    let mt = Math.floor(Math.random() * (10 - 2) + 1);
    const novaLista = listaProcedimentos.concat({
      id: Math.floor(Math.random() * (max - min) + min) * mt,
      procedimento: addProcedimento,
      valor: addProcedimentoValor,
    });
    setListaProcedimentos(novaLista);
  }

  function handleRemove(id) {
    const novaLista = listaProcedimentos.filter((item) => {
      return item.id !== id;
    });

    setListaProcedimentos(novaLista);
  }

  const handleDayToggle = (day) => {
    const dayExists = schedule.find((item) => item.day === day);

    if (dayExists) {
      // Remove the day if it's already selected
      setSchedule(schedule.filter((item) => item.day !== day));
    } else {
      // Add the day with an empty times array
      setSchedule([...schedule, { day, times: [] }]);
    }
  };
  const handleAddTimeBlock = (day) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? { ...item, times: [...item.times, { start: "", end: "" }] }
          : item
      )
    );
  };
  const handleTimeChange = (day, index, type, value) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              times: item.times.map((time, i) =>
                i === index ? { ...time, [type]: value } : time
              ),
            }
          : item
      )
    );
  };
  const handleRemoveTimeBlock = (day, index) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? { ...item, times: item.times.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  function handleChangeLocalAtendimento(e) {
    setAddLocalAtendimento(e.target.value);
  }
  function handleChangeLocalAtendimentoVagasConsulta(e) {
    setAddLocalAtendimentoVagasConsulta(e.target.value);
  }
  function handleChangeLocalAtendimentoVagasRetorno(e) {
    setAddLocalAtendimentoVagasRetorno(e.target.value);
  }
  function handleChangeLocalAtendimentoVagasProcedimento(e) {
    setAddLocalAtendimentoVagasProcedimento(e.target.value);
  }
  function handleRemoveLocalAtendimento(id) {
    const novaLista = listaLocalAtendimento.filter((item) => {
      return item.id !== id;
    });

    setListaLocalAtendimento(novaLista);
  }
  function handleAddLocalAtendimento() {
    let min = Math.ceil(1);
    let max = Math.ceil(100);
    let mt = Math.floor(Math.random() * (10 - 2) + 1);
    const novaLista = listaLocalAtendimento.concat({
      id: Math.floor(Math.random() * (max - min) + min) * mt,
      local: addLocalAtendimento,
      consulta: addLocalAtendimentoVagasConsulta,
      retorno: addLocalAtendimentoVagasRetorno,
      procedimento: addLocalAtendimentoVagasProcedimento,
    });
    setListaLocalAtendimento(novaLista);
  }

  return (
    <>
      <Card shadow={false} className="w-full justify-center">
        <CardBody>
          <form
            className="mt-8 mb-2 max-w-screen-lg "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1 flex flex-col gap-6">
              <InputForm label="Nome" name="nome" register={register} />

              <div className="flex gap-4">
                <div>
                  <div className="mb-1 flex flex-row gap-6">
                    <fieldset className="py-5 m-0 w-64 flex-1">
                      <legend> Local</legend>
                      <Input
                        label="Local de Atendimento"
                        type="text"
                        onChange={handleChangeLocalAtendimento}
                        value={addLocalAtendimento}
                      />
                    </fieldset>
                    <fieldset className="flex flex-row gap-1 border p-5 grid grid-cols-3 w-2/4">
                      <legend>Vagas</legend>
                      <Input
                        style={{ width: "140px" }}
                        label="Consultas"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasConsulta}
                        value={addLocalAtendimentoVagasConsulta}
                        placeholder="Consultas"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                      <Input
                        style={{ width: "140px" }}
                        label="Returno"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasRetorno}
                        value={addLocalAtendimentoVagasRetorno}
                        placeholder="Retorno"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                      <Input
                        style={{ width: "140px" }}
                        label="Procedimentos"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasProcedimento}
                        value={addLocalAtendimentoVagasProcedimento}
                        placeholder="Procedimentos"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                    </fieldset>
                    <Button
                      type="button"
                      onClick={handleAddLocalAtendimento}
                      className="mt-6"
                      variant="text"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              {listaLocalAtendimento.length < 1 ? (
                ""
              ) : (
                <Card className="w-full md:w-full overflow-hidden rounded-md">
                  <List>
                    {listaLocalAtendimento.map((item) => (
                      <ListItem key={item.id}>
                        <List>
                          <div>
                            <Typography variant="h6" color="blue-gray">
                              Local: {item.local}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal"
                            >
                              <div className="flex flex-row gap-4">
                                <span>- Consultas: {item.consulta}</span>
                                <span>- Retorno: {item.retorno}</span>
                                <span>
                                  - Procedimentos: {item.procedimento}
                                </span>
                              </div>
                            </Typography>
                          </div>
                        </List>
                        <ListItemSuffix>
                          <Button
                            variant="gradient"
                            className="pb-5 ml-5 pt-5"
                            onClick={() =>
                              handleRemoveLocalAtendimento(item.id)
                            }
                          >
                            x
                          </Button>
                        </ListItemSuffix>
                        {/* <ListItemPrefix>
                          <Button
                            variant="gradient"
                            className="h-5 p-4 pt-1 pb-3 ml-5"
                            onClick={() =>
                              handleRemoveLocalAtendimento(item.id)
                            }
                          >
                            x
                          </Button>
                        </ListItemPrefix> */}
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}
              {loadingEspecialidade ? (
                "carregando..."
              ) : (
                <>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className=""
                    style={{ textTransform: "capitalize" }}
                  >
                    Especialidade
                  </Typography>
                  <Select
                    // name="onde_deseja_ser_atendido"
                    value={especialidade}
                    onChange={handleChangeEspecialidade}
                  >
                    {especialidadeData?.map((item) => (
                      <Option key={item.id} value={item.nome}>
                        {item.nome}
                      </Option>
                    ))}
                  </Select>
                </>
              )}
              <hr />
              <div className="flex gap-4">
                <div>
                  {loadingProcedimento ? (
                    "carregando..."
                  ) : (
                    <>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className=""
                        style={{ textTransform: "capitalize" }}
                      >
                        Procedimento
                      </Typography>
                      <Select
                        // name="onde_deseja_ser_atendido"
                        value={addProcedimento}
                        onChange={handleChangeProcedimento}
                      >
                        {procedimentoData?.map((item) => (
                          <Option key={item.id} value={item.nome}>
                            {item.nome}
                          </Option>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className=""
                    style={{ textTransform: "capitalize" }}
                  >
                    Valor
                  </Typography>
                  <Input
                    type="text"
                    onChange={handleChangeValor}
                    value={addProcedimentoValor}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={handleAdd}
                    className="mt-6"
                    variant="text"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
              {listaProcedimentos.length < 1 ? (
                ""
              ) : (
                <Card className="w-full md:w-96 overflow-hidden rounded-md">
                  <List>
                    {listaProcedimentos.map((item) => (
                      <ListItem key={item.id}>
                        {item.procedimento}
                        <ListItemSuffix>{item.valor}</ListItemSuffix>
                        <ListItemPrefix>
                          <Button
                            variant="gradient"
                            className="h-5 p-4 pt-1 pb-3 ml-5"
                            onClick={() => handleRemove(item.id)}
                          >
                            (x)
                          </Button>
                        </ListItemPrefix>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}
              <hr />
              {/* <input
                label="Avatar"
                name="avatar_url"
                type="file"
                register={register}
              /> */}
              <div className="flex gap-4">
                {loadingGrupo ? (
                  "carregando..."
                ) : (
                  <Select
                    label="Grupo"
                    name="grupo"
                    value={queGrupo}
                    onChange={(val) => {
                      setQueGrupo(val);
                    }}
                  >
                    {grupoData?.map((item, index) => (
                      <Option key={index + 1} value={item.id}>
                        {item.servico}
                      </Option>
                    ))}
                  </Select>
                )}
                <div></div>
              </div>
              {loadingEtiquetas ? (
                "carregando..."
              ) : (
                <MultiSelectDropdown
                  style={{ width: "100%", zIndex: 999 }}
                  disabled={!queGrupo || loadingEtiquetas}
                  formFieldName={"countries"}
                  options={searchEtiquetas}
                  onChange={(selectedCountries) => {
                    setQueEtiqueta(selectedCountries);
                  }}
                  prompt="Selecione uma ou mais etiquetas"
                />
              )}
            </div>

            <input
              value={isPending ? "Enviando..." : "Enviar"}
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
            />
          </form>
        </CardBody>
      </Card>

      <Dialog open={modalSchedules} handler={handleOpenModalSchedule} size="xl">
        <DialogHeader>Horarios de atendimento</DialogHeader>
        <DialogBody></DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenModalSchedule}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleOpenModalSchedule}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Create;
