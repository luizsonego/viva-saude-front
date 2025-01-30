import {
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAtendentePost } from "../../hooks/post/usePost.query";
import { useUnidadesFetch } from "../../hooks/get/useGet.query";

const CreateAtendente = () => {
  const { register, handleSubmit } = useForm();
  const [unidade, setUnidade] = useState("");
  const [cargo, setCargo] = useState("");

  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useAtendentePost,
  });

  const onSubmit = (data) => {
    const dataForm = {
      unidade,
      cargo,
      ...data,
    };
    mutateAsync(dataForm);
  };
  return (
    <Card shadow={false} className="w-full justify-center">
      <CardBody>
        <form
          className="mt-8 mb-2 max-w-screen-lg "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="Nome" name="name" register={register} />
            <InputForm label="Email" name="email" register={register} />
            <InputForm label="Senha" name="password" register={register} />
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
                  Unidade
                </Typography>
                <Select
                  name="unidade"
                  value={unidade}
                  onChange={(val) => setUnidade(val)}
                >
                  {unidadesData?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.nome}
                    </Option>
                  ))}
                </Select>
              </>
            )}

            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3"
              style={{ textTransform: "capitalize" }}
            >
              Cargo
            </Typography>
            <Select
              name="cargo"
              value={cargo}
              onChange={(val) => setCargo(val)}
            >
              <Option value="administrador">Administrador</Option>
              <Option value="atendente">Atendente</Option>
              <Option value="supervisor">Supervisor</Option>
            </Select>
          </div>
          <input
            value={isPending ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateAtendente;

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
