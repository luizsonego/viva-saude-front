import React, { useState } from 'react'
import { useGetResource } from '../../../hooks/get/useGet.query';
import { Radio, Typography } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { useResourcePut } from '../../../hooks/update/useUpdate.query';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const formatarData = (data) => {
    if (!data) return ''
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};

function Vagas({ data, modal }) {
  const [localEscolhido, setLocalEscolhido] = useState(null);
  const [erro, setErro] = useState("");
  const { register, handleSubmit, setValue, control, reset } = useForm();
  const { data: vagasData, isLoading, refetch } = useGetResource("vagas", "vagas", data?.medico);

  const { mutateAsync, isPending } = useResourcePut(
    "atendimento",
    "add-vaga",
    () => {
      modal(false);
    }
  );

  if (isLoading || isPending) return (
    <div className="flex flex-col items-center justify-center py-10">
      <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
      <span className="text-blue-500 font-medium">Carregando vagas...</span>
    </div>
  );
  if (!Array.isArray(vagasData) || vagasData.length === 0) return (
    <div className="flex flex-col items-center justify-center py-10">
      <InformationCircleIcon className="h-8 w-8 text-gray-400 mb-2" />
      <span className="text-gray-500">Nenhuma vaga encontrada</span>
    </div>
  );

  const onSubmit = async (values) => {
    setErro("");
    if (!localEscolhido) {
      setErro("Selecione o local e data da vaga!");
      return;
    }
    if (!values.hora_atendimento) {
      setErro("Selecione o horário do atendimento!");
      return;
    }
    const dataForm = {
      id: data.id,
      local_atendimento: localEscolhido,
      hora_atendimento: values.hora_atendimento,
    };
    await mutateAsync(dataForm);
    reset();
    setLocalEscolhido(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-1">Vagas disponíveis</h1>
      <p className="text-gray-600 mb-4 text-sm flex items-center gap-2">
        <InformationCircleIcon className="h-5 w-5 text-blue-400" />
        Selecione o horário, dia e local para o atendimento.
      </p>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="hora_atendimento">Horário do atendimento</label>
          <input
            id="hora_atendimento"
            type="time"
            {...register("hora_atendimento")}
            className="w-full bg-white rounded-md p-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            placeholder="Selecione o horário"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto pr-2">
          {Array.isArray(vagasData) && vagasData.map((vaga, index) => {
            const isSelected = localEscolhido && localEscolhido.id === vaga.id;
            const vagasDisponiveis = vaga.quantidade - vaga.atendimento;
            return (
              <div
                key={vaga.id}
                className={`border rounded-lg p-4 shadow-sm flex items-center gap-4 cursor-pointer transition hover:border-blue-400 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} ${vagasDisponiveis <= 0 ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => vagasDisponiveis > 0 && setLocalEscolhido({ id: vaga.id, local: vaga.local, data: vaga.data })}
              >
                <input
                  type="radio"
                  name="local_atendimento"
                  checked={isSelected}
                  readOnly
                  className="accent-blue-600 h-5 w-5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-blue-700 text-lg">{formatarData(vaga.data)}</span>
                    <span className="text-xs text-gray-500">{vaga.local}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <strong>{vaga.tipo}</strong> - Vagas disponíveis: <strong className={vagasDisponiveis > 2 ? 'text-green-600' : 'text-yellow-600'}>{vagasDisponiveis}</strong>
                  </div>
                  <div className="text-xs text-gray-500">Horário: <strong>{vaga.horario} às {vaga.horario_fim}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
        {erro && <div className="text-red-500 text-sm font-medium flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>{erro}</div>}
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition w-full mt-2 flex items-center justify-center gap-2 ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={isPending}
        >
          {isPending && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
          {isPending ? 'Enviando...' : 'Confirmar Vaga'}
        </button>
      </form>
    </div>
  );
}

export default Vagas
