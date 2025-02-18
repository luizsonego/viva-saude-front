import { Input, Option, Radio, Select } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useAcoesFetch,
  useGetResources,
  useMedicosFetch,
} from "../../../hooks/get/useGet.query";
import { useResourcePut } from "../../../hooks/update/useUpdate.query";
import { useSearchResource } from "../../../hooks/search/useSearch.query";
import DateTimePicker from "react-datetime-picker";

const EditAtendimentoDadosMedicos = ({ data, modal }) => {
  const { register, handleSubmit, setValue, control } = useForm();

  const [qualMedico, setQualMedico] = useState();
  const [openLocal, setOpenLocal] = useState(false);
  const [localEscolhido, setLocalEscolhido] = useState(false);
  const [queDeseja, setQueDeseja] = useState("");
  const [valueDateAgendamento, setValueDateAgendamento] = useState(new Date());

  // const { data: medicosData, isLoading: loadingMedicos } = useMedicosFetch();
  const { data: procedimentosData, isLoading: loadingProcedimentos } =
    useGetResources("medicos", "procedimentos");
  const { data: acaoData = [], isLoading: loadingAcao } = useAcoesFetch();
  const { data: searchMedicos = [], isLoading: loadingMedicos } =
    useSearchResource(
      "medicosSearch",
      "medicos-procedimento",
      queDeseja,
      queDeseja
    );

  const { data: searchLocalMedico = [], isLoading: loadingLocalMedico } =
    useSearchResource(
      "localMedicosSearch",
      "medicos-local",
      qualMedico,
      qualMedico
    );

  const { mutateAsync, isPending } = useResourcePut(
    "atendimento",
    "atendimento",
    () => {
      modal(false);
    }
  );

  useEffect(() => {
    setValue("medico_atendimento", data.medico_atendimento);
    setValueDateAgendamento(data.medico_atendimento_data);
  }, [data.medico_atendimento, data.medico_atendimento_data, setValue]);

  const onSubmit = (data) => {
    const opcoes = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", opcoes)
      .format(valueDateAgendamento)
      .replace(/\//g, "-")
      .replace(",", "");

    let dataForm = {
      medico_atendimento: qualMedico || data.medico_atendimento,
      medico: qualMedico || data.medico,
      onde_deseja_ser_atendido: localEscolhido || data.onde_deseja_ser_atendido,
      o_que_deseja: queDeseja || data.o_que_deseja,
      medico_atendimento_data: dataFormatada,
      ...data,
    };
    mutateAsync(dataForm);
  };

  return (
    <form
      className="mt-8 mb-2 w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {loadingProcedimentos ? (
        "carregando..."
      ) : (
        <Select
          label="O que deseja realizar?"
          name="o_que_deseja"
          value={queDeseja}
          onChange={(val) => {
            setQueDeseja(val);
            setOpenLocal(false);
          }}
        >
          {procedimentosData?.map((item, index) => (
            <Option key={index + 1} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      )}
      {loadingMedicos ? (
        "carregando..."
      ) : (
        <Select
          disabled={!queDeseja || loadingMedicos}
          label="Selecione o medico que deseja"
          name="medico_atendimento"
          value={qualMedico}
          onChange={(val) => {
            setQualMedico(val);
            setOpenLocal(true);
          }}
        >
          {searchMedicos?.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.nome}
            </Option>
          ))}
        </Select>
      )}
      {qualMedico && openLocal
        ? searchLocalMedico?.map((item, index) => (
            <div key={index + 1}>
              {item?.local?.map((lc, i) => (
                <Radio
                  onClick={(e) => setLocalEscolhido(e.target.value)}
                  name="local_atendimento"
                  key={i + 1}
                  label={lc.local}
                  value={lc.local}
                />
              ))}
            </div>
          ))
        : ""}

      <DateTimePicker
        onChange={setValueDateAgendamento}
        value={valueDateAgendamento}
      />

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

export default EditAtendimentoDadosMedicos;
