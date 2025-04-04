import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineItem,
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import React from "react";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon 
} from "@heroicons/react/24/solid";

const CustomTimeline = ({ data }) => {
  // Função para determinar o ícone com base no tipo de etapa
  const getTimelineIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'concluído':
      case 'concluido':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'pendente':
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case 'erro':
      case 'falha':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  // Função para determinar a cor do chip com base no tipo
  const getChipColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'concluído':
      case 'concluido':
        return "green";
      case 'pendente':
        return "amber";
      case 'erro':
      case 'falha':
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <Timeline className="p-2">
        {data?.etapas?.map((item, index) => (
          <TimelineItem 
            key={index}
            className="h-full"
          >
            <TimelineConnector className="!w-[1px] !bg-gray-300" />
            <TimelineHeader className="h-auto py-1">
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center rounded-full bg-white p-1 shadow-sm">
                  {getTimelineIcon(item.tipo)}
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="leading-none font-medium text-sm">
                    {item.hora}
                  </Typography>
                  {item.tipo && (
                    <Chip 
                      value={item.tipo} 
                      color={getChipColor(item.tipo)} 
                      size="sm" 
                      className="mt-0.5 text-xs"
                    />
                  )}
                </div>
              </div>
            </TimelineHeader>
            <TimelineBody className="pb-4">
              <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-2">
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-normal text-sm"
                  >
                    {item.descricao}
                  </Typography>
                  {item.detalhes && (
                    <Typography
                      variant="small"
                      color="gray"
                      className="mt-1 font-normal italic text-xs"
                    >
                      {item.detalhes}
                    </Typography>
                  )}
                </CardBody>
              </Card>
            </TimelineBody>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default CustomTimeline;
