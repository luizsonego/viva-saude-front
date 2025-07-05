import { Typography } from '@material-tailwind/react'
import React from 'react'
import formatarDataBr, { formatarDataBrHora } from '../../helpers/formatarDataBr'

function DadosAtendimento({ data }) {
  return (
    <>
      <div className="flex gap-1">
        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
          {"Medico selecionado"}:
        </Typography>
        <Typography
          className="text-xs !font-bold"
          color="blue-gray"
        >
          {data?.medico_atendimento}
        </Typography>
      </div>
      <div className="flex gap-1">
        <Typography className="mb-1 text-xs !font-medium !text-gray-600">
          {"O que deseja"}:
        </Typography>
        <Typography
          className="text-xs !font-bold"
          color="blue-gray"
        >
          {data?.acoes?.nome}
          {data?.o_que_deseja}
        </Typography>
      </div>
      {
        data?.medico_atendimento_local ? (
          data?.medico_atendimento_local?.map((item, index) => (
            <div key={index}>
              <div className="flex gap-1">
                <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                  {"Local Data e hora do Atendimento"}:
                </Typography>
                <Typography
                className="text-xs !font-bold"
                color="blue-gray"
                >
                {item.local} - {formatarDataBr(item.data)} - {item.hora}
                </Typography>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex gap-1">
              <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                {"Onde deseja ser atendido"}:
              </Typography>
              <Typography
                className="text-xs !font-bold"
                color="blue-gray"
              >
                {
                  data?.onde_deseja_ser_atendido
                }
              </Typography>
            </div>
            <div className="flex gap-1">
              <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                {"Data"}:
              </Typography>
              <Typography
                className="text-xs !font-bold"
                color="blue-gray"
              >
                {formatarDataBrHora(data?.medico_atendimento_data)}
              </Typography>
            </div>
          </>
        )
      }

    </>
  )
}

export default DadosAtendimento
