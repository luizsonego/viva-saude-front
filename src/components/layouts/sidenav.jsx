import {
  ChevronDownIcon,
  ChevronRightIcon,
  PresentationChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

export function Sidenav({ brandImg, brandName, routes }) {
  const [openSubMenu, setOpenSubMenu] = React.useState(0);
  const handleOpenSubMenu = (value) => {
    setOpenSubMenu(openSubMenu === value ? 0 : value);
  };
  return (
    <aside
      className={`translate-x-0 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/" className="py-6 px-8 text-center">
          <img
            src={brandImg}
            alt="Logo viva saude"
            className="w-24 h-24 aspect-square text-center mx-auto"
          />
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          // onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <List key={key}>
            <Accordion
              open={openSubMenu}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openSubMenu === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              {title && (
                <ListItem>
                  <Typography
                    variant="small"
                    color={"blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </ListItem>
              )}
              {pages.map(({ icon, name, path, children }) =>
                children ? (
                  <>
                    {console.log("childres", children)}
                    <ListItem key={name} className="pb-3">
                      <AccordionHeader
                        className="border-b-0 p-0 pl-0"
                        onClick={() => handleOpenSubMenu(1)}
                      >
                        <ListItemPrefix>{icon}</ListItemPrefix>
                        <Typography
                          color="blue-gray"
                          className="gradient w-full h-auto rounded-lg font-medium capitalize "
                        >
                          {name}
                        </Typography>
                      </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                      <List className="p-0 pl-3">
                        {children.map(({ name, path }) => (
                          <NavLink
                            to={`/${layout}${path}`}
                            className={({ isActive }) =>
                              isActive
                                ? "gradient w-full h-auto bg-gray-300 rounded-lg font-medium capitalize "
                                : "text capitalize"
                            }
                          >
                            <ListItem key={name} className="pb-3">
                              <ListItemPrefix>
                                <ChevronRightIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              {name}
                            </ListItem>
                          </NavLink>
                        ))}
                      </List>
                    </AccordionBody>
                  </>
                ) : (
                  <NavLink
                    to={`/${layout}${path}`}
                    className={({ isActive }) =>
                      isActive
                        ? "gradient w-full h-auto bg-gray-300 rounded-lg font-medium capitalize "
                        : "text capitalize"
                    }
                  >
                    <ListItem key={name} className="pb-3">
                      <ListItemPrefix>{icon}</ListItemPrefix>
                      {name}
                    </ListItem>
                  </NavLink>
                )
              )}
            </Accordion>
          </List>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Viva Saúde",
};
