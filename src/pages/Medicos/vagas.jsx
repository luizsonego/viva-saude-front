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

const cores = {
  "consulta": "blue",
  "procedimento": "green",
  "retorno": "amber",
};

// Função para cor do alerta de vagas
const getVagasColor = (vagas) => {
  if (vagas > 5) return "green";
  if (vagas >= 3) return "amber";
  return "red";
};

// Função para mensagem de alerta
const getVagasMensagem = (vagas) => {
  if (vagas < 3) return "Últimas vagas!";
  if (vagas <= 5) return "Poucas vagas";
  return null;
};

function Vagas() {
  // Busca na API
  const { data, isLoading, error, refetch } = useGetResourceProps(
    "vagas",
    "vagas",
    ``,
  );

  const [buscaMedico, setBuscaMedico] = useState("");
  const [buscaData, setBuscaData] = useState("");

  const formatarData = (data) => {
    if (!data) return ''
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtragem dinâmica
  const vagasFiltradas = data?.data?.filter((item) => {
    const nomeMatch = item.medico_nome.toLowerCase().includes(buscaMedico.toLowerCase());
    if (!buscaData) return nomeMatch;
    
    // Verifica se alguma data em algum tipo bate com a data buscada
    const temData = item.tipos?.some(tipo =>
      tipo.datas.some(data => data.data === buscaData)
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
      <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl border-0 rounded-2xl">
        <Typography variant="h3" className="mb-4 text-center font-bold text-blue-900 drop-shadow-lg">
          Vagas Disponíveis para Médicos
        </Typography>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <Input
            label="Buscar médico"
            value={buscaMedico}
            onChange={e => setBuscaMedico(e.target.value)}
            className="bg-white rounded-lg shadow-sm border border-blue-200"
          />
          <Input
            type="date"
            label="Buscar por data"
            value={buscaData}
            onChange={e => setBuscaData(e.target.value)}
            className="bg-white rounded-lg shadow-sm border border-blue-200"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {vagasFiltradas?.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Nenhuma vaga encontrada.</div>
        )}
        {vagasFiltradas?.map((item, index) => (
          <Card key={index + 1} className="shadow-lg border border-blue-100 hover:shadow-2xl transition-shadow duration-300 rounded-xl">
            <CardBody>
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-blue-200 rounded-full p-4 shadow-md">
                  <span role="img" aria-label="doctor" className="text-2xl">🩺</span>
                </div>
                <div>
                  <Typography variant="h5" className="font-semibold text-blue-800">
                    {item.medico_nome}
                  </Typography>
                  <Typography variant="small" className="text-blue-600">
                    {item.medico_especialidade}
                  </Typography>
                </div>
              </div>
              <div className="space-y-4">
                {item.tipos.map((tipo, tipoIdx) => (
                  <div key={tipoIdx + 1} className="bg-blue-50 rounded-lg border border-blue-200 p-2">
                    {tipo.datas.map((data, dataIdx) => {
                      const emAtendimento = data.atendimento;
                      const vagasDisponiveis = data.quantidade - emAtendimento;
                      if (vagasDisponiveis <= 0) return null;
                      if (buscaData && data.data !== buscaData) return null;
                      const vagasColor = getVagasColor(vagasDisponiveis);
                      const vagasMensagem = getVagasMensagem(vagasDisponiveis);
                      return (
                        <div key={dataIdx + 1} className="bg-white rounded-lg p-4 mb-2 shadow border border-blue-100 flex flex-col gap-2">
                          <Typography variant="h6" className="text-blue-700 mb-2 flex items-center gap-2">
                            <span role="img" aria-label="location">📍</span> {data.local_nome}
                            <Chip color={cores[tipo.tipo]} value={tipo.tipo} className="text-xs" />
                          </Typography>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span role="img" aria-label="calendar">📅</span>
                              <Typography variant="paragraph" className="font-medium text-gray-700">
                                {vagasDisponiveis} vagas disponíveis para dia {formatarData(data.data)}
                              </Typography>
                            </div>
                            <Chip
                              color={vagasColor}
                              value={vagasDisponiveis + (vagasMensagem ? ` - ${vagasMensagem}` : "")}
                              icon={vagasColor === "red" ? <span role="img" aria-label="alert">⚠️</span> : undefined}
                              className={`font-bold ${vagasColor === "red" ? "animate-pulse" : ""}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Vagas;
