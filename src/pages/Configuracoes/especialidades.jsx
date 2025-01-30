import React, { useState } from "react";
import { CustomCard, CustomModal } from "./Components";
import GenericTable from "../../components/Table/genericTable";
import { useGetResources } from "../../hooks/get/useGet.query";
import { Chip } from "@material-tailwind/react";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";
import { useResourcePost } from "../../hooks/post/usePost.query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputForm from "../../components/Forms/Input";
import MainAlert from "../../components/Alert/MainAlert";

function Especialidades({ title }) {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const [openModalError, setOpenModalError] = React.useState(false);
  const [dataError, setDataError] = React.useState("");
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const { data, isLoading } = useGetResources("especialidade", "especialidade");
  const { mutate: mutateDelete, isPending: isDeleting } = useDeleteMutation(
    "especialidade",
    "especialidade"
  );

  const { mutateAsync: mutatePost, isPending: pendingPost } = useResourcePost(
    "especialidade",
    "especialidade",
    () => {
      setOpenModalCreate(false);
      reset();
    },
    (err) => {
      setOpenModalError(true);
      setDataError(err);
    }
  );

  const onSubmit = (data) => {
    mutatePost(data);
  };
  const handleCreate = () => setOpenModalCreate(!openModalCreate);

  const handleDelete = (id) => {
    mutateDelete(id);
  };
  const handleEdit = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  return (
    <>
      <MainAlert
        handleOpen={openModalError}
        handleClose={() => setOpenModalError(!openModalError)}
        message={dataError}
        color={"red"}
      />
      <CustomCard title={title} handleAction={handleCreate}>
        <GenericTable
          columns={[
            { Header: "Prioridade", accessor: "nome" },
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
          actionDelete={handleDelete}
          actionEdit={handleEdit}
          isDeleting={isDeleting}
        />
      </CustomCard>
      <CustomModal title={title} open={openModalCreate} handler={handleCreate}>
        <form className="mt-0 mb-2 w-full " onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1 flex flex-col gap-6">
            <InputForm label="nome" register={register} required />
            <InputForm
              label="cor"
              type={"color"}
              register={register}
              required
            />
          </div>
          <input
            value={pendingPost ? "Enviando..." : "Enviar"}
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
          />
        </form>
      </CustomModal>
    </>
  );
}

Especialidades.defaultProps = {
  title: "Especialidades",
  queries: "acoes",
  resourcePost: "acoes",
  resourceGet: "acoes",
  resourceDelete: "procedimento",
  resourcePut: "acao",
};

export default Especialidades;
