import {
  Radio,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
  Checkbox,
  Spinner,
  Alert,
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
// import { toast } from "react-hot-toast";

// Reusable Input Component
const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
  type = "text",
  error,
}) => {
  return (
    <div className="w-full">
      <Typography
        variant="h6"
        color="blue-gray"
        className="mb-2"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography>
      <Input
        size="lg"
        placeholder={placeholder}
        className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${error ? '!border-red-500' : ''}`}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        type={type}
        {...register(name, { required })}
      />
      {error && (
        <Typography variant="small" color="red" className="mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
};

// Form Section Component
const FormSection = ({ title, children }) => (
  <fieldset className="mb-4 flex flex-col gap-6 border rounded-lg p-6 bg-white shadow-sm">
    <Typography variant="h5" color="blue-gray" className="mb-4">
      {title}
    </Typography>
    {children}
  </fieldset>
);

const CreateAtendimento = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // State management
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

  // Data fetching
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

  // Mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: useAtendimentoPost,
    onSuccess: () => {
      // toast.success("Atendimento criado com sucesso!");
      navigate(-1);
    },
    onError: (error) => {
      // toast.error(`Erro ao criar atendimento: ${error.message}`);
    },
  });

  useEffect(() => {
    setValue("atendido_por", "Criado manualmente");
    if (paraQuem === "outra") setOutro(true);
    if (paraQuem !== "outra") setOutro(false);
  }, [paraQuem, setValue]);

  const onSubmit = async (sendData) => {
    try {
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

      const dataForm = {
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

      await mutateAsync(dataForm);
    } catch (error) {
      // toast.error("Erro ao processar o formulário");
    }
  };

  return (
    <Card shadow={false} className="w-full max-w-4xl mx-auto my-8">
      <CardBody>
        <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
          Novo Atendimento
        </Typography>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormSection title="Informações do Plano">
            <InputForm
              label="Titular do plano"
              name="titular_plano"
              register={register}
              error={errors.titular_plano?.message}
            />
            <InputForm
              label="Telefone titular plano"
              name="whatsapp_titular"
              register={register}
              error={errors.whatsapp_titular?.message}
            />
            <InputForm
              label="Cpf titular plano"
              name="cpf_titular"
              register={register}
              error={errors.cpf_titular?.message}
            />
            <Select
              label="Perfil do cliente"
              name="perfil_cliente"
              value={valuePerfilAtendimento}
              onChange={(val) => setValuePerfilAtendimento(val)}
            >
              <Option value="Áudio">Áudio</Option>
              <Option value="Mensagem">Mensagem</Option>
              <Option value="Ligação">Ligação</Option>
              <Option value="Site">Site</Option>
            </Select>
          </FormSection>

          <FormSection title="Detalhes da Consulta">
            <Select
              label="Para quem é a consulta?"
              name="para_quem"
              value={paraQuem}
              onChange={(val) => setParaQuem(val)}
            >
              <Option value="titular">Para titular</Option>
              <Option value="outra">Para outra pessoa</Option>
            </Select>
            
            {outro && (
              <div className="space-y-4">
                <InputForm
                  label="Nome outro"
                  name="nome_outro"
                  register={register}
                  error={errors.nome_outro?.message}
                />
                <InputForm
                  label="Cpf outro"
                  name="cpf_outro"
                  register={register}
                  error={errors.cpf_outro?.message}
                />
              </div>
            )}
          </FormSection>

          <FormSection title="Procedimento e Médico">
            {loadingProcedimentos ? (
              <div className="flex justify-center">
                <Spinner className="h-8 w-8" />
              </div>
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

            {queDeseja && (
              loadingMedicos ? (
                <div className="flex justify-center">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <Select
                  label="Selecione o médico"
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
              )
            )}

            {qualMedico && openLocal && (
              <div className="space-y-2">
                <Typography variant="h6" color="blue-gray">
                  Local de Atendimento
                </Typography>
                {loadingLocalMedico ? (
                  <div className="flex justify-center">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : (
                  searchLocalMedico?.map((item, index) => (
                    <div key={index + 1} className="space-y-2">
                      {item?.local?.map((lc, i) => (
                        <Radio
                          key={i + 1}
                          name="local_atendimento"
                          label={lc.local}
                          value={lc.local}
                          onChange={(e) => setLocalEscolhido(e.target.value)}
                          className="hover:bg-blue-gray-50 p-2 rounded"
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </FormSection>

          <FormSection title="Agendamento">
            <div className="w-full">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Data e Hora do Atendimento
              </Typography>
              <DateTimePicker
                onChange={setValueDateAgendamento}
                value={valueDateAgendamento}
                minDate={new Date()}
                format="dd/MM/y H:mm"
                className="w-full"
              />
            </div>
          </FormSection>

          <FormSection title="Informações Adicionais">
            <InputForm
              label="Forma de pagamento"
              name="telefone"
              register={register}
              error={errors.telefone?.message}
            />
            <InputForm
              label="Observação"
              name="observacoes"
              register={register}
              error={errors.observacoes?.message}
            />
          </FormSection>

          <FormSection title="Status do Atendimento">
            <div className="space-y-4">
              <Checkbox
                name="em_espera"
                label="Colocar em fila de espera"
                checked={emEspera}
                onChange={(e) => setEmEspera(e.target.checked ? 1 : 0)}
                className="hover:bg-blue-gray-50 p-2 rounded"
              />
              <Checkbox
                name="aguardando_vaga"
                label="Colocar em Aguardando vaga"
                checked={aguardandoVaga}
                onChange={(e) => setAguardandoVaga(e.target.checked ? 1 : 0)}
                className="hover:bg-blue-gray-50 p-2 rounded"
              />
            </div>
          </FormSection>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
              ${isPending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner className="h-5 w-5 mr-2" />
                Enviando...
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateAtendimento;
