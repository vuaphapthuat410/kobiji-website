import React, { useEffect, useState } from "react";
import { Admin, Resource, Loading } from "react-admin";
import Dashboard from "./components/Dashboard/Dashboard";
import TalentList from "./components/Talents/TalentList";
import TalentShow from "./components/Talents/TalentShow";
import TalentCreate from "./components/Talents/TalentCreate";
import TalentEdit from "./components/Talents/TalentEdit";

import AccountList from "./components/Accounts/AccountList";
import AccountShow from "./components/Accounts/AccountShow";
import AccountCreate from "./components/Accounts/AccountCreate";
import AccountEdit from "./components/Accounts/AccountEdit";

import EventList from "./components/Events/EventList";
import EventShow from "./components/Events/EventShow";
import EventCreate from "./components/Events/EventCreate";
import EventEdit from "./components/Events/EventEdit";

import UserIcon from "@material-ui/icons/Group";
import EventIcon from "@material-ui/icons/Event";
import CustomLoginPage from "./components/Login/CustomLoginPage";
import CustomLayout from "./components/Layouts/CustomLayout";
import { authProvider, dataProvider } from "./db/firebase";
import useContext from "./db/useContext";

function App() {
  const [{ currentUser }, loading] = useContext();

  if (loading) return Loading;

  if (currentUser.role === "アドミン") {
    return (
      <Admin
        layout={CustomLayout}
        dashboard={Dashboard}
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={CustomLoginPage}
      >
        <Resource
          name="accounts"
          icon={UserIcon}
          list={AccountList}
          show={AccountShow}
          create={AccountCreate}
          edit={AccountEdit}
        />

        <Resource
          name="events"
          icon={EventIcon}
          list={EventList}
          create={EventCreate}
          show={EventShow}
          edit={EventEdit}
        />
      </Admin>
    );
  }

  if (currentUser.role === "管理") {
    return (
      <Admin
        layout={CustomLayout}
        dashboard={Dashboard}
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={CustomLoginPage}
      >
        <Resource
          name="accounts"
          icon={UserIcon}
          list={TalentList}
          show={TalentShow}
          create={TalentCreate}
          edit={TalentEdit}
          options={{
            label: "Talents"
          }}
        />

        <Resource
          name="events"
          icon={EventIcon}
          list={EventList}
          create={EventCreate}
          show={EventShow}
          edit={EventEdit}
        />
      </Admin>
    );
  }

  return (
    <Admin
      layout={CustomLayout}
      dashboard={Dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={CustomLoginPage}
    >
      <Resource
        name="events"
        icon={EventIcon}
        list={EventList}
        create={EventCreate}
        show={EventShow}
        edit={EventEdit}
      />
    </Admin>
  );
}

export default App;
