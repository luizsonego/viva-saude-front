import { Input, Typography } from "@material-tailwind/react";
import React from "react";

const InputForm = ({
  label = "",
  placeholder = "",
  register,
  required,
  type,
  defaultValue,
  hidden = false,
}) => {
  return hidden ? (
    <>
      <div className="relative w-full h-0 hidden">
        <Input
          hidden={hidden}
          value={defaultValue}
          type={type}
          placeholder={placeholder}
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          {...register(label, { required })}
        />
      </div>
    </>
  ) : (
    <>
      <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography>
      <Input
        hidden={hidden}
        value={defaultValue}
        type={type}
        size="lg"
        placeholder={placeholder}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...register(label, { required })}
      />
    </>
  );
};

export default InputForm;
