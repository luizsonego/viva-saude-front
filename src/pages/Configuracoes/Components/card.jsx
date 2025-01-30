import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React from "react";

const CustomCard = ({ title = "", children, handleAction, isLoading }) => {
  return (
    <Card className="mb-10">
      <CardHeader
        variant="gradient"
        color="blue-gray"
        className="mb-0 p-6 flex justify-between"
      >
        <Typography variant="h6" color="white">
          {title}
        </Typography>
        {handleAction && <Button onClick={handleAction}>Cadastrar</Button>}
      </CardHeader>
      <CardBody>
        {isLoading ? <Spinner color="indigo" className="h-8 w-8" /> : children}
      </CardBody>
    </Card>
  );
};

export default CustomCard;
