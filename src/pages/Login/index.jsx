import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
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

  const { mutate, isLoading, isFetching, isPending } = useMutation({
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
    <section className="px-8">
      <div className="container mx-auto h-screen grid place-items-center">
        <Card
          shadow={false}
          className="md:px-10 md:py-14 py-8 border border-gray-300 w-1/2"
        >
          <CardHeader shadow={false} floated={false} className="text-center">
            <img
              src={"/img/logo.png"}
              alt="Logo viva saude"
              className="w-64 h-64 aspect-square text-center mx-auto"
            />
            {/* <Typography
              variant="h1"
              color="blue-gray"
              className="mb-4 !text-3xl lg:text-4xl"
            >
              Web3 Login Simplified
            </Typography> */}
            {/* <Typography className="!text-gray-600 text-[18px] font-normal md:max-w-sm">
              Enjoy quick and secure access to your accounts on various Web3
              platforms.
            </Typography> */}
          </CardHeader>
          <CardBody>
            <form
              className="mt-8 mb-2 max-w-screen-lg flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <InputForm label="Email" name="username" register={register} />
              <InputForm label="Senha" name="password" register={register} />

              {isPending ? (
                "entrando"
              ) : (
                <input
                  value={isPending ? "Entrando..." : "Entrar"}
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-md w-full "
                />
              )}
            </form>
          </CardBody>
        </Card>
      </div>
      {/* <MainAlert
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
      </Card> */}
    </section>
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
