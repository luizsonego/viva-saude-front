import React, { useState, useMemo } from "react";
import Table from "./Table";
import { avatar, Button, Spinner, Input, Typography, Card, CardBody } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useGetResources } from "../../hooks/get/useGet.query";
import { useDeleteMutation } from "../../hooks/delete/useDelete.query";

const columns = [
  {
    Header: "Nome",
    accessor: "nome",
  },
  {
    Header: "Local",
    accessor: "local",
  },
  {
    Header: "Especialidade",
    accessor: "especialidade",
  },
];

const Medicos = () => {
  const navigate = useNavigate();
  const [searchNome, setSearchNome] = useState("");
  const [searchLocalEspecialidade, setSearchLocalEspecialidade] = useState("");

  const { data, isLoading } = useGetResources("medicos", "medicos");

  const { mutate, isPending } = useDeleteMutation("medicos", "medico");

  // Filtra os dados baseado nos termos de busca
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    const nomeTerm = searchNome.toLowerCase().trim();
    const localEspecialidadeTerm = searchLocalEspecialidade.toLowerCase().trim();
    
    return data.filter((medico) => {
      // Filtro por nome
      const nomeMatch = !nomeTerm || medico.nome?.toLowerCase().includes(nomeTerm);
      
      // Filtro por local ou especialidade
      let localEspecialidadeMatch = !localEspecialidadeTerm;
      if (localEspecialidadeTerm) {
        // Busca por especialidade
        const especialidadeMatch = medico.especialidade?.toLowerCase().includes(localEspecialidadeTerm);
        
        // Busca por local (pode ser string ou array)
        let localMatch = false;
        if (Array.isArray(medico.local)) {
          localMatch = medico.local.some(item => 
            item.local?.toLowerCase().includes(localEspecialidadeTerm)
          );
        } else {
          localMatch = medico.local?.toLowerCase().includes(localEspecialidadeTerm);
        }
        
        localEspecialidadeMatch = especialidadeMatch || localMatch;
      }
      
      return nomeMatch && localEspecialidadeMatch;
    });
  }, [data, searchNome, searchLocalEspecialidade]);

  const handleEdit = (id) => {
    navigate(`editar/${id}`);
  };
  const handleDelete = (id) => {
    mutate(id);
  };

  const handleAddVaga = (id) => {
    navigate(`add-vaga/${id}`);
  };

  const handleEditVaga = (id) => {
    navigate(`editar-vaga/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h3" color="blue-gray" className="font-bold">
              Gestão de Médicos
            </Typography>
            <Typography variant="paragraph" color="gray" className="mt-1">
              Gerencie os médicos cadastrados no sistema
            </Typography>
          </div>
          <Link to="criar">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3"
            >
              + Novo Médico
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <Card className="mb-8 shadow-sm">
        <CardBody className="p-6">
          <Typography variant="h5" color="blue-gray" className="mb-4 font-semibold">
            Buscar Médicos
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Nome do Médico
              </Typography>
              <Input
                type="text"
                placeholder="Digite o nome do médico..."
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Local ou Especialidade
              </Typography>
              <Input
                type="text"
                placeholder="Digite local de atendimento ou especialidade..."
                value={searchLocalEspecialidade}
                onChange={(e) => setSearchLocalEspecialidade(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
          
          {/* Results Summary */}
          {(searchNome || searchLocalEspecialidade) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <Typography variant="small" color="blue-gray" className="font-medium">
                {filteredData.length === 0 
                  ? "Nenhum médico encontrado com os critérios informados"
                  : `${filteredData.length} médico${filteredData.length > 1 ? 's' : ''} encontrado${filteredData.length > 1 ? 's' : ''}`
                }
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredData}
          loading={isLoading}
          title="Lista de Médicos"
          edit={handleEdit}
          del={handleDelete}
          addVaga={handleAddVaga}
          editVaga={handleEditVaga}
          loadingDel={isPending}
        />
      )}
    </div>
  );
};

export default Medicos;
