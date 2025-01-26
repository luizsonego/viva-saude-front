import { Card, Input, Typography } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, Option } from "@material-tailwind/react";
import {
  useAcoesFetch,
  useMedicosFetch,
  useUnidadesFetch,
} from "../../hooks/get/useGet.query";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { InputMask, useMask } from "@react-input/mask";
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
      {/* <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography> */}
      <Input
        label={label}
        size="lg"
        placeholder={placeholder}
        // className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        // labelProps={{
        //   className: "before:content-none after:content-none",
        // }}
        {...register(name, { required })}
      />
    </>
  );
};

const Autoatendimento = () => {
  const { register, handleSubmit } = useForm();

  const inputRef = useMask({
    mask: "+0 (___) ___-__-__",
    replacement: { _: /\d/ },
  });

  const [paraQuem, setParaQuem] = useState();
  const [queDeseja, setQueDeseja] = useState();
  const [onde, setOnde] = useState();
  const [qualMedico, setQualMedico] = useState();
  const [outro, setOutro] = useState(false);

  const { data: unidadesData, isLoading: loadingUnidades } = useUnidadesFetch();
  const { data: medicosData, isLoading: loadingMedicos } = useMedicosFetch();
  const { data: acaoData, isLoading: loadingAcao } = useAcoesFetch();

  const [tipoAtendimento, setTipoAtendimento] = React.useState();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useAtendimentoPost,
  });

  useEffect(() => {
    if (paraQuem === "outra") setOutro(true);

    if (paraQuem !== "outra") setOutro(false);
  }, [paraQuem]);

  const onSubmit = (data) => {
    let sendForm = {
      para_quem: paraQuem,
      o_que_deseja: queDeseja,
      onde_deseja_ser_atendido: onde,
      medico_atendimento: qualMedico,
      ...data,
    };
    mutateAsync(sendForm);
  };

  const handleTipoAtendimento = (e) => {
    setTipoAtendimento(e);
  };

  const handleComplete = (data) => {
    console.log("Form completed!");
    console.log("data", data);
    // Handle form completion logic here
  };

  return (
    <>
      <Card className="container mx-auto w-full md:w-3/5  mt-10 p-4">
        <img
          src={"img/logo.png"}
          alt="Logo viva saude"
          className="w-24 h-24 aspect-square text-center mx-auto"
        />
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <FormWizard
            stepSize="sm"
            finishButtonTemplate={(handleComplete) => (
              <></>
              // <button className="finish-button" onClick={handleComplete}>
              //   finish
              // </button>
            )}
          >
            {/*  */}
            <FormWizard.TabContent title="Informações pessoais" icon="ti-user">
              <div className="mb-1 flex flex-col gap-6">
                <InputForm
                  label="Nome do titular do plano"
                  name="titular_plano"
                  register={register}
                />
                <InputForm
                  label="CPF do titularo do plano"
                  name="cpf_titular"
                  register={register}
                  inputRef={inputRef}
                />

                <InputForm
                  label="Whatsapp para contato"
                  name="whatsapp_titular"
                  register={register}
                />
                <Select
                  label="Para quem é a consulta?"
                  name="para_quem"
                  value={paraQuem}
                  onChange={(val) => setParaQuem(val)}
                >
                  <Option value="mim">Para mim</Option>
                  <Option value="outra">Para outra pessoa</Option>
                </Select>
                {outro ? (
                  <div className="mb-1 flex flex-col gap-6">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                      style={{ textTransform: "capitalize" }}
                    >
                      Para Quem?
                    </Typography>
                    <InputForm
                      label="Nome de quem vai ser atendido"
                      name="nome_outro"
                      register={register}
                    />
                    <InputForm
                      label="CPF de quem vai ser atendido"
                      name="cpf_outro"
                      register={register}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </FormWizard.TabContent>
            {/*  */}

            <FormWizard.TabContent title="Sobre o atendimento" icon="ti-user">
              <div className="mb-1 flex flex-col gap-6">
                {loadingAcao ? (
                  "carregando..."
                ) : (
                  <Select
                    label="O que deseja realizar?"
                    name="o_que_deseja"
                    value={queDeseja}
                    onChange={(val) => setQueDeseja(val)}
                  >
                    {acaoData?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.nome}
                      </Option>
                    ))}
                  </Select>
                )}

                {loadingUnidades ? (
                  "carregando..."
                ) : (
                  <Select
                    label="Onde deseja ser atendido"
                    name="onde_deseja_ser_atendido"
                    value={onde}
                    onChange={(val) => setOnde(val)}
                  >
                    {unidadesData?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.nome}
                      </Option>
                    ))}
                  </Select>
                )}
                {/* consulta, exame, etc um select para o tipo de atendimento*/}

                {loadingMedicos ? (
                  "carregando..."
                ) : (
                  <Select
                    label="Selecione o medico que deseja"
                    name="medico_atendimento"
                    value={qualMedico}
                    onChange={(val) => setQualMedico(val)}
                  >
                    {medicosData?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.nome}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
            </FormWizard.TabContent>
            {/*  */}
            <FormWizard.TabContent title="Mais detalhes" icon="ti-user">
              <div className="mb-1 flex flex-col gap-6">
                <InputForm
                  label="Alguma observação?"
                  name="observacoes"
                  register={register}
                />
              </div>
            </FormWizard.TabContent>
            {/*  */}
            {/* <FormWizard.TabContent title="Pagamento" icon="ti-user">
              <div className="mb-1 flex flex-col gap-6">
                <InputForm
                  label="Forma de pagamento "
                  name="nome"
                  register={register}
                />
              </div>
            </FormWizard.TabContent> */}
            {/*  */}
            <FormWizard.TabContent title="Finalizar" icon="ti-user">
              <div className="mb-1 flex flex-col gap-6">
                <input
                  value={isPending ? "Enviando..." : "Enviar"}
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
                />
              </div>
            </FormWizard.TabContent>
          </FormWizard>
        </form>
      </Card>
      <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
    </>
  );
};

export default Autoatendimento;
