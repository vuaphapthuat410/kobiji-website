import React, { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser, EditGuesser , useGetIdentity} from "react-admin";
import Dashboard from "./Dashboard";
import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import { UserList, UserShow, UserCreate, UserEdit } from "./users";
import { TalentList, TalentShow, TalentCreate, TalentEdit } from "./talents.js";
import { AccountList, AccountShow, AccountCreate, AccountEdit } from "./accounts.js";
import jsonServerProvider from "ra-data-json-server";
import PostIcon from "@material-ui/icons/Book";
import UserIcon from "@material-ui/icons/Group";
import CustomLoginPage from "./CustomLoginPage";
import { authProvider, dataProvider, auth } from "./firebase";

function App() {
  const [email,setEmail] = useState("")
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user){
      setEmail(user.email)
      }
    });
  }, []);
  if (email ==='admin@gmail.com'){
    return (
      <Admin
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
      </Admin>
    );
  } else {
    return (
      <Admin
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
      </Admin>
    );
  }
}

export default App;
