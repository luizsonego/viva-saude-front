import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMedicoPost } from "../../hooks/post/usePost.query";
import { useGruposFetch, useUnidadesFetch } from "../../hooks/get/useGet.query";
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

const Create = () => {
  const { register, handleSubmit } = useForm();
  const [onde, setOnde] = useState();
  const [modalSchedules, setModalSchedules] = useState();
  const [date, setDate] = useState();
  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();
  const { data: grupoData, isLoading: loadingGrupo } = useGruposFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useMedicoPost,
  });

  const onSubmit = (data) => {
    const sendForm = {
      local: onde,
      ...data,
    };
    mutateAsync(sendForm);
  };

  const handleOpenModalSchedule = () => {
    setModalSchedules(!modalSchedules);
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

              {loadingUnidades ? (
                "carregando..."
              ) : (
                <>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="-mb-3"
                    style={{ textTransform: "capitalize" }}
                  >
                    Local de atendimento
                  </Typography>
                  <Select
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    name="onde_deseja_ser_atendido"
                    value={onde}
                    onChange={(val) => setOnde(val)}
                  >
                    {unidadesData?.map((item) => (
                      <Option value={item.nome}>{item.nome}</Option>
                    ))}
                  </Select>
                </>
              )}

              {/* <InputForm
                label="Horarios Atendimento"
                name="atendimento_horarios"
                register={register}
              /> */}
              <hr />
              <Button onClick={handleOpenModalSchedule}>
                Adicionar Horario
              </Button>
              <hr />
              <InputForm label="Valor" name="valor" register={register} />

              {/* <InputForm label="Telefone" name="telefone" register={register} />
              <InputForm label="Whatsapp" name="whatsapp" register={register} />
              <InputForm label="Email" name="email" register={register} /> */}
              <input
                label="Avatar"
                name="avatar_url"
                type="file"
                register={register}
              />
            </div>
            <input
              value={isPending ? "Enviando..." : "Enviar"}
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
            />
          </form>
        </CardBody>
      </Card>

      <Dialog open={modalSchedules} handler={handleOpenModalSchedule}>
        <DialogHeader>Its a simple modal.</DialogHeader>
        <DialogBody>
          {/* <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            showOutsideDays
            className="border-0"
            classNames={{
              caption: "flex justify-center py-2 mb-4 relative items-center",
              caption_label: "text-sm font-medium text-gray-900",
              nav: "flex items-center",
              nav_button:
                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
              nav_button_previous: "absolute left-1.5",
              nav_button_next: "absolute right-1.5",
              table: "w-full border-collapse",
              head_row: "flex font-medium text-gray-900",
              head_cell: "m-0.5 w-9 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal",
              day_range_end: "day-range-end",
              day_selected:
                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
              day_today: "rounded-md bg-gray-200 text-gray-900",
              day_outside:
                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
              day_disabled: "text-gray-500 opacity-50",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: ({ ...props }) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          /> */}
        </DialogBody>
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
