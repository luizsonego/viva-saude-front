import React, { Children } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./dashboard-navbar";
import { Sidenav } from "./sidenav";
import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
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
        // element: <Home />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "atendimentos",
        path: "/atendimentos",
        // element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "médicos",
        path: "/medicos",
        // element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "cadastros",
        path: "/cadastros",
        children: [
          {
            name: "grupos",
            path: "/cadastros/grupos",
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
        // element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "atendentes",
        path: "/atendente",
        // element: <Notifications />,
      },
    ],
  },
];
function Main() {
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} brandImg={"/img/logo.png"} />
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
