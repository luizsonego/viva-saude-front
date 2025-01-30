import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetResource } from "../../hooks/get/useGet.query";
import {
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useResourcePut } from "../../hooks/update/useUpdate.query";

const EditConfigs = () => {
  const { id, resource } = useParams();
  const { register, handleSubmit, setValue } = useForm();

  const { data, isLoading } = useGetResource(resource, resource, id);

  const { mutate, isPending } = useResourcePut(resource, resource);

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
        <Card shadow={false} className="w-full justify-center">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {data &&
                Object.keys(data).map((key) => (
                  <div key={key} className={key === "id" ? "hidden" : ""}>
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
                    />
                  </div>
                ))}

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
