import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import React from "react";

const CustomModal = ({ title, open, handler, children, width }) => {
  return (
    <Dialog open={open} handler={handler} size="xl" >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
    </Dialog>
  );
};

export default CustomModal;
