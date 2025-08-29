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
  IconButton,
} from "@material-tailwind/react";
import { useGetResourceProps } from "../../hooks/get/useGet.query";
import formataData, { formatDate } from "../../helpers/formatarDataBr";

// Configuração padronizada dos tipos de atendimento
const TIPOS_ATENDIMENTO = {
  consulta: {
    ordem: 1,
    label: "1 - Consulta",
    cor: "blue",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    textColorLight: "text-blue-600",
    icone: "🩺",
    descricao: "Primeira consulta com o médico"
  },
  retorno: {
    ordem: 2,
    label: "2 - Retorno", 
    cor: "amber",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    textColorLight: "text-amber-600",
    icone: "🔄",
    descricao: "Retorno para acompanhamento"
  },
  procedimento: {
    ordem: 3,
    label: "3 - Procedimento",
    cor: "green", 
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    textColorLight: "text-green-600",
    icone: "⚕️",
    descricao: "Procedimento médico específico"
  }
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

// Função para ordenar tipos de atendimento
const ordenarTipos = (tipos) => {
  return tipos.sort((a, b) => {
    const ordemA = TIPOS_ATENDIMENTO[a.tipo]?.ordem || 999;
    const ordemB = TIPOS_ATENDIMENTO[b.tipo]?.ordem || 999;
    return ordemA - ordemB;
  });
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
  const [filtroTipo, setFiltroTipo] = useState("");
  const [painelExpandido, setPainelExpandido] = useState({});

  // Calcular estatísticas
  const estatisticas = React.useMemo(() => {
    if (!data?.data) return { total: 0, consultas: 0, retornos: 0, procedimentos: 0 };
    
    let total = 0, consultas = 0, retornos = 0, procedimentos = 0;
    
    data.data.forEach(medico => {
      medico.tipos.forEach(tipo => {
        tipo.datas.forEach(data => {
          const vagasDisponiveis = data.quantidade - (data.atendimento || 0);
          if (vagasDisponiveis > 0) {
            total += vagasDisponiveis;
            switch (tipo.tipo) {
              case 'consulta': consultas += vagasDisponiveis; break;
              case 'retorno': retornos += vagasDisponiveis; break;
              case 'procedimento': procedimentos += vagasDisponiveis; break;
              default: break;
            }
          }
        });
      });
    });
    
    return { total, consultas, retornos, procedimentos };
  }, [data]);

  const formatarData = (data) => {
    if (!data) return ''
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Função para alternar estado do painel
  const alternarPainel = (medicoId, tipo) => {
    const chave = `${medicoId}-${tipo}`;
    setPainelExpandido(prev => ({
      ...prev,
      [chave]: !prev[chave]
    }));
  };

  // Função para expandir/contrair todos os painéis
  const alternarTodosPaineis = (expandir) => {
    if (!data?.data) return;
    
    const novosEstados = {};
    data.data.forEach(medico => {
      medico.tipos.forEach(tipo => {
        const chave = `${medico.medico_id}-${tipo.tipo}`;
        novosEstados[chave] = expandir;
      });
    });
    setPainelExpandido(novosEstados);
  };

  // Função para expandir apenas painéis com poucas vagas
  const expandirPoucasVagas = () => {
    if (!data?.data) return;
    
    const novosEstados = {};
    data.data.forEach(medico => {
      medico.tipos.forEach(tipo => {
        const chave = `${medico.medico_id}-${tipo.tipo}`;
        const temPoucasVagas = tipo.datas.some(data => {
          const vagasDisponiveis = data.quantidade - (data.atendimento || 0);
          return vagasDisponiveis > 0 && vagasDisponiveis <= 3;
        });
        novosEstados[chave] = temPoucasVagas;
      });
    });
    setPainelExpandido(novosEstados);
  };

  // Filtragem dinâmica
  const vagasFiltradas = data?.data?.filter((item) => {
    const nomeMatch = item.medico_nome.toLowerCase().includes(buscaMedico.toLowerCase());
    if (!buscaData && !filtroTipo) return nomeMatch;
    
    // Verifica se alguma data em algum tipo bate com os filtros
    const temData = item.tipos?.some(tipo => {
      if (filtroTipo && tipo.tipo !== filtroTipo) return false;
      if (!buscaData) return true;
      return tipo.datas.some(data => data.data === buscaData);
    });
    return nomeMatch && temData;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-xl mb-4">⚠️ Erro ao buscar vagas</div>
        <Button onClick={refetch} color="blue" className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header com título e filtros */}
      <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl border-0 rounded-2xl">
        <Typography variant="h3" className="mb-4 text-center font-bold text-blue-900 drop-shadow-lg">
          🏥 Vagas Disponíveis para Médicos
        </Typography>
        <Typography variant="paragraph" className="text-center text-blue-700 mb-6">
          Padrão de atendimento: 1- Consulta | 2- Retorno | 3- Procedimento
        </Typography>
        
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <Input
            label="Buscar médico"
            value={buscaMedico}
            onChange={e => setBuscaMedico(e.target.value)}
            className="bg-white rounded-lg shadow-sm border border-blue-200"
            icon={<span role="img" aria-label="search">🔍</span>}
          />
          <Input
            type="date"
            label="Buscar por data"
            value={buscaData}
            onChange={e => setBuscaData(e.target.value)}
            className="bg-white rounded-lg shadow-sm border border-blue-200"
            icon={<span role="img" aria-label="calendar">📅</span>}
          />
          <Select
            label="Filtrar por tipo"
            value={filtroTipo}
            onChange={(val) => setFiltroTipo(val)}
            className="bg-white rounded-lg shadow-sm border border-blue-200"
          >
            <Option value="">Todos os tipos</Option>
            <Option value="consulta">1 - Consulta</Option>
            <Option value="retorno">2 - Retorno</Option>
            <Option value="procedimento">3 - Procedimento</Option>
          </Select>
          <Button
            onClick={refetch}
            color="blue"
            className="flex items-center gap-2 px-6 py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <span role="img" aria-label="refresh">🔄</span>
            )}
            Atualizar
          </Button>
        </div>
        
        {/* Botões de controle dos painéis */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            onClick={() => alternarTodosPaineis(true)}
            color="green"
            size="sm"
            className="flex items-center gap-2"
          >
            <span role="img" aria-label="expand">📂</span>
            Expandir Todos
          </Button>
          <Button
            onClick={() => alternarTodosPaineis(false)}
            color="red"
            size="sm"
            className="flex items-center gap-2"
          >
            <span role="img" aria-label="collapse">📁</span>
            Contrair Todos
          </Button>
          <Button
            onClick={expandirPoucasVagas}
            color="amber"
            size="sm"
            className="flex items-center gap-2"
          >
            <span role="img" aria-label="alert">⚠️</span>
            Poucas Vagas
          </Button>
        </div>
      </Card>

      {/* Estatísticas rápidas */}
      <Card className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-0 rounded-xl">
        <Typography variant="h6" className="text-center font-bold text-indigo-800 mb-4">
          📊 Resumo de Vagas Disponíveis
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-indigo-100">
            <div className="text-2xl font-bold text-indigo-600">{estatisticas.total}</div>
            <div className="text-sm text-indigo-700">Total de Vagas</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{estatisticas.consultas}</div>
            <div className="text-sm text-blue-700">🩺 Consultas</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-amber-100">
            <div className="text-2xl font-bold text-amber-600">{estatisticas.retornos}</div>
            <div className="text-sm text-amber-700">🔄 Retornos</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="text-2xl font-bold text-green-600">{estatisticas.procedimentos}</div>
            <div className="text-sm text-green-700">⚕️ Procedimentos</div>
          </div>
        </div>
      </Card>

      {/* Grid de vagas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {vagasFiltradas?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 p-8">
            <div className="text-4xl mb-4">🔍</div>
            <Typography variant="h5" className="text-gray-600 mb-2">
              Nenhuma vaga encontrada
            </Typography>
            <Typography variant="paragraph" className="text-gray-500">
              Tente ajustar os filtros de busca
            </Typography>
          </div>
        )}
        
        {vagasFiltradas?.map((item, index) => (
          <Card key={index + 1} className="shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardBody className="p-6">
              {/* Header do médico */}
              <div className="mb-6 flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="bg-blue-200 rounded-full p-3 shadow-md">
                  <span role="img" aria-label="doctor" className="text-2xl">👨‍⚕️</span>
                </div>
                <div className="flex-1">
                  <Typography variant="h5" className="font-bold text-blue-800 mb-1">
                    {item.medico_nome}
                  </Typography>
                  <Typography variant="small" className="text-blue-600 font-medium">
                    {item.medico_especialidade}
                  </Typography>
                </div>
              </div>

              {/* Tipos de atendimento ordenados */}
              <div className="space-y-4">
                {ordenarTipos(item.tipos).map((tipo, tipoIdx) => {
                  const configTipo = TIPOS_ATENDIMENTO[tipo.tipo];
                  if (!configTipo) return null;
                  
                  return (
                                         <div key={tipoIdx + 1} className={`border-2 ${configTipo.borderColor} rounded-xl overflow-hidden`}>
                       {/* Header do tipo com botão de collapse */}
                       <div className={`${configTipo.bgColor} p-3 border-b-2 ${configTipo.borderColor}`}>
                         <div className="flex items-center gap-3">
                           <span className="text-2xl">{configTipo.icone}</span>
                           <div className="flex-1">
                             <Typography variant="h6" className={`font-bold ${configTipo.textColor}`}>
                               {configTipo.label}
                             </Typography>
                             <Typography variant="small" className={`${configTipo.textColorLight}`}>
                               {configTipo.descricao}
                             </Typography>
                             {!painelExpandido[`${item.medico_id}-${tipo.tipo}`] && (
                               <div className="mt-2">
                                 <Chip
                                   color="gray"
                                   value={`${(() => {
                                     const vagasDisponiveis = tipo.datas.filter(data => {
                                       const emAtendimento = data.atendimento;
                                       const vagasDisponiveis = data.quantidade - emAtendimento;
                                       if (vagasDisponiveis <= 0) return false;
                                       if (buscaData && data.data !== buscaData) return false;
                                       if (filtroTipo && tipo.tipo !== filtroTipo) return false;
                                       return true;
                                     });
                                     return vagasDisponiveis.length;
                                   })()} vagas disponíveis`}
                                   className="text-xs"
                                 />
                               </div>
                             )}
                           </div>
                           <div className="flex items-center gap-2">
                             <Chip 
                               color={configTipo.cor} 
                               value={tipo.tipo.toUpperCase()} 
                               className="font-bold text-xs"
                             />
                             <IconButton
                               variant="text"
                               size="sm"
                               onClick={() => alternarPainel(item.medico_id, tipo.tipo)}
                               className={`${configTipo.textColor} hover:bg-white/20`}
                             >
                               <span className="text-lg transition-transform duration-200" style={{
                                 transform: painelExpandido[`${item.medico_id}-${tipo.tipo}`] ? 'rotate(180deg)' : 'rotate(0deg)'
                               }}>
                                 ▼
                               </span>
                             </IconButton>
                           </div>
                         </div>
                       </div>
                      
                                             {/* Datas e vagas */}
                       <div className={`p-4 bg-white transition-all duration-300 ${painelExpandido[`${item.medico_id}-${tipo.tipo}`] ? 'block' : 'hidden'}`}>
                         {(() => {
                           const vagasDisponiveis = tipo.datas.filter(data => {
                             const emAtendimento = data.atendimento;
                             const vagasDisponiveis = data.quantidade - emAtendimento;
                             if (vagasDisponiveis <= 0) return false;
                             if (buscaData && data.data !== buscaData) return false;
                             if (filtroTipo && tipo.tipo !== filtroTipo) return false;
                             return true;
                           });
                           
                           if (vagasDisponiveis.length === 0) {
                             return (
                               <div className="text-center py-6 text-gray-500">
                                 <div className="text-3xl mb-2">📋</div>
                                 <Typography variant="paragraph" className="text-gray-600">
                                   Nenhuma vaga disponível para {configTipo.label.toLowerCase()}
                                 </Typography>
                               </div>
                             );
                           }
                           
                           return vagasDisponiveis.map((data, dataIdx) => {
                             const emAtendimento = data.atendimento;
                             const vagasDisponiveis = data.quantidade - emAtendimento;
                             
                             const vagasColor = getVagasColor(vagasDisponiveis);
                             const vagasMensagem = getVagasMensagem(vagasDisponiveis);
                             
                             return (
                               <div key={dataIdx + 1} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                                 <div className="flex items-center justify-between mb-3">
                                   <div className="flex items-center gap-2">
                                     <span role="img" aria-label="location" className="text-lg">📍</span>
                                     <Typography variant="h6" className="font-semibold text-gray-800">
                                       {data.local_nome}
                                     </Typography>
                                   </div>
                                   <Chip
                                     color={vagasColor}
                                     value={`${vagasDisponiveis} vagas`}
                                     icon={vagasColor === "red" ? <span role="img" aria-label="alert">⚠️</span> : undefined}
                                     className={`font-bold ${vagasColor === "red" ? "animate-pulse" : ""}`}
                                   />
                                 </div>
                                 
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                     <span role="img" aria-label="calendar" className="text-lg">📅</span>
                                     <Typography variant="paragraph" className="font-medium text-gray-700">
                                       {formatarData(data.data)}
                                       <br />
                                       <small>{data.horario} - {data.horario_fim}</small>
                                       
                                     </Typography>
                                   </div>
                                   
                                   {vagasMensagem && (
                                     <Chip
                                       color="red"
                                       value={vagasMensagem}
                                       className="text-xs font-bold animate-pulse"
                                     />
                                   )}
                                 </div>
                                 
                                 {/* Informações adicionais */}
                                 <div className="mt-3 pt-3 border-t border-gray-200">
                                   <div className="flex justify-between text-sm text-gray-600">
                                     <span>Total de vagas: {data.quantidade}</span>
                                     <span>Agendados: {emAtendimento}</span>
                                   </div>
                                 </div>
                               </div>
                             );
                           });
                         })()}
                       </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Footer com informações */}
      <Card className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-0 rounded-xl">
        <div className="text-center">
          <Typography variant="paragraph" className="text-gray-700 mb-2">
            💡 <strong>Dica:</strong> Use o padrão 1-2-3 para agilizar o atendimento
          </Typography>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-blue-500">🩺</span>
              <span>Consulta (1º)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-500">🔄</span>
              <span>Retorno (2º)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">⚕️</span>
              <span>Procedimento (3º)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Vagas;
