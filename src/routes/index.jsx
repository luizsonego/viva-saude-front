import React from "react";
import {
  Navigate,
  useNavigate,
  useRoutes,
  useLocation,
} from "react-router-dom";
import Main from "../components/layouts/Main";
import Login from "../pages/Login";
import { isAuthenticated } from "../services/auth";
import Home from "../pages/Home";
import Atendimentos from "../pages/Atendimentos";
import Config from "../pages/Configuracoes";
import Medicos from "../pages/Medicos";
import Create from "../pages/Medicos/create";
import Atendentes from "../pages/Atendente";
import CreateAtendente from "../pages/Atendente/create";
import Autoatendimento from "../pages/Auto";

export default function MainRouter() {
  return useRoutes([
    {
      path: "/dashboard",
      element: isAuthenticated() ? <Main /> : <Navigate to="/login" />,
      children: [
        {
          path: "/dashboard",
          element: <Home />,
        },
        {
          path: "/dashboard/inicio",
          element: <Home />,
        },
        {
          path: "/dashboard/atendimentos",
          element: <Atendimentos />,
        },
        {
          path: "/dashboard/cadastros",
          element: <Config />,
        },
        {
          path: "medicos",
          children: [
            {
              path: "",
              element: <Medicos />,
            },
            {
              path: "criar",
              element: <Create />,
            },
          ],
        },
        {
          path: "atendente",
          children: [
            {
              path: "",
              element: <Atendentes />,
            },
            {
              path: "criar",
              element: <CreateAtendente />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <Navigate to="/dashboard" />,
    },
    {
      path: "/auto_atendimento",
      children: [
        {
          path: "",
          element: <Autoatendimento />,
        },
      ],
    },
    {
      path: "*",
      element: <>404</>,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
}
