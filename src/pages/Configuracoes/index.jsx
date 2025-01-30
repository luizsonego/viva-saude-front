import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import GenericTable from "../../components/Table/genericTable";
import { useForm } from "react-hook-form";
import {
  useAcoesPost,
  useEtiquetaPost,
  useGroupPost,
  useOrigemPost,
  usePrioridadePost,
  useResourcePost,
  useUnidadesPost,
} from "../../hooks/post/usePost.query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAcoesFetch,
  useGruposFetch,
  usePrioridadesFetch,
  useUnidadesFetch,
  useOrigemFetch,
  useGetResources,
} from "../../hooks/get/useGet.query";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  useDeleteMutation,
  useEtiquetaDelete,
  usegrupoDelete,
  usePrioridadeDelete,
} from "../../hooks/delete/useDelete.query";
import { useNavigate } from "react-router-dom";
import Grupos from "./grupos";
import Prioridades from "./prioridades";
import Especialidades from "./especialidades";
import Origem from "./origem";
import Procedimentos from "./procedimentos";
import Unidades from "./unidades";

const Config = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const [openModalError, setOpenModalError] = React.useState(false);
  const [dataError, setDataError] = React.useState("");
  const [openModalGroup, setOpenModalGroup] = React.useState(false);
  const [openModalPrioridade, setOpenModalPrioridade] = React.useState(false);
  const [openModalAcoes, setOpenModalAcoes] = React.useState(false);
  const [openModalUnidades, setOpenModalUnidades] = React.useState(false);
  const [openModalOrigem, setOpenModalOrigem] = React.useState(false);
  const [openModalEtiquetas, setOpenModalEtiquetas] = React.useState(false);
  const [openModalEspecialidade, setOpenModalEspecialidade] =
    React.useState(false);
  const [openModalCadastroEtiqueta, setOpenModalCadastroEtiqueta] =
    React.useState(false);
  const [dataEtiquetas, setDataEtiquetas] = React.useState([]);

  const { data: grupoData, isLoading: loadingGrupos } = useGruposFetch();
  const { data: prioridadeData } = usePrioridadesFetch();
  const { data: acoesData } = useAcoesFetch();
  const { data: unidadesData } = useUnidadesFetch();
  const { data: origemData } = useOrigemFetch();

  const { data: especialidadeData } = useGetResources(
    "especialidade",
    "especialidade"
  );

  const { mutateAsync: mutateEspecialidade, isPending: pendingEspecialidade } =
    useResourcePost(
      "especialidade",
      "especialidade",
      () => {
        setOpenModalEspecialidade(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );
  const { mutateAsync: mutateGroup, isPending: pendingGroup } = useResourcePost(
    "grupos",
    "grupo",
    () => {
      setOpenModalGroup(false);
      reset();
    },
    (err) => {
      setOpenModalError(true);
      setDataError(err);
    }
  );
  const { mutateAsync: mutateEtiqueta, isPending: pendingEtiqueta } =
    useResourcePost(
      "grupos",
      "etiqueta",
      () => {
        setOpenModalCadastroEtiqueta(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );
  const { mutateAsync: mutatePrioridade, isPending: pendingPrioridade } =
    useResourcePost(
      "prioridades",
      "prioridade",
      () => {
        setOpenModalPrioridade(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );
  const { mutateAsync: mutateAcoes, isPending: pendingAcoes } = useResourcePost(
    "acoes",
    "acoes",
    () => {
      setOpenModalAcoes(false);
      reset();
    },
    (err) => {
      setOpenModalError(true);
      setDataError(err);
    }
  );
  const { mutateAsync: mutateUnidade, isPending: pendingUnidade } =
    useResourcePost(
      "unidades",
      "unidade",
      () => {
        setOpenModalUnidades(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );
  const { mutateAsync: mutateOrigem, isPending: pendingOrigem } =
    useResourcePost(
      "origem",
      "origem",
      () => {
        setOpenModalOrigem(false);
        reset();
      },
      (err) => {
        setOpenModalError(true);
        setDataError(err);
      }
    );

  const { mutate: deleteGrupo, isPending: deletingGrupo } = useDeleteMutation(
    "grupos",
    "grupo"
  );
  const { mutate: deleteEtiqueta, isPending: deletingEtiqueta } =
    useDeleteMutation("grupos", "etiqueta");
  const { mutate: deletePrioridade, isPending: deletingPrioridade } =
    useDeleteMutation("prioridades", "prioridade");
  const { mutate: deleteProcedimento, isPending: deletingProcedimento } =
    useDeleteMutation("acoes", "procedimento");
  const { mutate: deleteUnidade, isPending: deletingUnidade } =
    useDeleteMutation("unidades", "unidade");
  const { mutate: deleteOrigem, isPending: deletingOrigem } = useDeleteMutation(
    "origem",
    "origem"
  );
  const { mutate: deleteEspecialidade, isPending: deletingEspecialidade } =
    useDeleteMutation("especialidade", "especialidade");

  const onSubmit = (data) => {
    mutateGroup(data);
  };
  const onSubmitEtiqueta = (data) => {
    mutateEtiqueta(data);
  };
  const onSubmitPrioridade = (data) => {
    mutatePrioridade(data);
  };
  const onSubmitAcoes = (data) => {
    mutateAcoes(data);
  };
  const onSubmitUnidade = (data) => {
    mutateUnidade(data);
  };
  const onSubmitOrigem = (data) => {
    mutateOrigem(data);
  };

  const onSubmitEspecialidade = (data) => {
    mutateEspecialidade(data);
  };

  const handleOpenEspecialidade = () =>
    setOpenModalEspecialidade(!openModalEspecialidade);
  const handleOpenGroup = () => setOpenModalGroup(!openModalGroup);
  const handleOpenCadastroEtiqueta = () =>
    setOpenModalCadastroEtiqueta(!openModalCadastroEtiqueta);
  const handleOpenPrioridade = () =>
    setOpenModalPrioridade(!openModalPrioridade);
  const handleOpenAcoes = () => setOpenModalAcoes(!openModalAcoes);
  const handleOpenUnidades = () => setOpenModalUnidades(!openModalUnidades);
  const handleOpenOrigem = () => setOpenModalOrigem(!openModalOrigem);
  const handleOpenModalEtiquetas = (e) => {
    setOpenModalEtiquetas(!openModalEtiquetas);
    setDataEtiquetas(e);
  };

  return (
    <>
      <Alert
        style={{
          position: "absolute",
          zIndex: 999999999999,
          top: 50,
          right: 30,
          width: "30%",
        }}
        open={openModalError}
        onClose={() => setOpenModalError(!openModalError)}
        color="red"
      >
        {dataError}
      </Alert>

      <Grupos />
      <Prioridades />
      <Especialidades />
      <Origem />
      <Procedimentos />
      <Unidades />
    </>
  );
};

export default Config;
