import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";

const data = [
  {
    title: "Atendimentos Ativos",
    percentage: "12%",
    price: "5.000",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
  {
    title: "Em atendimento",
    percentage: "16%",
    price: "300",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
  {
    title: "Aguardando pagamento",
    percentage: "10%",
    price: "19",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
  {
    title: "Finalizados",
    percentage: "20%",
    price: "2000",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
];

export function KpiCard({ title, percentage, price, color, icon }) {
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <Typography className="!font-medium !text-xs text-gray-600">
            {title}
          </Typography>
          <div className="flex items-center gap-1">
            {icon}
            <Typography color={color} className="font-medium !text-xs">
              {percentage}
            </Typography>
          </div>
        </div>
        <Typography color="blue-gray" className="mt-1 font-bold text-2xl">
          {price}
        </Typography>
      </CardBody>
    </Card>
  );
}

const Home = () => {
  return (
    <div>
      <section className="container mx-auto ">
        <div className="flex justify-between md:items-center">
          <div>
            <Typography className="font-bold">Performance</Typography>
          </div>
        </div>
        <div className="mt-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
          {data.map((props, key) => (
            <KpiCard key={key} {...props} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
