import React, { useEffect, useState } from "react";
import {
  Admin,
  Resource,
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
  const [email, setEmail] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setEmail(user.email);
      }
    });
  }, []);
  if (email === "admin@gmail.com") {
    return (
      <Admin
        layout={CustomLayout}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        authProvider={authProvider}
        loginPage={CustomLoginPage}
      >
        {/* <Resource
          name="posts"
          icon={PostIcon}
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        /> */}
        {/* <Resource
          name="users"
          icon={UserIcon}
          list={UserList}
          show={UserShow}
          create={UserCreate}
          edit={UserEdit}
        /> */}
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
    return (
      <Admin
      layout={CustomLayout}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        authProvider={authProvider}
        loginPage={CustomLoginPage}
      >
        {/* <Resource
          name="posts"
          icon={PostIcon}
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        /> */}
        {/* <Resource
          name="users"
          icon={UserIcon}
          list={UserList}
          show={UserShow}
          create={UserCreate}
          edit={UserEdit}
        /> */}
        {/* <Resource
          name="talents"
          icon={UserIcon}
          list={TalentList}
          show={TalentShow}
          create={TalentCreate}
          edit={TalentEdit}
        /> */}
        <Resource
          name="events"
          icon={EventIcon}
          list={EventList}
          show={EventShow}
        />
      </Admin>
    );
  }
}

export default App;
