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

const Config = () => {
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

  const { data: grupoData } = useGruposFetch();
  const { data: prioridadeData } = usePrioridadesFetch();
  const { data: acoesData } = useAcoesFetch();
  const { data: unidadesData } = useUnidadesFetch();
  const { data: origemData } = useOrigemFetch();

  const { mutateAsync: mutateGroup, isPending: pendingGroup } = useMutation({
    mutationFn: useGroupPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupo"] });
      setOpenModalGroup(false);
    },
  });

  const { mutateAsync: mutateEtiqueta, isPending: pendingEtiqueta } =
    useMutation({
      mutationFn: useEtiquetaPost,
      onSuccess: () => {
        setOpenModalCadastroEtiqueta(false);
      },
    });

  const { mutateAsync: mutatePrioridade, isPending: pendingPrioridade } =
    useMutation({
      mutationFn: usePrioridadePost,
      onSuccess: () => {
        queryClient.invalidateQueries("prioridades");
        setOpenModalPrioridade(false);
        reset();
      },
    });

  const { mutateAsync: mutateAcoes, isPending: pendingAcoes } = useMutation({
    mutationFn: useAcoesPost,
    onSuccess: () => {
      queryClient.invalidateQueries("acoes");
      setOpenModalAcoes(false);
      reset();
    },
  });

  const { mutateAsync: mutateUnidade, isPending: pendingUnidade } = useMutation(
    {
      mutationFn: useUnidadesPost,
      onSuccess: () => {
        queryClient.invalidateQueries("unidades");
        setOpenModalUnidades(false);
        reset();
      },
    }
  );

  const { mutateAsync: mutateOrigem, isPending: pendingOrigem } = useMutation({
    mutationFn: useOrigemPost,
    onSuccess: () => {
      queryClient.invalidateQueries("origem");
      setOpenModalOrigem(false);
      reset();
    },
  });

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
    console.log(e);
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
                      <Tooltip content={item.descricao}>
                        <InformationCircleIcon className="w-5 h-5 text-inherit ml-1" />
                      </Tooltip>
                    </p>
                  ),
                  etiquetas: (
                    <Button
                      variant="text"
                      onClick={() => handleOpenModalEtiquetas(item)}
                    >
                      Ver etiquetas
                    </Button>
                  ),
                  color: (
                    <Chip style={{ backgroundColor: item.cor, height: 25 }} />
                  ),
                }))}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Prioridades">
              <Button onClick={handleOpenPrioridade} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[{ Header: "Prioridade", accessor: "nome" }]}
                data={prioridadeData}
              />
            </CustomCard>
          </div>
          <div>
            <CustomCard title="Ações">
              <Button onClick={handleOpenAcoes} fullWidth>
                Cadastrar
              </Button>
              <GenericTable
                columns={[
                  { Header: "Nome", accessor: "nome" },
                  { Header: "Descrição", accessor: "descricao" },
                  { Header: "Tempo (min)", accessor: "tempo" },
                ]}
                data={acoesData}
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
                data={unidadesData}
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
                data={origemData}
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
            <InputForm label="descricao" register={register} required />
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
            <InputForm label="descricao" register={register} required />
            <InputForm label="cor" register={register} required />
          </div>
          <input
            value={pendingPrioridade ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomDialog>
      <CustomDialog
        title="Açoes"
        open={openModalAcoes}
        handler={handleOpenPrioridade}
      >
        <form
          className="mt-0 mb-2 w-full "
          onSubmit={handleSubmit(onSubmitAcoes)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            <InputForm label="descricao" register={register} required />
            <InputForm type="time" label="tempo" register={register} required />
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
            <InputForm label="descricao" register={register} required />
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
        title="etiquetas"
        open={openModalEtiquetas}
        handler={handleOpenModalEtiquetas}
      >
        <Button onClick={handleOpenCadastroEtiqueta} fullWidth>
          Nova Etiqueta
        </Button>
        <GenericTable
          columns={[
            { Header: "Nome", accessor: "servico" },
            { Header: "Descrição", accessor: "descricao" },
          ]}
          data={dataEtiquetas?.etiqueta}
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
              <InputForm label="descricao" register={register} required />
              <InputForm
                defaultValue={dataEtiquetas.cor}
                label="cor"
                register={register}
                type="color"
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
