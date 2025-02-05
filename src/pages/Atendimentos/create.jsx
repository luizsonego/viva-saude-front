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
import { useAcoesFetch } from "../../hooks/get/useGet.query";
import { useSearchResource } from "../../hooks/search/useSearch.query";
import { useMutation } from "@tanstack/react-query";
import { useAtendimentoPost } from "../../hooks/post/usePost.query";

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
  const { register, handleSubmit, setValue } = useForm();

  const [queDeseja, setQueDeseja] = useState("");
  const [paraQuem, setParaQuem] = useState("");
  const [outro, setOutro] = useState(false);
  const [qualMedico, setQualMedico] = useState("");
  const [openLocal, setOpenLocal] = useState(false);
  const [localEscolhido, setLocalEscolhido] = useState(false);
  const [emEspera, setEmEspera] = useState(0);
  const [aguardandoVaga, setAguardandoVaga] = useState(0);

  const { data: acaoData = [], isLoading: loadingAcao } = useAcoesFetch();
  const { data: searchMedicos = [], isLoading: loadingMedicos } =
    useSearchResource(
      "medicosSearch",
      "medicos-procedimento",
      queDeseja,
      queDeseja
    );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useAtendimentoPost,
  });

  useEffect(() => {
    setValue("atendido_por", "Criado manualmente");
    if (paraQuem === "outra") setOutro(true);

    if (paraQuem !== "outra") setOutro(false);
  }, [paraQuem, setValue]);

  const onSubmit = (data) => {
    let dataForm = {
      para_quem: paraQuem,
      medico_atendimento: qualMedico,
      medico: qualMedico,
      onde_deseja_ser_atendido: localEscolhido,
      // medico_atendimento_data: localEscolhido,
      o_que_deseja: queDeseja,
      em_espera: emEspera,
      aguardando_vaga: aguardandoVaga,
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
            <InputForm
              label="Perfil do cliente"
              name="perfil_cliente"
              register={register}
            />
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
                  <Option key={item.id} value={item.id}>
                    {item.nome}
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
              ? searchMedicos?.map((item, index) => (
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
            <InputForm
              label="Data de agendamento"
              name="medico_atendimento_data"
              register={register}
            />
          </fieldset>
          <fieldset className="mb-1 flex flex-col gap-6 border p-5">
            {/* <InputForm
              label="Forma de pagamento "
              name="telefone"
              register={register}
            /> */}
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
