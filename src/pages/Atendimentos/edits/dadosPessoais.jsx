import { Input, Typography } from "@material-tailwind/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useResourcePut } from "../../../hooks/update/useUpdate.query";

const EditAtendimentoDadosPessoais = ({ data, modal }) => {
  const { register, handleSubmit, setValue } = useForm();

  const { mutateAsync, isPending } = useResourcePut(
    "atendimento",
    "atendimento",
    () => {
      modal(false);
    }
  );

  const onSubmit = (dataform) => {
    mutateAsync(dataform);
  };

  return (
    <form
      className="mt-8 mb-2 w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* <InputForm /> */}
      <Input
        label="nome titular"
        name="titular_plano"
        defaultValue={data?.titular_plano}
        {...register("titular_plano")}
      />

      <Input
        label="cpf titular"
        {...register("cpf_titular")}
        defaultValue={data?.cpf_titular}
      />
      <Input
        label="whatsapp titular"
        {...register("whatsapp_titular")}
        defaultValue={data?.whatsapp_titular}
      />
      <Input
        label="perfil atendimento"
        {...register("perfil_cliente")}
        defaultValue={data?.perfil_cliente}
      />
      <Input
        label="observação"
        {...register("observacoes")}
        defaultValue={data?.observacoes}
      />
      {data.para_quem === "outra" ? (
        <>
          <Typography className="text-xs !font-bold" color="blue-gray">
            Dados do de outra pessoa para ser atendida
          </Typography>
          <Input
            label="nome outro"
            {...register("nome_outro")}
            defaultValue={data?.nome_outro}
          />
          <Input
            label="cpf outro"
            {...register("cpf_outro")}
            defaultValue={data?.cpf_outro}
          />
        </>
      ) : (
        ""
      )}

      <Input
        className="hidden"
        disabled
        value={data.id}
        defaultValue={data.id}
        {...register("id")}
      />

      <input
        value={isPending ? "Enviando..." : "Enviar"}
        type="submit"
        className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
      />
    </form>
  );
};

export default EditAtendimentoDadosPessoais;
