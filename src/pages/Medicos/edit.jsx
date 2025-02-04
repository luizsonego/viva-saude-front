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
// import InputForm from "../../components/Forms/Input";

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

  const { data, isLoading } = useGetResource("medicos", "medico", id);
  const { data: procedimentoData, isLoading: loadingProcedimento } =
    useAcoesFetch();

  const { data: especialidadeData, isLoading: loadingEspecialidade } =
    useGetResources("especialidade", "especialidade");

  const { mutate, isPending } = useResourcePut("medico", "medico", () => {
    history(-1);
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("nome", data.nome);

      setListaLocalAtendimento(data?.local);
      setListaProcedimentos(data?.procedimento_valor);
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    const sendForm = {
      especialidade,
      localizacao: listaLocalAtendimento,
      ...formData,
    };
    mutate(sendForm);
  };

  console.log(listaLocalAtendimento);

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

  function handleRemove(id) {
    const novaLista = listaProcedimentos.filter((item) => {
      return item.id !== id;
    });

    setListaProcedimentos(novaLista);
  }
  function handleRemoveLocalAtendimento(id) {
    const novaLista = listaLocalAtendimento.filter((item) => {
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
                  {isLoading ? (
                    "carregando..."
                  ) : (
                    <>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className=""
                        style={{ textTransform: "capitalize" }}
                      >
                        Local de Atendimento
                      </Typography>
                      <Input
                        type="text"
                        onChange={handleChangeLocalAtendimento}
                        value={addLocalAtendimento}
                      />
                    </>
                  )}
                </div>
                <div>
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
              {listaLocalAtendimento?.length < 1 ? (
                ""
              ) : (
                <Card className="w-full md:w-1/2 overflow-hidden rounded-md">
                  <List>
                    {Array.isArray(listaLocalAtendimento)
                      ? listaLocalAtendimento?.map((item) => (
                          <ListItem key={item.id}>
                            {item.local}
                            <ListItemPrefix>
                              <Button
                                variant="gradient"
                                className="h-5 p-4 pt-1 pb-3 ml-5"
                                onClick={() =>
                                  handleRemoveLocalAtendimento(item.id)
                                }
                              >
                                (x)
                              </Button>
                            </ListItemPrefix>
                          </ListItem>
                        ))
                      : ""}
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
                    {listaProcedimentos?.map((item) => (
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
                    ))}
                  </List>
                </Card>
              )}
              {/*  */}
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
