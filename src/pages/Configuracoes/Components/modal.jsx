import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import React from "react";

const CustomModal = ({ title, open, handler, children, width }) => {
  return (
    <Dialog open={open} handler={handler} size="xl" style={{
      zIndex: 1000,
    }}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody style={{
        maxHeight: '70vh',
        height: 'auto',
        overflowY: 'auto',
      }}>{children}</DialogBody>
    </Dialog>
  );
};

export default CustomModal;
