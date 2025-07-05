import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useGetResourceProps } from "../../hooks/get/useGet.query";
import formataData, { formatDate } from "../../helpers/formatarDataBr";

function Vagas() {


  // Busca na API
  const { data, isLoading, error, refetch } = useGetResourceProps(
    "vagas",
    "vagas-disponiveis-medicos",
    ``,
  );

  const medicos = data?.medicos;

  const [buscaMedico, setBuscaMedico] = useState("");
  const [buscaData, setBuscaData] = useState("");

  const formatarData = (data) => {
    if (!data) return ''
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtragem dinâmica
  const medicosFiltrados = medicos?.filter((item) => {
    const nomeMatch = item.medico.nome.toLowerCase().includes(buscaMedico.toLowerCase());
    if (!buscaData) return nomeMatch;
    // Verifica se alguma vaga em algum local bate com a data
    const temData = item.locais?.some(local =>
      local.vagas.some(vaga => vaga.data === buscaData)
    );
    return nomeMatch && temData;
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Erro ao buscar vagas</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Typography variant="h3" className="mb-8 text-center font-bold">
        Vagas Disponíveis para Médicos
      </Typography>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <Input
          label="Buscar médico"
          value={buscaMedico}
          onChange={e => setBuscaMedico(e.target.value)}
          className=""
        />
        <Input
          type="date"
          label="Buscar por data"
          value={buscaData}
          onChange={e => setBuscaData(e.target.value)}
          className=""
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {medicosFiltrados?.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Nenhuma vaga encontrada.</div>
        )}
        {medicosFiltrados?.map((item) => (
          <Card key={item.medico.id} className="shadow-lg border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
            <CardBody>
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <span role="img" aria-label="doctor">🩺</span>
                </div>
                <div>
                  <Typography variant="h5" className="font-semibold ">
                    {item.medico.nome}
                  </Typography>
                  <Typography variant="small" className="">
                    {item.medico.especialidade}
                  </Typography>
                </div>
              </div>
              <div className="space-y-4">
                {item.locais?.map((local) => {
                  // Filtra as vagas do local pela data, se buscaData estiver preenchida
                  const vagasFiltradas = buscaData
                    ? local.vagas.filter(vaga => vaga.data === buscaData)
                    : local.vagas;
                  if (!vagasFiltradas.length) return null;
                  return (
                    <div key={local.id} className="bg-blue-50 rounded-lg p-4 mb-2 border border-blue-200">
                      <Typography variant="h6" className="text-blue-700 mb-2 flex items-center gap-2">
                        <span role="img" aria-label="location">📍</span> {local.local_nome}
                      </Typography>
                      <div className="grid grid-cols-1 gap-2">
                        {vagasFiltradas.map((vaga, idx) => (
                          <div key={vaga.data + idx} className="bg-white rounded-md p-3 shadow-sm border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span role="img" aria-label="calendar">📅</span>
                              <Typography variant="paragraph" className="font-medium text-gray-700">
                                {formatarData(vaga.data)}
                              </Typography>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                              <Chip color="blue" value={`Consulta: ${vaga.consulta || 0}`} className="text-xs" />
                              <Chip color="green" value={`Procedimento: ${vaga.procedimento || 0}`} className="text-xs" />
                              <Chip color="amber" value={`Retorno: ${vaga.retorno || 0}`} className="text-xs" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Vagas;
