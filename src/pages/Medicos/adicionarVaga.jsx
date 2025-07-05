import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetResource } from '../../hooks/get/useGet.query';
import { useForm } from 'react-hook-form';
import { Input, Option, Select, Typography } from '@material-tailwind/react';
import { useResourcePost } from '../../hooks/post/usePost.query';
import { toast, ToastContainer } from 'react-toastify';

const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
  disabled,
  defaultValue,
  type = "text",
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
        disabled={disabled}
        defaultValue={defaultValue}
        type={type}
      />
    </>
  );
};

function AdicionarVaga() {
  const { id } = useParams();
  const [tipo, setTipo] = useState("");
  const { data, isLoading } = useGetResource("medicos", "medico", id);
  const { register, handleSubmit } = useForm();

  const { mutateAsync, isPending } =
    useResourcePost(
      "vagas",
      "vaga",
      () => {
        toast("Vaga adicionada com sucesso!",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: "bg-green-500 text-white p-2 rounded-md w-full px-10 py-5"
          }
        );
      },
      (err) => {
        toast("Erro ao adicionar vaga!",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: "bg-red-500 text-white p-2 rounded-md w-full px-10 py-5"
          }
        );
      }
    );

  
    const onSubmit = (data) => {
    const dataForm = {
      tipo,
      ...data,
    };
    mutateAsync(dataForm);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Médico não encontrado</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Adicionar vaga para <b>{data?.nome}</b></h1>
      <form
        className="mt-8 mb-2 px-5 max-w-4xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Grupo: Informações do Médico */}
        <fieldset className="mb-8 p-6 border border-blue-100 rounded-lg">
          <legend className="text-lg font-semibold text-blue-700 px-2">Informações do Médico</legend>
          <div className="flex flex-col space-y-6 mt-4">
            <InputForm label="Médico ID" name="medico_id" register={register} defaultValue={id} disabled />
            <InputForm label="Local" name="local" register={register} />
          </div>
        </fieldset>

        {/* Grupo: Informações da Vaga */}
        <fieldset className="mb-8 p-6 border border-blue-100 rounded-lg">
          <legend className="text-lg font-semibold text-blue-700 px-2">Informações da Vaga</legend>
          <div className="flex flex-col space-y-6 mt-4">
            <InputForm label="Data" name="data" type="date" register={register} />
            <div className="grid grid-cols-2 gap-4 my-10">
              <InputForm label="Hora Inicio" name="horario" register={register} type="time" className="w-full" />
              <InputForm label="Hora Fim" name="horario_fim" register={register} type="time" className="w-full" />
            </div>
            <div>
              <label className="block text-blue-gray-700 font-semibold mb-2">Tipo</label>
              <Select
                label="Tipo de vaga"
                onChange={(val) => setTipo(val)}
                className="border p-2 rounded w-full"
              >
                <Option value="retorno">Retorno</Option>
                <Option value="consulta">Consulta</Option>
                <Option value="procedimento">Procedimento</Option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 my-10">
              <InputForm label="Qtd." name="quantidade" register={register} />
              <InputForm label="Tempo entre atendimentos" name="tempo_entre_atendimentos" register={register} type="text" />
            </div>
          </div>
        </fieldset>

        <div className="mt-10 flex justify-center">
          <input
            value={isPending ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition text-white font-bold p-4 rounded-lg w-56 shadow-lg cursor-pointer text-lg tracking-wide"
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default AdicionarVaga
