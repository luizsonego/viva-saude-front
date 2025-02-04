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
import { useAcoesFetch } from "../../hooks/get/useGet.query";

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

const CreateAtendimento = () => {
  const { register, handleSubmit } = useForm();
  const [queDeseja, setQueDeseja] = useState("");

  const { data: acaoData = [], isLoading: loadingAcao } = useAcoesFetch();
  console.log(acaoData);

  const onSubmit = (data) => {
    console.log("enviar", data);
  };
  return (
    <Card shadow={false} className="w-full justify-center">
      <CardBody>
        <form
          className="mt-8 mb-2 max-w-screen-lg "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm
              label="Titular do plano"
              name="titular_plano"
              register={register}
              required
            />
            <InputForm
              label="Telefone"
              name="whatsapp_titular"
              register={register}
            />
            <InputForm label="Cpf" name="cpf_titular" register={register} />
            {/* para quem? */}
            <InputForm
              label="Nome outro"
              name="nome_outro"
              register={register}
            />
            <InputForm label="Cpf outro" name="cpf_outro" register={register} />
            {/* para quem? */}

            <InputForm label="Perfil do cliente" name="" register={register} />
            <hr />

            {/* buscar no banco */}
            {loadingAcao ? (
              "carregando..."
            ) : (
              <Select
                label="O que deseja realizar?"
                name="o_que_deseja"
                value={queDeseja}
                onChange={(val) => {
                  setQueDeseja(val);
                }}
              >
                {acaoData?.map((item) => (
                  <Option key={item.id} value={item.nome}>
                    {item.nome}
                  </Option>
                ))}
              </Select>
            )}
            {/* <InputForm
              label="Solicitação"
              name="o_que_deseja"
              register={register}
            /> */}
            <InputForm
              label="Especialidade "
              name="telefone"
              register={register}
              required
            />
            <InputForm
              label="Médico "
              name="telefone"
              register={register}
              required
            />
            <InputForm
              label="Cidade para atendimento"
              name="telefone"
              register={register}
              required
            />
            <InputForm
              label="Data de agendamento"
              name="telefone"
              register={register}
              required
            />
            <hr />
            <InputForm
              label="Forma de pagamento "
              name="telefone"
              register={register}
              required
            />
            <hr />
            <InputForm
              label="Observação "
              name="telefone"
              register={register}
              required
            />
            <hr />
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateAtendimento;
