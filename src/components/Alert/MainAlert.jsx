import { Alert } from "@material-tailwind/react";
import React from "react";

const MainAlert = ({ handleOpen, handleClose, message, color }) => {
  return (
    <Alert
      style={{
        position: "absolute",
        zIndex: 999999999999,
        top: 50,
        right: 30,
        width: "30%",
      }}
      open={handleOpen}
      onClose={handleClose}
      color={color}
    >
      {message}
    </Alert>
  );
};

export default MainAlert;
