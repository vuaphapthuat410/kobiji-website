import * as React from "react";
import { Fragment } from "react";
import { AppBar } from "react-admin";
import { Box } from "@material-ui/core";
import NotificationButton from "./notificationButton";
import Info from "./infoHeader"

const CustomAppBar = (props) => (
  <AppBar {...props} container={Fragment}>
    <Info />
    <Box sx={{ flexGrow: 1 }} />
    <NotificationButton />
  </AppBar>
);

export default CustomAppBar;
