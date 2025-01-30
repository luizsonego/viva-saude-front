import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import React from "react";

const CustomModal = ({ title, open, handler, children }) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
    </Dialog>
  );
};

export default CustomModal;
