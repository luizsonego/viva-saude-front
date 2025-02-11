import React from "react";
import { useResourcePut } from "../../../hooks/update/useUpdate.query";
import { useForm } from "react-hook-form";
import { Input, Textarea } from "@material-tailwind/react";

const AddComentario = ({ data }) => {
  const { register, handleSubmit, setValue, control } = useForm();

  const { mutateAsync, isPending } = useResourcePut(
    "atendimentos",
    "atendimento",
    () => {}
  );
  const onSubmit = (dataform) => {
    let form = {
      ...dataform,
    };
    mutateAsync(form);
  };
  return (
    <form
      className="mt-8 mb-2 w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Textarea
        label="Resumo do atendimento"
        name="comentario"
        defaultValue={data?.comentario}
        {...register("comentario")}
      />
      <Input
        // className="hidden"
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

export default AddComentario;
