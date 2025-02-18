import {
  Radio,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAcoesFetch, useGetResources } from "../../hooks/get/useGet.query";
import { useSearchResource } from "../../hooks/search/useSearch.query";
import { useMutation } from "@tanstack/react-query";
import { useAtendimentoPost } from "../../hooks/post/usePost.query";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { useNavigate } from "react-router-dom";

const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
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
        type={type}
        {...register(name, { required })}
      />
    </>
  );
};

const CreateAtendimento = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  const [queDeseja, setQueDeseja] = useState("");
  const [paraQuem, setParaQuem] = useState("");
  const [outro, setOutro] = useState(false);
  const [qualMedico, setQualMedico] = useState("");
  const [valuePerfilAtendimento, setValuePerfilAtendimento] = useState("");
  const [openLocal, setOpenLocal] = useState(false);

  const [localEscolhido, setLocalEscolhido] = useState(false);
  const [emEspera, setEmEspera] = useState(0);
  const [aguardandoVaga, setAguardandoVaga] = useState(0);
  const [valueDateAgendamento, setValueDateAgendamento] = useState(new Date());

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useAtendimentoPost,
    onSuccess: () => {
      navigate(-1);
    },
  });

  useEffect(() => {
    setValue("atendido_por", "Criado manualmente");
    if (paraQuem === "outra") setOutro(true);

    if (paraQuem !== "outra") setOutro(false);
  }, [paraQuem, setValue]);

  const onSubmit = (sendData) => {
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
      para_quem: paraQuem,
      medico_atendimento: qualMedico,
      medico: qualMedico,
      onde_deseja_ser_atendido: localEscolhido,
      medico_atendimento_data: dataFormatada,
      o_que_deseja: queDeseja,
      em_espera: emEspera,
      aguardando_vaga: aguardandoVaga,
      perfil_cliente: valuePerfilAtendimento,
      ...sendData,
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
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <InputForm
              label="Titular do plano"
              name="titular_plano"
              register={register}
            />
            <InputForm
              label="Telefone titular plano"
              name="whatsapp_titular"
              register={register}
            />
            <InputForm
              label="Cpf titular plano"
              name="cpf_titular"
              register={register}
            />
            <Select
              label="Perfil do cliente"
              name="perfil_cliente"
              value={acaoData}
              onChange={(val) => setValuePerfilAtendimento(val)}
            >
              <Option value="Áudio">Áudio</Option>
              <Option value="Mensagem">Mensagem</Option>
              <Option value="Ligação">Ligação</Option>
              <Option value="Site">Site</Option>
            </Select>
          </fieldset>

          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <Select
              label="Para quem é a consulta?"
              name="para_quem"
              value={paraQuem}
              onChange={(val) => setParaQuem(val)}
            >
              <Option value="titular">Para titular</Option>
              <Option value="outra">Para outra pessoa</Option>
            </Select>
            {outro ? (
              <>
                <InputForm
                  label="Nome outro"
                  name="nome_outro"
                  register={register}
                />
                <InputForm
                  label="Cpf outro"
                  name="cpf_outro"
                  register={register}
                />
              </>
            ) : (
              ""
            )}
          </fieldset>

          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
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
          </fieldset>
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <DateTimePicker
              onChange={setValueDateAgendamento}
              value={valueDateAgendamento}
              minDate={new Date()}
              format="dd/MM/y H:mm"
            />
            {/* <InputForm
              label="Data de agendamento"
              name="medico_atendimento_data"
              register={register}
              type=""
            /> */}
          </fieldset>
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <InputForm
              label="Forma de pagamento "
              name="telefone"
              register={register}
            />
          </fieldset>
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <InputForm
              label="Observação "
              name="observacoes"
              register={register}
            />
          </fieldset>
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            <Checkbox
              name="em_espera"
              label="Colocar em fila de espera"
              value={emEspera}
              onChange={(e) => setEmEspera(e.target.checked)}
            />
            <Checkbox
              name="aguardando_vaga"
              label="Colocar em Aguardando vaga"
              value={aguardandoVaga}
              onChange={(e) => setAguardandoVaga(e.target.checked)}
            />
          </fieldset>

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

export default CreateAtendimento;
