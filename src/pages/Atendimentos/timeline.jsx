import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineItem,
  Typography,
} from "@material-tailwind/react";
import React from "react";

const CustomTimeline = ({ data }) => {
  return (
    <Timeline>
      {data?.etapas?.map((item) => {
        return (
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader className="h-3">
            <Typography variant="h6" color="blue-gray" className="leading-none">
            {item.hora}
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <Typography
              variant="small"
              color="gary"
              className="font-normal text-gray-600"
              >
              {item.descricao}
            </Typography>
          </TimelineBody>
        </TimelineItem>
          )
        })}
    </Timeline>
  );
};

export default CustomTimeline;
