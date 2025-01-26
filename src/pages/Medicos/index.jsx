import React from "react";
import Table from "./Table";
import { avatar, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useMedicosFetch } from "../../hooks/get/useGet.query";

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
  const { data, isLoading } = useMedicosFetch();

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
      />
    </div>
  );
};

export default Medicos;
