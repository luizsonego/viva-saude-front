import {
  Avatar,
  Card,
  Button,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React from "react";

const Table = ({
  columns,
  data,
  title = "",
  loading,
  edit,
  del,
  loadingDel,
}) => {
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {title}
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {column.Header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="flex justify-center items-center w-full h-24"
                  >
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map((row, key) => {
                    const { id, avatar, nome, local, especialidade } = row;
                    const className = `py-3 px-5 ${
                      key === row.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={row.nome}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={`https://ameliarodrigues.org.br/wp-content/uploads/2020/08/sem-imagem-avatar.png`}
                              alt={nome}
                              size="sm"
                              variant="rounded"
                            />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {nome}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {local}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={"green"}
                            value={especialidade}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Button
                            variant="text"
                            className="text-xs font-semibold text-blue-gray-600"
                            onClick={() => edit(id)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="text"
                            className="text-xs font-semibold text-blue-gray-600"
                            onClick={() => del(id)}
                          >
                            {loadingDel ? <Spinner /> : "Excluir"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Table;
