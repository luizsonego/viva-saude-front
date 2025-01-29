import { IconButton, Spinner, Typography } from "@material-tailwind/react";
import { dataTagErrorSymbol } from "@tanstack/react-query";
import React from "react";

const GenericTable = ({
  columns = [],
  data = [],
  actionEdit,
  actionDelete,
  isLoading,
  isDeleting = false,
}) => {
  return (
    <table className="w-full  table-auto">
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
      {isLoading ? (
        "carregando"
      ) : (
        <tbody>
          {data.map((row) => {
            const className = `py-3 px-5 border-b border-blue-gray-50`;
            return (
              <tr key={row.name}>
                {columns.map((column) => (
                  <td key={column.accessor} className={className}>
                    {row[column.accessor]}
                  </td>
                ))}
                <td>
                  <IconButton
                    variant="gradient"
                    onClick={() => actionEdit(row.id, row.resource)}
                  >
                    <i class="fa-solid fa-pen" />
                  </IconButton>
                </td>
                <td>
                  {isDeleting ? (
                    <IconButton variant="outlined" disabled>
                      <Spinner />
                    </IconButton>
                  ) : (
                    <IconButton
                      variant="outlined"
                      onClick={() => actionDelete(row.id)}
                    >
                      <i class="fa-solid fa-trash-can" />
                    </IconButton>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </table>
  );
};

export default GenericTable;
