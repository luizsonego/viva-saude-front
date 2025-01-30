import {
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetResource,
  useGetResources,
  useMedicoFetch,
} from "../../hooks/get/useGet.query";
import { useEffect } from "react";
import { useResourcePut } from "../../hooks/update/useUpdate.query";
// import InputForm from "../../components/Forms/Input";

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
  const [especialidade, setEspecialidade] = useState("");

  const { data, isLoading } = useGetResource("medicos", "medico", id);

  const { data: especialidadeData, isLoading: loadingEspecialidade } =
    useGetResources("especialidade", "especialidade");

  const { mutate, isPending } = useResourcePut("medico", "medico");

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("nome", data.nome);
      setValue("local", data.local);
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    const sendForm = {
      especialidade,
      ...formData,
    };
    mutate(sendForm);
  };

  function handleChangeEspecialidade(e) {
    setEspecialidade(e);
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
              <InputForm
                label="Local de atendimento"
                name="local"
                register={register}
              />

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
                    name="especialidade"
                    value={data?.especialidade}
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
            </div>
            <div style={{ display: "none" }}>
              <InputForm label="id" name="id" register={register} hidden />
            </div>
            <input
              value={isPending ? "Enviando..." : "Enviar"}
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
