import React from "react";
import { useAtendenteFetch } from "../../hooks/get/useGet.query";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import Table from "../Medicos/Table";

const columns = [
  {
    Header: "Nome",
    accessor: "name",
  },
  {
    Header: "Clinica",
    accessor: "clinica",
  },
  {
    Header: "Acesso",
    accessor: "access",
  },
];

const Atendentes = () => {
  const { data, isLoading } = useAtendenteFetch();
  return (
    <div>
      <Link to="criar">
        <Button>Criar novo</Button>
      </Link>

      <Table
        columns={columns}
        data={data}
        loading={isLoading}
        title="Lista de atendentes"
      />
    </div>
  );
};

export default Atendentes;
