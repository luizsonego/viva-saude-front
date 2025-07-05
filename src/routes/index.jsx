import React from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
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
import EditMedico from "../pages/Medicos/edit";
import Grupos from "../pages/Configuracoes/grupos";
import Prioridades from "../pages/Configuracoes/prioridades";
import Especialidades from "../pages/Configuracoes/especialidades";
import Procedimentos from "../pages/Configuracoes/procedimentos";
import Unidades from "../pages/Configuracoes/unidades";
import Origem from "../pages/Configuracoes/origem";
import Modal from "../components/Modal";
import CreateAtendimento from "../pages/Atendimentos/create";
import EditarAtendente from "../pages/Atendente/editar";

import ModalAtendimento from "../pages/Atendimentos/modal";
import MarkdownComponent from "../pages/Doc";
import Vagas from "../pages/Medicos/vagas";
import AdicionarVaga from "../pages/Medicos/adicionarVaga";
import EditarVaga from "../pages/Medicos/editarVaga";

export default function MainRouter() {
  // const navigate = useNavigate();
  // const { data, isLoading: loading, status } = useAccessFetchRequest();
  // const access = data?.data?.access;

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
          path: "atendimentos",
          children: [
            {
              path: "",
              element: <Atendimentos />,
            },
            {
              path: "create",
              element: <CreateAtendimento />,
            },
            { path: "ver/:resource/:id", element: <ModalAtendimento /> },
          ],
        },
        // {
        //   path: "/dashboard/cadastros",
        //   element: <Config />,
        // },
        {
          path: "cadastros",
          children: [
            {
              path: "",
              element: <Config />,
            },
            {
              path: "grupos",
              element: <Grupos />,
            },
            {
              path: "prioridades",
              element: <Prioridades />,
            },
            {
              path: "especialidades",
              element: <Especialidades />,
            },
            {
              path: "procedimentos",
              element: <Procedimentos />,
            },
            {
              path: "unidades",
              element: <Unidades />,
            },
            {
              path: "origem",
              element: <Origem />,
            },
            { path: ":path/editar/:resource/:id", element: <Modal /> },
          ],
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
            {
              path: "editar/:id",
              element: <EditMedico />,
            },
            {
              path: "vagas",
              element: <Vagas />,
            },
            {
              path: "add-vaga/:id",
              element: <AdicionarVaga />,
            },
            {
              path: "editar-vaga/:id",
              element: <EditarVaga />,
            }
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
            {
              path: "editar/:id",
              element: <EditarAtendente />,
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
      path: "/documentacao",
      element: <MarkdownComponent />,
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
