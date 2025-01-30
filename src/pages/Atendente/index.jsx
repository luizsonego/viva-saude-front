import React from "react";
import { useAtendenteFetch } from "../../hooks/get/useGet.query";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";
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

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Atendente
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
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
          </CardBody>
        </Card>
      </div>

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
