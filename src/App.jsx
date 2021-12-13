import EventIcon from "@material-ui/icons/Event";
import UserIcon from "@material-ui/icons/Group";
import React from "react";
import { Admin, Loading, Resource } from "react-admin";
import AccountCreate from "./components/Accounts/AccountCreate";
import AccountEdit from "./components/Accounts/AccountEdit";
import AccountList from "./components/Accounts/AccountList";
import AccountShow from "./components/Accounts/AccountShow";
import Dashboard from "./components/Dashboard/Dashboard";
import EventCreate from "./components/Events/EventCreate";
import EventEdit from "./components/Events/EventEdit";
import EventList from "./components/Events/EventList";
import EventShow from "./components/Events/EventShow";
import CustomLayout from "./components/Layouts/CustomLayout";
import CustomLoginPage from "./components/Login/CustomLoginPage";
import TalentCreate from "./components/Talents/TalentCreate";
import TalentEdit from "./components/Talents/TalentEdit";
import TalentList from "./components/Talents/TalentList";
import TalentShow from "./components/Talents/TalentShow";
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
