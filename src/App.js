import React, { useEffect, useState } from "react";
import {
  Admin,
  Resource,
  Loading
} from "react-admin";
import Dashboard from "./Dashboard";
import { TalentList, TalentShow, TalentCreate, TalentEdit } from "./talents.js";
import {
  AccountList,
  AccountShow,
  AccountCreate,
  AccountEdit,
} from "./accounts.js";
import { EventList, EventShow, EventCreate, EventEdit } from "./events.js";
import UserIcon from "@material-ui/icons/Group";
import EventIcon from "@material-ui/icons/Event";
import CustomLoginPage from "./CustomLoginPage";
import CustomLayout from "./CustomLayout";
import { authProvider, dataProvider, auth } from "./firebase";

function App() {
  // const dataProvider1 = useDataProvider();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState()
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dataProvider
        .getList("accounts", {
          pagination: { page: 1, perPage: 1000 },
          filter: {},
        })
        .then(({ data }) => {
          const index = data.findIndex(value => value.mail === user.email)
          if (index !== -1) {
            if (data[index].role === "管理") {
              setRole(1)
            } else {
              setRole(0)
            }
          } else {
            setRole(2)
          }
        })
      }
    });
  }, [dataProvider]);
  console.log(role);
  if (role === 0) {
    return (
      <Admin
        layout={CustomLayout}
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={CustomLoginPage}
      >
        <Resource
          name="talents"
          icon={UserIcon}
          list={TalentList}
          show={TalentShow}
          create={TalentCreate}
          edit={TalentEdit}
        />
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
  } else {
    if (role === 1) {
      return (
        <Admin
          layout={CustomLayout}
          dataProvider={dataProvider}
          authProvider={authProvider}
          loginPage={CustomLoginPage}
        >
          <Resource
            name="talents"
            icon={UserIcon}
            list={TalentList}
            show={TalentShow}
            create={TalentCreate}
            edit={TalentEdit}
          />
          <Resource
            name="events"
            icon={EventIcon}
            list={EventList}
            show={EventShow}
          />
        </Admin>
      );
    } else {
      return (
        <Admin
          layout={CustomLayout}
          dataProvider={dataProvider}
          dashboard={Dashboard}
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
  }
}

export default App;
