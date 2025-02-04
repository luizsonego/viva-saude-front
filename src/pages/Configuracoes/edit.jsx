import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResource } from "../../hooks/get/useGet.query";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  DialogHeader,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
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
];
const fieldTypes = {
  cor: "color",
};

const EditConfigs = () => {
  const history = useNavigate();
  const { id, resource } = useParams();
  const { register, handleSubmit, setValue } = useForm();

  const { data, isLoading } = useGetResource(resource, resource, id);

  const { mutate, isPending } = useResourcePut(resource, resource, () => {
    history(-1);
  });

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
              Editar {resource}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              {data &&
                Object.keys(data).map((key, index) => {
                  if (hiddenFields.includes(key)) return null;
                  return (
                    <div key={key}>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className=""
                        style={{ textTransform: "capitalize" }}
                      >
                        {key}
                      </Typography>
                      <Input
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                        {...register(key)}
                        defaultValue={data[key]}
                        type={fieldTypes[key] || "text"}
                      />
                    </div>
                  );
                })}

              {resource === "grupo" && (
                <Alert
                  // icon={<Icon />}
                  className="rounded-none border-l-4 border-[#d2b732] bg-[#d2b732]/10 font-medium text-[#d2b732] mt-5"
                >
                  Lembre-se. Sempre que alterar a cor do grupo, irá alterar a
                  cor das etiquetas também
                </Alert>
              )}

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

export default EditConfigs;
