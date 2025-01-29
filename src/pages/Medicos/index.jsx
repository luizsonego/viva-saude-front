import React from "react";
import Table from "./Table";
import { avatar, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useGetResources } from "../../hooks/get/useGet.query";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";

const columns = [
  {
    Header: "Nome",
    accessor: "nome",
  },
  {
    Header: "Local",
    accessor: "local",
  },
  {
    Header: "Especialidade",
    accessor: "especialidade",
  },
];

const Medicos = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetResources("medicos", "medicos");

  const { mutate, isPending } = useDeleteMutation("medicos", "medico");

  const handleEdit = (id) => {
    navigate(`editar/${id}`);
  };
  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <div>
      <Link to="criar">
        <Button>Criar novo</Button>
      </Link>

      <Table
        columns={columns}
        data={data}
        loading={isLoading}
        title="Lista de médicos"
        edit={handleEdit}
        del={handleDelete}
        loadingDel={isPending}
      />
    </div>
  );
};

export default Medicos;
