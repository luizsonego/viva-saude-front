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
  useGruposFetch,
  useUnidadesFetch,
} from "../../hooks/get/useGet.query";
import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

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
  const [addProcedimento, setAddProcedimento] = useState("");
  const [addProcedimentoValor, setAddProcedimentoValor] = useState("");

  const [schedule, setSchedule] = useState([]);

  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();
  const { data: grupoData, isLoading: loadingGrupo } = useGruposFetch();
  const { data: procedimentoData, isLoading: loadingProcedimento } =
    useAcoesFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useMedicoPost,
  });

  const onSubmit = (data) => {
    const sendForm = {
      // procedimento_valor: JSON.stringify(listaProcedimentos, null, 2),
      // horarios: JSON.stringify(schedule, null, 2),
      procedimento_valor: listaProcedimentos,
      horarios: schedule,
      ...data,
    };
    mutateAsync(sendForm);
  };

  const handleOpenModalSchedule = () => {
    setModalSchedules(!modalSchedules);
  };

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
              <InputForm
                label="Local de atendimentome"
                name="local"
                register={register}
              />

              {/* <InputForm
                label="Horarios Atendimento"
                name="atendimento_horarios"
                register={register}
              /> */}
              <hr />
              {/* <Button onClick={handleOpenModalSchedule}>
                Adicionar Horario
              </Button> */}
              <Typography
                variant="h6"
                color="blue-gray"
                className="-mb-3"
                style={{ textTransform: "capitalize" }}
              >
                Horarios
              </Typography>
              {daysOfWeek.map((day) => (
                <div key={day} style={{ marginBottom: "-20px" }}>
                  <Checkbox
                    label={day}
                    className=""
                    checked={!!schedule.find((item) => item.day === day)}
                    onChange={() => handleDayToggle(day)}
                  />

                  {schedule.find((item) => item.day === day) && (
                    <div style={{ marginLeft: "20px" }}>
                      {schedule
                        .find((item) => item.day === day)
                        .times.map((time, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <input
                              style={{
                                border: "1px solid #cecece",
                                padding: "5px 10px",
                                borderRadius: 5,
                              }}
                              type="time"
                              value={time.start}
                              onChange={(e) =>
                                handleTimeChange(
                                  day,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                            />
                            <span>até</span>
                            <input
                              style={{
                                border: "1px solid #cecece",
                                padding: "5px 10px",
                                borderRadius: 5,
                              }}
                              type="time"
                              value={time.end}
                              onChange={(e) =>
                                handleTimeChange(
                                  day,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant="text"
                              onClick={() => handleRemoveTimeBlock(day, index)}
                              style={{ color: "red" }}
                            >
                              Remover
                            </Button>
                          </div>
                        ))}
                      <Button
                        variant="gradient"
                        type="button"
                        onClick={() => handleAddTimeBlock(day)}
                        style={{ marginTop: "10px" }}
                      >
                        Adicionar Horário
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
