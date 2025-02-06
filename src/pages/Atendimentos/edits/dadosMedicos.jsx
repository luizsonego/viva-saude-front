import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMedicosFetch } from "../../../hooks/get/useGet.query";
import { useResourcePut } from "../../../hooks/update/useUpdate.query";

const EditAtendimentoDadosMedicos = ({ data }) => {
  const { register, handleSubmit, setValue, control } = useForm();

  const [qualMedico, setQualMedico] = useState();

  const { data: medicosData, isLoading: loadingMedicos } = useMedicosFetch();

  const { mutateAsync, isPending } = useResourcePut(
    "atendimentos",
    "atendimento",
    () => {}
  );

  useEffect(() => {
    setValue("medico_atendimento", data.medico_atendimento);
  }, [data.medico_atendimento, setValue]);

  const onSubmit = (dataform) => {
    let form = {
      qualMedico,
      ...dataform,
    };
    mutateAsync(form);
  };

  return (
    <form
      className="mt-8 mb-2 w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Medico"
        name="medico_atendimento"
        defaultValue={data?.medico_atendimento}
        {...register("medico_atendimento")}
      />
      <Input
        label="O que deseja"
        name="o_que_deseja"
        defaultValue={data?.acoes?.nome}
        {...register("o_que_deseja")}
      />
      <Input
        label="Local"
        name="onde_deseja_ser_atendido"
        defaultValue={data?.onde_deseja_ser_atendido}
        {...register("onde_deseja_ser_atendido")}
      />

      <Input
        // className="hidden"
        disabled
        value={data.id}
        defaultValue={data.id}
        {...register("id")}
      />

      <input
        // value={isPending ? "Enviando..." : "Enviar"}
        type="submit"
        className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
      />
    </form>
  );
};

export default EditAtendimentoDadosMedicos;
