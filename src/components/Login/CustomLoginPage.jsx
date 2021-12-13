// LoginPage.js
import React from "react";
import { Login, LoginForm } from "react-admin";

const CustomLoginForm = (props) => (
  <div>
    <div style={{ fontFamily: "monospace", marginLeft: "15px" }}></div>
    <LoginForm {...props} />
  </div>
);

const CustomLoginPage = (props) => (
  <Login {...props}>
    <CustomLoginForm {...props} />
  </Login>
);

export default CustomLoginPage;
