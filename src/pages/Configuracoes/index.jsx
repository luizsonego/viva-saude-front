import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import GenericTable from "../../components/Table/genericTable";
import { useForm } from "react-hook-form";
import {
  useAcoesPost,
  useEtiquetaPost,
  useGroupPost,
  useOrigemPost,
  usePrioridadePost,
  useResourcePost,
  useUnidadesPost,
} from "../../hooks/post/usePost.query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAcoesFetch,
  useGruposFetch,
  usePrioridadesFetch,
  useUnidadesFetch,
  useOrigemFetch,
} from "../../hooks/get/useGet.query";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  useDeleteMutation,
  useEtiquetaDelete,
  usegrupoDelete,
  usePrioridadeDelete,
} from "../../hooks/delete/useDelete.query";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const [openModalGroup, setOpenModalGroup] = React.useState(false);
  const [openModalPrioridade, setOpenModalPrioridade] = React.useState(false);
  const [openModalAcoes, setOpenModalAcoes] = React.useState(false);
  const [openModalUnidades, setOpenModalUnidades] = React.useState(false);
  const [openModalOrigem, setOpenModalOrigem] = React.useState(false);
  const [openModalEtiquetas, setOpenModalEtiquetas] = React.useState(false);
  const [openModalCadastroEtiqueta, setOpenModalCadastroEtiqueta] =
    React.useState(false);
  const [dataEtiquetas, setDataEtiquetas] = React.useState([]);

  const { data: grupoData, isLoading: loadingGrupos } = useGruposFetch();
  const { data: prioridadeData } = usePrioridadesFetch();
  const { data: acoesData } = useAcoesFetch();
  const { data: unidadesData } = useUnidadesFetch();
  const { data: origemData } = useOrigemFetch();

  const { mutateAsync: mutateGroup, isPending: pendingGroup } = useResourcePost(
    "grupos",
    "grupo",
    () => {
      setOpenModalGroup(false);
      reset();
    }
  );
  const { mutateAsync: mutateEtiqueta, isPending: pendingEtiqueta } =
    useResourcePost("grupos", "etiqueta", () => {
      setOpenModalCadastroEtiqueta(false);
      reset();
    });
  const { mutateAsync: mutatePrioridade, isPending: pendingPrioridade } =
    useResourcePost("prioridades", "prioridade", () => {
      setOpenModalPrioridade(false);
      reset();
    });
  const { mutateAsync: mutateAcoes, isPending: pendingAcoes } = useResourcePost(
    "acoes",
    "acoes",
    () => {
      setOpenModalAcoes(false);
      reset();
    }
  );
  const { mutateAsync: mutateUnidade, isPending: pendingUnidade } =
    useResourcePost("unidades", "unidade", () => {
      setOpenModalUnidades(false);
      reset();
    });
  const { mutateAsync: mutateOrigem, isPending: pendingOrigem } =
    useResourcePost("origem", "origem", () => {
      setOpenModalOrigem(false);
      reset();
    });

  const { mutate: deleteGrupo, isPending: deletingGrupo } = useDeleteMutation(
    "grupos",
    "grupo"
  );
  const { mutate: deleteEtiqueta, isPending: deletingEtiqueta } =
    useDeleteMutation("grupos", "etiqueta");
  const { mutate: deletePrioridade, isPending: deletingPrioridade } =
    useDeleteMutation("prioridades", "prioridade");
  const { mutate: deleteProcedimento, isPending: deletingProcedimento } =
    useDeleteMutation("acoes", "procedimento");
  const { mutate: deleteUnidade, isPending: deletingUnidade } =
    useDeleteMutation("unidades", "unidade");
  const { mutate: deleteOrigem, isPending: deletingOrigem } = useDeleteMutation(
    "origem",
    "origem"
  );

  const onSubmit = (data) => {
    mutateGroup(data);
  };
  const onSubmitEtiqueta = (data) => {
    mutateEtiqueta(data);
  };
  const onSubmitPrioridade = (data) => {
    mutatePrioridade(data);
  };
  const onSubmitAcoes = (data) => {
    mutateAcoes(data);
  };
  const onSubmitUnidade = (data) => {
    mutateUnidade(data);
  };
  const onSubmitOrigem = (data) => {
    mutateOrigem(data);
  };

  const handleOpenGroup = () => setOpenModalGroup(!openModalGroup);
  const handleOpenCadastroEtiqueta = () =>
    setOpenModalCadastroEtiqueta(!openModalCadastroEtiqueta);
  const handleOpenPrioridade = () =>
    setOpenModalPrioridade(!openModalPrioridade);
  const handleOpenAcoes = () => setOpenModalAcoes(!openModalAcoes);
  const handleOpenUnidades = () => setOpenModalUnidades(!openModalUnidades);
  const handleOpenOrigem = () => setOpenModalOrigem(!openModalOrigem);
  const handleOpenModalEtiquetas = (e) => {
    setOpenModalEtiquetas(!openModalEtiquetas);
    setDataEtiquetas(e);
  };

  const handleDeleteGrupo = (id) => {
    deleteGrupo(id);
  };
  const handleDeleteEtiqueta = (id) => {
    deleteEtiqueta(id);
  };
  const handleDeletePrioridade = (id) => {
    deletePrioridade(id);
  };
  const handleDeleteProcedimento = (id) => {
    deleteProcedimento(id);
  };
  const handleDeleteUnidade = (id) => {
    deleteUnidade(id);
  };
  const handleDeleteOrigem = (id) => {
    deleteOrigem(id);
  };
  const handleEditGrupo = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleEditEtiqueta = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleEditPrioridade = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleEditProcedimento = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleEditUnidade = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleEditOrigem = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };

  return (
    <>
      <div className="flex justify-between md:items-center">
        <div className="mt-6 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 md:gap-2.5 gap-4 w-full mb-10">
          <div>
            <CustomCard title="Grupos">
              <Button onClick={handleOpenGroup} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[
                  {
                    Header: "Nome",
                    accessor: "name",
                  },
                  {
                    Header: "Etiquetas",
                    accessor: "etiquetas",
                  },
                  {
                    Header: "Cor",
                    accessor: "color",
                  },
                ]}
                data={grupoData?.map((item) => ({
                  name: (
                    <p style={{ display: "flex", alignItems: "center" }}>
                      {item.servico}
                    </p>
                  ),
                  etiquetas: (
                    <Button
                      variant="text"
                      onClick={() => handleOpenModalEtiquetas(item)}
                    >
                      Etiquetas
                    </Button>
                  ),
                  color: (
                    <Chip style={{ backgroundColor: item.cor, height: 25 }} />
                  ),
                  id: item.id,
                  etiqueta: item.etiqueta,
                  resource: "grupo",
                }))}
                actionDelete={handleDeleteGrupo}
                actionEdit={handleEditGrupo}
                isLoading={loadingGrupos}
                isDeleting={deletingGrupo}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Prioridades">
              <Button onClick={handleOpenPrioridade} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[
                  { Header: "Prioridade", accessor: "nome" },
                  {
                    Header: "Cor",
                    accessor: "color",
                  },
                ]}
                data={prioridadeData?.map((item) => ({
                  id: item.id,
                  nome: <p>{item.nome}</p>,
                  color: (
                    <Chip style={{ backgroundColor: item.cor, height: 25 }} />
                  ),
                  resource: "prioridade",
                }))}
                actionDelete={handleDeletePrioridade}
                actionEdit={handleEditPrioridade}
                isDeleting={deletingPrioridade}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Procedimentos">
              <Button onClick={handleOpenAcoes} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[{ Header: "Nome", accessor: "nome" }]}
                data={acoesData?.map((item) => ({
                  id: item.id,
                  nome: item.nome,
                  resource: "acao",
                }))}
                actionDelete={handleDeleteProcedimento}
                actionEdit={handleEditProcedimento}
                isDeleting={deletingProcedimento}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Unidades">
              <Button onClick={handleOpenUnidades} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[
                  { Header: "Nome", accessor: "nome" },
                  { Header: "Descrição", accessor: "descricao" },
                ]}
                data={unidadesData?.map((item) => ({
                  id: item.id,
                  nome: item.nome,
                  descricao: item.descricao,
                  resource: "unidade",
                }))}
                actionDelete={handleDeleteUnidade}
                actionEdit={handleEditUnidade}
                isDeleting={deletingUnidade}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Origem">
              <Button onClick={handleOpenOrigem} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[
                  { Header: "Nome", accessor: "nome" },
                  { Header: "Descrição", accessor: "descricao" },
                ]}
                data={origemData?.map((item) => ({
                  id: item.id,
                  nome: item.nome,
                  descricao: item.descricao,
                  resource: "origem",
                }))}
                actionDelete={handleDeleteOrigem}
                actionEdit={handleEditOrigem}
                isDeleting={deletingOrigem}
              />
            </CustomCard>
          </div>
        </div>
      </div>

      <CustomDialog
        title="Grupo"
        open={openModalGroup}
        handler={handleOpenGroup}
      >
        <form className="mt-0 mb-2 w-full " onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="servico" register={register} required />
            <InputForm label="cor" register={register} type="color" />
          </div>
          <input
            value={pendingGroup ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Prioridade"
        open={openModalPrioridade}
        handler={handleOpenPrioridade}
      >
        <form
          className="mt-0 mb-2 w-full "
          onSubmit={handleSubmit(onSubmitPrioridade)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            {/* <InputForm label="descricao" register={register} required /> */}
            <InputForm label="cor" register={register} type="color" required />
          </div>
          <input
            value={pendingPrioridade ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Procedimentos"
        open={openModalAcoes}
        handler={handleOpenAcoes}
      >
        <form
          className="mt-0 mb-2 w-full "
          onSubmit={handleSubmit(onSubmitAcoes)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            {/* <InputForm label="descricao" register={register} required />
            <InputForm type="time" label="tempo" register={register} required /> */}
            {/* input de timer */}
          </div>
          <input
            value={pendingAcoes ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Unidades"
        open={openModalUnidades}
        handler={handleOpenUnidades}
      >
        <form
          className="mt-0 mb-2 w-full "
          onSubmit={handleSubmit(onSubmitUnidade)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            <InputForm label="descricao" register={register} />
          </div>
          <input
            value={pendingUnidade ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Origem"
        open={openModalOrigem}
        handler={handleOpenOrigem}
      >
        <form
          className="mt-0 mb-2 w-full "
          onSubmit={handleSubmit(onSubmitOrigem)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            <InputForm label="descricao" register={register} required />
          </div>
          <input
            value={pendingOrigem ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Etiquetas"
        open={openModalEtiquetas}
        handler={handleOpenModalEtiquetas}
      >
        <Button onClick={handleOpenCadastroEtiqueta} fullWidth>
          Nova Etiqueta
        </Button>
        <GenericTable
          columns={[
            { Header: "Nome", accessor: "servico" },
            { Headers: "Cor", accessor: "cor" },
          ]}
          data={dataEtiquetas?.etiqueta?.map((item) => ({
            id: item.id,
            servico: <p>{item.servico}</p>,
            cor: <Chip style={{ backgroundColor: item.cor, height: 25 }} />,
            resource: "etiqueta",
          }))}
          actionDelete={handleDeleteEtiqueta}
          actionEdit={handleEditEtiqueta}
          isDeleting={deletingEtiqueta}
        />
        <CustomDialog
          title="Cadastro Etiqueta"
          open={openModalCadastroEtiqueta}
          handler={handleOpenCadastroEtiqueta}
        >
          <h1>Grupo: {dataEtiquetas.servico}</h1>
          <form
            className="mt-0 mb-2 w-full "
            onSubmit={handleSubmit(onSubmitEtiqueta)}
          >
            <div className="mb-1 flex flex-col gap-6">
              <InputForm label="servico" register={register} required />
              <InputForm
                defaultValue={dataEtiquetas.cor}
                label="cor"
                register={register}
                type="color"
                disabled
              />
            </div>
            <InputForm
              label="grupo"
              defaultValue={dataEtiquetas.id}
              register={register}
              required
              disabled
              hidden
            />
            <input
              value={pendingEtiqueta ? "Enviando..." : "Enviar"}
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
            />
          </form>
        </CustomDialog>
      </CustomDialog>
    </>
  );
};

export default Config;

const InputForm = ({
  label = "",
  placeholder = "",
  register,
  required,
  type,
  defaultValue,
  hidden = false,
}) => {
  return hidden ? (
    <>
      <Input
        hidden={hidden}
        value={defaultValue}
        type={type}
        placeholder={placeholder}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...register(label, { required })}
      />
    </>
  ) : (
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
        hidden={hidden}
        value={defaultValue}
        type={type}
        size="lg"
        placeholder={placeholder}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...register(label, { required })}
      />
    </>
  );
};

const CustomCard = ({ title, children }) => {
  return (
    <Card className="mb-10">
      <CardHeader variant="gradient" color="blue-gray" className="mb-0 p-6">
        <Typography variant="h6" color="white">
          {title}
        </Typography>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

const CustomDialog = ({ title, open, handler, children }) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
    </Dialog>
  );
};
