import {
  Card,
  CardBody,
  Input,
  Select,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMedicoFetch } from "../../hooks/get/useGet.query";
import { useEffect } from "react";

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

const EditMedico = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();

  const { data } = useMedicoFetch(id);

  useEffect(() => {
    if (data) {
      setValue("nome", data.nome);
    }
  }, [data, setValue]);

  console.log(data);
  return (
    <>
      <Card shadow={false} className="w-full justify-center">
        <CardBody>
          <form
            className="mt-8 mb-2 max-w-screen-lg "
            // onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1 flex flex-col gap-6">
              <InputForm label="Nome" name="nome" register={register} />

              {/* {loadingUnidades ? (
                "carregando..."
              ) : ( */}

              {/* )} */}

              {/* <InputForm
                label="Horarios Atendimento"
                name="atendimento_horarios"
                register={register}
              /> */}
              <hr />
              {/* <Button onClick={handleOpenModalSchedule}>
                Adicionar Horario
              </Button> */}
              <hr />
              <InputForm label="Valor" name="valor" register={register} />

              {/* <InputForm label="Telefone" name="telefone" register={register} />
              <InputForm label="Whatsapp" name="whatsapp" register={register} />
              <InputForm label="Email" name="email" register={register} /> */}
              {/* <input
                label="Avatar"
                name="avatar_url"
                type="file"
                register={register}
              /> */}
            </div>
            <input
              // value={isPending ? "Enviando..." : "Enviar"}
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
            />
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default EditMedico;
