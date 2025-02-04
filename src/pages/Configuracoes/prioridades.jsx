import React from "react";
import { CustomCard, CustomModal } from "./Components";
import GenericTable from "../../components/Table/genericTable";
import { useGetResources } from "../../hooks/get/useGet.query";
import { Chip } from "@material-tailwind/react";
import { useResourcePost } from "../../hooks/post/usePost.query";
import { useNavigate } from "react-router-dom";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";
import InputForm from "../../components/Forms/Input";
import { useForm } from "react-hook-form";
import MainAlert from "../../components/Alert/MainAlert";

const Prioridades = () => {
  const navigate = useNavigate();
  const { data } = useGetResources("prioridades", "prioridade");

  const [openModalError, setOpenModalError] = React.useState(false);
  const [dataError, setDataError] = React.useState("");
  const [openModalPrioridade, setOpenModalPrioridade] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { mutateAsync, isPending } = useResourcePost(
    "prioridades",
    "prioridade",
    () => {
      setOpenModalPrioridade(false);
      reset();
    },
    (err) => {
      setOpenModalError(true);
      setDataError(err);
    }
  );
  const { mutate: deletePrioridade, isPending: deletingPrioridade } =
    useDeleteMutation("prioridades", "prioridade");

  const onSubmitPrioridade = (data) => {
    mutateAsync(data);
  };

  const handleDeletePrioridade = (id) => {
    deletePrioridade(id);
  };
  const handleEditPrioridade = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  const handleOpenCreatePrioridade = () =>
    setOpenModalPrioridade(!openModalPrioridade);

  return (
    <>
      <MainAlert
        handleOpen={openModalError}
        handleClose={() => setOpenModalError(!openModalError)}
        message={dataError}
        color={"red"}
      />
      <CustomCard title="Prioridades" handleAction={handleOpenCreatePrioridade}>
        <GenericTable
          columns={[
            { Header: "Nome", accessor: "nome" },
            {
              Header: "Cor",
              accessor: "color",
            },
          ]}
          data={data?.map((item) => ({
            id: item.id,
            nome: <p>{item.nome}</p>,
            color: <Chip style={{ backgroundColor: item.cor, height: 25 }} />,
            resource: "prioridade",
          }))}
          actionDelete={handleDeletePrioridade}
          actionEdit={handleEditPrioridade}
          isDeleting={deletingPrioridade}
        />
      </CustomCard>
      <CustomModal
        title="Prioridade"
        open={openModalPrioridade}
        handler={handleOpenCreatePrioridade}
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
            value={isPending ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomModal>
    </>
  );
};

export default Prioridades;
