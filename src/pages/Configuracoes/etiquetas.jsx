import React from "react";
import GenericTable from "../../components/Table/genericTable";
import { Chip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";

const Etiquetas = ({ data }) => {
  const navigate = useNavigate();

  const { mutate: deleteEtiqueta, isPending: deletingEtiqueta } =
    useDeleteMutation("grupos", "etiqueta");

  const handleDeleteEtiqueta = (id) => {
    deleteEtiqueta(id);
  };
  const handleEditEtiqueta = (id, resource) => {
    navigate(`editar/${resource}/${id}`);
  };
  return (
    <GenericTable
      columns={[
        { Header: "Nome", accessor: "servico" },
        { Headers: "Cor", accessor: "cor" },
      ]}
      data={data?.etiqueta?.map((item) => ({
        id: item.id,
        servico: <p>{item.servico}</p>,
        cor: <Chip style={{ backgroundColor: item.cor, height: 25 }} />,
        resource: "etiqueta",
      }))}
      actionDelete={handleDeleteEtiqueta}
      actionEdit={handleEditEtiqueta}
      isDeleting={deletingEtiqueta}
    />
  );
};

export default Etiquetas;
