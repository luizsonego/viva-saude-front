import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  Alert,
  Avatar,
  Breadcrumbs,
  Card,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Menu,
  MenuHandler,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  TicketIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  Bars3Icon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

function DashboardNavbar() {
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const LIST_ITEM_STYLES =
    "select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900";

  return (
    <Navbar
      color={"white"}
      className={`rounded-xl transition-all "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5`}
      fullWidth
      blurred={true}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 transition-all mt-1`}>
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          {/* <Typography variant="h6" color="blue-gray">
            {page}
          </Typography> */}
        </div>

        {/* <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            // onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
        </div> */}
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
