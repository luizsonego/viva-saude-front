import React from "react";
import Table from "./Table";
import { avatar, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useMedicosFetch } from "../../hooks/get/useGet.query";
import { useMedicoDelete } from "../../hooks/delete/useDelete.query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const columns = [
  {
    Header: "Nome",
    accessor: "nome",
  },
  {
    Header: "Especialidade",
    accessor: "specialty",
  },
];

const Medicos = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useMedicosFetch();

  const { mutate, isPending } = useMutation({
    mutationFn: useMedicoDelete,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
    },
  });

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
