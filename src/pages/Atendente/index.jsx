import React from "react";
import { useAtendenteFetch } from "../../hooks/get/useGet.query";
import { Link } from "react-router-dom";
import { Button, Chip } from "@material-tailwind/react";
import Table from "../Medicos/Table";
import GenericTable from "../../components/Table/genericTable";

const columns = [
  {
    Header: "Nome",
    accessor: "profile.name",
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

  console.log(data);
  return (
    <div>
      <Link to="criar">
        <Button>Criar novo</Button>
      </Link>

      <GenericTable
        columns={[
          { Header: "Nome", accessor: "nome" },
          { Header: "Email", accessor: "email" },
          { Header: "Unidade", accessor: "unidade" },
          {
            Header: "cargo",
            accessor: "cargo",
          },
        ]}
        data={data?.map((item) => ({
          id: item.id,
          nome: <p>{item.profile.name}</p>,
          email: <p>{item.profile.email}</p>,
          unidade: <p>{item.profile?.unidades?.nome}</p>,
          cargo: (
            <Chip
              style={{ backgroundColor: "green", height: 25 }}
              value={item.profile.cargo}
            />
          ),
          resource: "prioridade",
        }))}
        // actionDelete={handleDelete}
        // actionEdit={handleEdit}
        // isDeleting={isDeleting}
      />
      {/* <Table
        columns={columns}
        data={data}
        loading={isLoading}
        title="Lista de atendentes"
      /> */}
    </div>
  );
};

export default Atendentes;
