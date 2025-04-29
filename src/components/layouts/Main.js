import React, { Children } from "react";
import { Link, Outlet } from "react-router-dom";
import DashboardNavbar from "./dashboard-navbar";
import { Sidenav } from "./sidenav";
import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useGetResources } from "../../hooks/get/useGet.query";
import { logout } from "../../services/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "inicio",
        path: "/",
        roles: ["atendente", "gerente", "supervisor"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "atendimentos",
        path: "/atendimentos",
        roles: ["atendente", "gerente", "supervisor"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "médicos",
        path: "/medicos",
        roles: ["gerente", "supervisor"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "vagas",
        path: "/medicos/vagas",
        roles: ["atendente", "gerente", "supervisor"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "cadastros",
        path: "/cadastros",
        roles: ["gerente", "supervisor"],
        children: [
          {
            name: "grupos",
            path: "/cadastros/grupos",
            roles: ["gerente", "supervisor"],
          },
          {
            name: "prioridades",
            path: "/cadastros/prioridades",
          },
          {
            name: "especialidades",
            path: "/cadastros/especialidades",
          },
          {
            name: "procedimentos",
            path: "/cadastros/procedimentos",
          },
          {
            name: "unidades",
            path: "/cadastros/unidades",
          },
          {
            name: "origem",
            path: "/cadastros/origem",
          },
        ],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "atendentes",
        path: "/atendente",
        roles: ["gerente", "supervisor"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: (
          <Link
            onClick={() => {
              logout();
            }}
          >
            Sair
          </Link>
        ),
        path: "",
        roles: ["atendente", "gerente", "supervisor"],
      },
    ],
  },
];
function Main() {
  const { data } = useGetResources("authenticatided", "user-authenticaded");

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} brandImg={"/img/logo.png"} userRole={data} />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <div className="p-0 pt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
