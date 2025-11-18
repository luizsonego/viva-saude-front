import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { useAtendimentosFetch } from "../../hooks/get/useGet.query";

const STATUS_CARDS = [
  {
    key: "ABERTO",
    title: "Atendimentos Abertos",
    color: "blue",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-blue-500" />,
  },
  {
    key: "FILA DE ESPERA",
    title: "Fila de Espera",
    color: "amber",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-amber-500" />,
  },
  {
    key: "EM ANALISE",
    title: "Em Análise",
    color: "purple",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-purple-500" />,
  },
  {
    key: "AGUARDANDO AUTORIZACAO",
    title: "Aguardando Autorização",
    color: "orange",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-orange-500" />,
  },
  {
    key: "AGUARDANDO PAGAMENTO",
    title: "Aguardando Pagamento",
    color: "red",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
  },
  {
    key: "CONCLUIDO",
    title: "Concluídos",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
];

export function KpiCard({ title, value, color, icon, loading }) {
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <Typography className="!font-medium !text-xs text-gray-600">
            {title}
          </Typography>
          <div className="flex items-center gap-1">
            {icon}
          </div>
        </div>
        <Typography color="blue-gray" className="mt-1 font-bold text-2xl">
          {loading ? "..." : value}
        </Typography>
      </CardBody>
    </Card>
  );
}

const Home = () => {
  // Chama os hooks individualmente para cada status
  const aberto = useAtendimentosFetch({ status: "ABERTO", pageSize: 200 });
  const filaEspera = useAtendimentosFetch({ status: "FILA DE ESPERA", pageSize: 200 });
  const emAnalise = useAtendimentosFetch({ status: "EM ANALISE", pageSize: 200 });
  const aguardandoAutorizacao = useAtendimentosFetch({ status: "AGUARDANDO AUTORIZACAO", pageSize: 200 });
  const aguardandoPagamento = useAtendimentosFetch({ status: "AGUARDANDO PAGAMENTO", pageSize: 200 });
  const concluido = useAtendimentosFetch({ status: "CONCLUIDO", pageSize: -1 });

  const cards = [
    {
      ...STATUS_CARDS[0],
      value: aberto.data?.total ?? aberto.data?.items?.length ?? 0,
      loading: aberto.isLoading,
    },
    {
      ...STATUS_CARDS[1],
      value: filaEspera.data?.total ?? filaEspera.data?.items?.length ?? 0,
      loading: filaEspera.isLoading,
    },
    {
      ...STATUS_CARDS[2],
      value: emAnalise.data?.total ?? emAnalise.data?.items?.length ?? 0,
      loading: emAnalise.isLoading,
    },
    {
      ...STATUS_CARDS[3],
      value: aguardandoAutorizacao.data?.total ?? aguardandoAutorizacao.data?.items?.length ?? 0,
      loading: aguardandoAutorizacao.isLoading,
    },
    {
      ...STATUS_CARDS[4],
      value: aguardandoPagamento.data?.total ?? aguardandoPagamento.data?.items?.length ?? 0,
      loading: aguardandoPagamento.isLoading,
    },
    {
      ...STATUS_CARDS[5],
      value: concluido.data?.total ?? concluido.data?.items?.length ?? 0,
      loading: concluido.isLoading,
    },
  ];

  return (
    <div>
      <section className="container mx-auto ">
        <div className="flex justify-between md:items-center">
          <div>
            <Typography className="font-bold">Estatísticas de Atendimentos</Typography>
          </div>
        </div>
        <div className="mt-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
          {cards.map((card) => (
            <KpiCard
              key={card.key}
              title={card.title}
              value={card.value}
              color={card.color}
              icon={card.icon}
              loading={card.loading}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
