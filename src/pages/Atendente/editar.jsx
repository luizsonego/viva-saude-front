import React, { useEffect } from "react";
import { useGetResource } from "../../hooks/get/useGet.query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useResourcePut } from "../../hooks/update/useUpdate.query";

const hiddenFields = [
  "id",
  "etiqueta",
  "descricao",
  "created_at",
  "updated_at",
  "deleted_at",
  "slug",
  "tempo",
  "obrigatorio",
  "password_hash",
  "status",
  "auth_key",
  "access_given",
  "password_reset_token",
  "account_activation_token",
  "profile.id",
  "profile.user_id",
  "profile.created_at",
  "profile.updated_at",
  "profile.deleted_at",
];
const fieldTypes = {
  cor: "color",
};

const EditarAtendente = () => {
  const history = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();

  const { data, isLoading } = useGetResource("atendente", "atendente", id);
  const { mutate, isPending } = useResourcePut(
    "atendentes",
    "atendente",
    () => {
      history(-1);
    }
  );

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    mutate(formData);
  };

  const renderFields = (data, parentKey = "") => {
    return (
      data &&
      Object.keys(data).map((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (hiddenFields.includes(fullKey)) return null;

        const value = data[key];

        if (typeof value === "object" && value !== null) {
          return (
            <div key={fullKey} className="nested-fields">
              <Typography
                variant="h6"
                color="blue-gray"
                style={{ textTransform: "capitalize" }}
              >
                {key}
              </Typography>
              {renderFields(value, fullKey)}{" "}
              {/* Chama a função recursivamente */}
            </div>
          );
        }

        return (
          <div key={fullKey}>
            <Typography
              variant="h6"
              color="blue-gray"
              style={{ textTransform: "capitalize" }}
            >
              {key}
            </Typography>
            <Input
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              {...register(fullKey)}
              defaultValue={value}
              type={fieldTypes[fullKey] || "text"}
            />
          </div>
        );
      })
    );
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Card shadow={true} className="w-full justify-center">
          <CardBody>
            <Typography
              variant="h4"
              color="blue-gray"
              className="mb-8"
              style={{ textTransform: "capitalize" }}
            >
              Editar Atendente
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              {renderFields(data)}
              {/* <Input label="Senha" name="password" register={register} /> */}
              <input
                value={isPending ? "Enviando..." : "Enviar"}
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
              />
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default EditarAtendente;
