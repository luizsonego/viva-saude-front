import {
  Button,
  Card,
  CardBody,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAcoesFetch,
  useGetResource,
  useGetResources,
  useMedicoFetch,
} from "../../hooks/get/useGet.query";
import { useEffect } from "react";
import { useResourcePut } from "../../hooks/update/useUpdate.query";
import MultiSelectDropdown from "../../components/Forms/MultiSelectDropdown";
import { useSearchResource } from "../../hooks/search/useSearch.query";

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

const EditMedico = () => {
  const { id } = useParams();
  const history = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [especialidade, setEspecialidade] = useState("");

  const [listaProcedimentos, setListaProcedimentos] = useState([]);
  const [addProcedimento, setAddProcedimento] = useState("");
  const [addProcedimentoValor, setAddProcedimentoValor] = useState("");
  const [listaLocalAtendimento, setListaLocalAtendimento] = useState([]);
  const [addLocalAtendimento, setAddLocalAtendimento] = useState("");
  const [queGrupo, setQueGrupo] = useState("");
  const [queEtiqueta, setQueEtiqueta] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);

  const [
    addLocalAtendimentoVagasConsulta,
    setAddLocalAtendimentoVagasConsulta,
  ] = useState();
  const [addLocalAtendimentoVagasRetorno, setAddLocalAtendimentoVagasRetorno] =
    useState();
  const [
    addLocalAtendimentoVagasProcedimento,
    setAddLocalAtendimentoVagasProcedimento,
  ] = useState();

  const { data, isLoading } = useGetResource("medicos", "medico", id);
  const { data: procedimentoData, isLoading: loadingProcedimento } =
    useAcoesFetch();

  const { data: especialidadeData, isLoading: loadingEspecialidade } =
    useGetResources("especialidade", "especialidade");

  const { data: searchEtiquetas = [], isLoading: loadingEtiquetas } =
    useSearchResource("medicosSearch", "etiquetas-grupo", queGrupo, queGrupo);
  const { data: grupoData, isLoading: loadingGrupo } = useGetResources(
    "grupos",
    "grupos"
  );

  const { data: dataEtiquetas = [], isLoading: isloadingEtiquetas } =
    useSearchResource(
      "etiquetas",
      "busca-etiquetas",
      data?.etiquetas,
      data?.etiquetas
    );
  console.log(dataEtiquetas);
  const { mutate, isPending } = useResourcePut("medico", "medico", () => {
    history(-1);
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("nome", data.nome);

      setListaLocalAtendimento(data?.local);
      setListaProcedimentos(data?.procedimento_valor);
      setQueEtiqueta(data?.etiquetas);
      setEtiquetas(data?.etiquetas);
      setEspecialidade(data?.especialidade);
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    const sendForm = {
      especialidade: especialidade,
      local: listaLocalAtendimento,
      etiquetas: queEtiqueta,
      procedimento_valor: listaProcedimentos,
      ...formData,
    };
    mutate(sendForm);
  };

  function handleChangeLocalAtendimento(e) {
    setAddLocalAtendimento(e.target.value);
  }
  function handleChangeProcedimento(e) {
    setAddProcedimento(e);
  }
  function handleChangeValor(e) {
    setAddProcedimentoValor(e.target.value);
  }

  function handleChangeEspecialidade(e) {
    setEspecialidade(e);
  }
  function handleChangeLocalAtendimentoVagasConsulta(e) {
    setAddLocalAtendimentoVagasConsulta(e.target.value);
  }
  function handleChangeLocalAtendimentoVagasRetorno(e) {
    setAddLocalAtendimentoVagasRetorno(e.target.value);
  }
  function handleChangeLocalAtendimentoVagasProcedimento(e) {
    setAddLocalAtendimentoVagasProcedimento(e.target.value);
  }

  function handleRemove(id) {
    const novaLista = listaProcedimentos.filter((item) => {
      return item.id !== id;
    });

    setListaProcedimentos(novaLista);
  }
  function handleRemoveLocalAtendimento(id) {
    const novaLista = listaLocalAtendimento?.filter((item) => {
      return item.id !== id;
    });

    setListaLocalAtendimento(novaLista);
  }

  function handleAdd() {
    let min = Math.ceil(1);
    let max = Math.ceil(100);
    let mt = Math.floor(Math.random() * (10 - 2) + 1);
    const novaLista = listaProcedimentos.concat({
      id: Math.floor(Math.random() * (max - min) + min) * mt,
      procedimento: addProcedimento,
      valor: addProcedimentoValor,
    });
    setListaProcedimentos(novaLista);
  }
  function handleAddLocalAtendimento() {
    let min = Math.ceil(1);
    let max = Math.ceil(100);
    let mt = Math.floor(Math.random() * (10 - 2) + 1);
    const novaLista = listaLocalAtendimento.concat({
      id: Math.floor(Math.random() * (max - min) + min) * mt,
      local: addLocalAtendimento,
      consulta: addLocalAtendimentoVagasConsulta,
      retorno: addLocalAtendimentoVagasRetorno,
      procedimento: addLocalAtendimentoVagasProcedimento,
    });
    setListaLocalAtendimento(novaLista);
  }

  return (
    <>
      <Card shadow={false} className="w-full justify-center">
        <CardBody>
          <form
            className="mt-8 mb-2 max-w-screen-lg "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1 flex flex-col gap-6">
              <InputForm label="Nome" name="nome" register={register} />
              <div className="flex gap-4">
                <div>
                  <div className="mb-1 flex flex-row gap-6">
                    <fieldset className="py-5 m-0 w-64 flex-1">
                      <legend> Local</legend>
                      <Input
                        label="Local de Atendimento"
                        type="text"
                        onChange={handleChangeLocalAtendimento}
                        value={addLocalAtendimento}
                      />
                    </fieldset>
                    <fieldset className="flex flex-row gap-1 border p-5 grid grid-cols-3 w-2/4">
                      <legend>Vagas</legend>
                      <Input
                        style={{ width: "140px" }}
                        label="Consultas"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasConsulta}
                        value={addLocalAtendimentoVagasConsulta}
                        placeholder="Consultas"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                      <Input
                        style={{ width: "140px" }}
                        label="Returno"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasRetorno}
                        value={addLocalAtendimentoVagasRetorno}
                        placeholder="Retorno"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                      <Input
                        style={{ width: "140px" }}
                        label="Procedimentos"
                        type="text"
                        onChange={handleChangeLocalAtendimentoVagasProcedimento}
                        value={addLocalAtendimentoVagasProcedimento}
                        placeholder="Procedimentos"
                        labelProps={{
                          className: "hidden",
                        }}
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      />
                    </fieldset>
                    <Button
                      type="button"
                      onClick={handleAddLocalAtendimento}
                      className="mt-6"
                      variant="text"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              {listaLocalAtendimento?.length < 1 ? (
                ""
              ) : (
                <Card className="w-full md:w-full overflow-hidden rounded-md">
                  <List>
                      {listaLocalAtendimento.isArray ? listaLocalAtendimento?.map((item) => (
                      <ListItem key={item.id}>
                        <List>
                          <div>
                            <Typography variant="h6" color="blue-gray">
                              Local: {item.local}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal"
                            >
                              <div className="flex flex-row gap-4">
                                <span>- Consultas: {item.consulta}</span>
                                <span>- Retorno: {item.retorno}</span>
                                <span>
                                  - Procedimentos: {item.procedimento}
                                </span>
                              </div>
                            </Typography>
                          </div>
                        </List>
                        <ListItemSuffix>
                          <Button
                            variant="gradient"
                            className="pb-5 ml-5 pt-5"
                            onClick={() =>
                              handleRemoveLocalAtendimento(item.id)
                            }
                          >
                            x
                          </Button>
                        </ListItemSuffix>
                      </ListItem>
                      )) : ""}
                  </List>
                </Card>
              )}
              {loadingEspecialidade ? (
                "carregando..."
              ) : (
                <>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className=""
                    style={{ textTransform: "capitalize" }}
                  >
                    Especialidade
                  </Typography>
                  <Select
                    name="especialidade"
                    value={data?.especialidade}
                    onChange={handleChangeEspecialidade}
                  >
                    {especialidadeData?.map((item) => (
                      <Option key={item.id} value={item.nome}>
                        {item.nome}
                      </Option>
                    ))}
                  </Select>
                </>
              )}
              <hr />
              {/*  */}
              <div className="flex gap-4">
                <div>
                  {loadingProcedimento ? (
                    "carregando..."
                  ) : (
                    <>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className=""
                        style={{ textTransform: "capitalize" }}
                      >
                        Procedimento
                      </Typography>
                      <Select
                        // name="onde_deseja_ser_atendido"
                        value={addProcedimento}
                        onChange={handleChangeProcedimento}
                      >
                        {procedimentoData?.map((item) => (
                          <Option key={item.id} value={item.nome}>
                            {item.nome}
                          </Option>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className=""
                    style={{ textTransform: "capitalize" }}
                  >
                    Valor
                  </Typography>
                  <Input
                    type="text"
                    onChange={handleChangeValor}
                    value={addProcedimentoValor}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={handleAdd}
                    className="mt-6"
                    variant="text"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
              {listaProcedimentos?.length < 1 ? (
                ""
              ) : (
                <Card className="w-full md:w-96 overflow-hidden rounded-md">
                  <List>
                      {listaProcedimentos?.isArray ? listaProcedimentos?.map((item) => (
                      <ListItem key={item.id}>
                        {item.procedimento}
                        <ListItemSuffix>{item.valor}</ListItemSuffix>
                        <ListItemPrefix>
                          <Button
                            variant="gradient"
                            className="h-5 p-4 pt-1 pb-3 ml-5"
                            onClick={() => handleRemove(item.id)}
                          >
                            (x)
                          </Button>
                        </ListItemPrefix>
                      </ListItem>
                      )) : ""}
                  </List>
                </Card>
              )}
              Etiquetas adicionadas
              <div className="flex gap-4 flex-col">
                {dataEtiquetas?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div> * {item.servico}</div>
                  </div>
                ))}
              </div>
              {/*  */}
              <div className="flex gap-4">
                {loadingGrupo ? (
                  "carregando..."
                ) : (
                  <Select
                    label="Grupo"
                    name="grupo"
                    value={queGrupo}
                    onChange={(val) => {
                      setQueGrupo(val);
                    }}
                  >
                    {grupoData?.map((item, index) => (
                      <Option key={index + 1} value={item.id}>
                        {item.servico}
                      </Option>
                    ))}
                  </Select>
                )}
                <div></div>
              </div>
              {loadingEtiquetas ? (
                "carregando..."
              ) : (
                <MultiSelectDropdown
                  style={{ width: "100%", zIndex: 999 }}
                  disabled={!queGrupo || loadingEtiquetas}
                  formFieldName={"countries"}
                  options={searchEtiquetas}
                  onChange={(selectedCountries) => {
                    setQueEtiqueta(selectedCountries);
                  }}
                  prompt="Selecione uma ou mais etiquetas"
                />
              )}
            </div>

            <div style={{ display: "none" }}>
              <InputForm label="id" name="id" register={register} hidden />
            </div>
            <input
              value={isPending ? "Enviando..." : "Enviar"}
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
            />
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default EditMedico;
