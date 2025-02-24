import React from "react";
import {
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginPost, useResourcePost } from "../../hooks/post/usePost.query";
import MainAlert from "../../components/Alert/MainAlert";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [openModalError, setOpenModalError] = React.useState(false);
  const [dataMessage, setDataMessage] = React.useState({});

  const { mutate, isLoading, isFetching } = useMutation({
    mutationFn: useLoginPost,
    onSuccess: (data) => {
      if (data.status === 400 || data.status === 401) {
        setOpenModalError(true);
        setDataMessage({ message: data.message, type: "red" });
        return;
      }
      setOpenModalError(true);
      setDataMessage({ message: data.message, type: "green" });
      localStorage.setItem(
        process.env.REACT_APP_ACCESS_TOKEN,
        data.data.token.auth_key
      );
      setTimeout(1000);
      navigate("/");
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <>
      <MainAlert
        handleOpen={openModalError}
        handleClose={() => setOpenModalError(!openModalError)}
        message={dataMessage.message}
        color={dataMessage.type}
      />
      <Card shadow={false} className="w-full justify-center">
        <CardBody>
          <form
            className="mt-8 mb-2 max-w-screen-lg "
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputForm label="Email" name="username" register={register} />
            <InputForm label="Senha" name="password" register={register} />

            {isLoading || isFetching ? (
              "entrando"
            ) : (
              <input
                value={isLoading || isFetching ? "Entrando..." : "Entrar"}
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
              />
            )}
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Login;

const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
}) => {
  return (
    <>
      {/* <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography> */}
      <Input
        size="lg"
        placeholder={placeholder}
        label={label}
        // className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        // labelProps={{
        //   className: "before:content-none after:content-none",
        // }}
        {...register(name, { required })}
      />
    </>
  );
};
