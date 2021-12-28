import * as React from "react";
import { Fragment } from "react";
import { AppBar } from "react-admin";
import { Box } from "@material-ui/core";
import Info from "./infoHeader";
import NotificationButton from "../Notifications/NotificationButton";
import CustomUserMenu from "./CustomUserMenu";

const CustomAppBar = (props) => (
  <AppBar {...props} container={Fragment} userMenu={<CustomUserMenu />} >
    <Info />
    <Box sx={{ flexGrow: 1 }} />
    <NotificationButton />
  </AppBar>
);

export default CustomAppBar;


