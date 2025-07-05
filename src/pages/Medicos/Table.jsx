import {
  Avatar,
  Card,
  Button,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Typography,
  Badge,
} from "@material-tailwind/react";
import React, { useState } from "react";

const Table = ({
  columns,
  data = [],
  title = "",
  loading,
  edit,
  del,
  loadingDel,
  addVaga,
  editVaga,
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
            <thead style={{position: 'sticky', top: 0, backgroundColor: 'white'}}>
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
                <th
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  width={20}
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400 text-center"
                  >
                    Ações
                  </Typography>
                </th>
                <th
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  width={20}
                >
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400 text-center">
                    Vagas
                  </Typography>
                </th>
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
                  {Array.isArray(data)
                    ? data?.map((row, key) => {
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
                            <td className={className} width={250}>
                              <Typography className="text-xs font-semibold text-blue-gray-600 grid grid-cols-2 gap-2">
                                {Array.isArray(local) ? (
                                  local.map((item, index) => (
                                    <div className="bg-gray-200 px-2 py-1  rounded">
                                      {item.local}
                                    </div>
                                  ))
                                ) : (
                                  <div className="bg-gray-200 px-2 py-1  rounded">
                                    {local}
                                  </div>
                                )}
                              </Typography>
                            </td>
                            <td className={className} width={150}>
                              <Chip
                                variant="gradient"
                                color={"green"}
                                value={especialidade}
                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                              />
                            </td>
                            <td className={className}>
                              <Button
                                variant="filled"
                                className="text-xs font-semibold w-full my-1 hover:bg-blue-500 hover:text-white hover:border-blue-500"
                                onClick={() => edit(id)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outlined"
                                className="text-xs font-semibold w-full my-1 hover:bg-red-500 hover:text-white hover:border-red-500"
                                onClick={() => del(id)}
                              >
                                {loadingDel ? <Spinner /> : "Excluir"}
                              </Button>
                            </td>
                            <td className={className}>
                              <Button
                                variant="text"
                                className="text-xs font-semibold text-blue-gray-600"
                                onClick={() => addVaga(id)}
                              >
                                Adicionar vaga
                              </Button>
                              <Button
                                variant="text"
                                className="text-xs font-semibold text-blue-gray-600"
                                onClick={() => editVaga(id)}
                              >
                                Editar vaga
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

const LocalList = ({ local }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? local : local.slice(0, 3);
  const hasMore = local.length > 3;
  return (
    <div className="flex items-center gap-2">
      {visibleItems.map((item, index) => (
        <div key={index} className="bg-gray-200 px-2 py-1 rounded">
          {item.local}
        </div>
      ))}
      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="p-1 rounded-full bg-gray-300 hover:bg-gray-400"
        >
          +
        </button>
      )}
    </div>
  );
};

export default Table;
