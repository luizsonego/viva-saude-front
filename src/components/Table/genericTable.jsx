import { Typography } from "@material-tailwind/react";
import { dataTagErrorSymbol } from "@tanstack/react-query";
import React from "react";

const GenericTable = ({ columns, data = [] }) => {
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default GenericTable;
