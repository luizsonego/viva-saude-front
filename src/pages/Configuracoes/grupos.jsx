import React from "react";
import { CustomCard, CustomModal } from "./Components";
import { useGetResources, useGruposFetch } from "../../hooks/get/useGet.query";
import GenericTable from "../../components/Table/genericTable";
import { Alert, Button, Chip } from "@material-tailwind/react";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";
import { useLocation, useNavigate } from "react-router-dom";
import Etiquetas from "./etiquetas";
import InputForm from "../../components/Forms/Input";
import { useResourcePost } from "../../hooks/post/usePost.query";
import { useForm } from "react-hook-form";
import MainAlert from "../../components/Alert/MainAlert";

const Grupos = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const [openModalError, setOpenModalError] = React.useState(false);
  const [dataError, setDataError] = React.useState("");
  const [openModalEtiquetas, setOpenModalEtiquetas] = React.useState(false);
  const [dataEtiquetas, setDataEtiquetas] = React.useState([]);
  const [openModalCadastroEtiqueta, setOpenModalCadastroEtiqueta] =
    React.useState(false);
  const [openModalGroup, setOpenModalGroup] = React.useState(false);

  const { data: grupoData, isLoading: loadingGrupos } = useGetResources(
    "grupos",
    "grupos"
  );

  const { mutate: deleteGrupo, isPending: deletingGrupo } = useDeleteMutation(
    "grupos",
    "grupo"
  );

  const { mutateAsync: mutateGroup, isPending: pendingGroup } = useResourcePost(
    "grupos",
    "grupo",
    () => {
      setOpenModalGroup(false);
      reset();
    },
    (err) => {
      setOpenModalError(true);
      setDataError(err);
    }
  );
  const { mutateAsync: mutateEtiqueta, isPending: pendingEtiqueta } =
    useResourcePost(
      "grupos",
      "etiqueta",
      () => {
        setOpenModalCadastroEtiqueta(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );

  const handleOpenCadastroEtiqueta = () =>
    setOpenModalCadastroEtiqueta(!openModalCadastroEtiqueta);
  const handleOpenModalEtiquetas = (e) => {
    setOpenModalEtiquetas(!openModalEtiquetas);
    setDataEtiquetas(e);
  };
  const handleOpenCreateGroup = () => setOpenModalGroup(!openModalGroup);

  const handleDeleteGrupo = (id) => {
    deleteGrupo(id);
  };
  const handleEditGrupo = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };

  const onSubmit = (data) => {
    mutateGroup(data);
  };
  const onSubmitEtiqueta = (data) => {
    mutateEtiqueta(data);
  };

  return (
    <>
      <MainAlert
        handleOpen={openModalError}
        handleClose={() => setOpenModalError(!openModalError)}
        message={dataError}
        color={"red"}
      />
      <CustomCard title="Grupos" handleAction={handleOpenCreateGroup}>
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
            color: <Chip style={{ backgroundColor: item.cor, height: 25 }} />,
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
      <CustomModal
        title="Etiquetas"
        open={openModalEtiquetas}
        handler={handleOpenModalEtiquetas}
      >
        <Button onClick={handleOpenCadastroEtiqueta} fullWidth>
          Nova Etiqueta
        </Button>
        <Etiquetas data={dataEtiquetas} />

        <CustomModal
          title="Cadastro Etiqueta"
          open={openModalCadastroEtiqueta}
          handler={handleOpenCadastroEtiqueta}
        >
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
                hidden
              />
              <Chip
                style={{ backgroundColor: dataEtiquetas.cor, height: 45 }}
                value="Cor Registrada"
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
        </CustomModal>
      </CustomModal>

      <CustomModal
        title="Grupo"
        open={openModalGroup}
        handler={handleOpenCreateGroup}
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
      </CustomModal>
    </>
  );
};

export default Grupos;
