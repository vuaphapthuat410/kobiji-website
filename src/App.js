import  React,{useEffect} from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import Dashboard from './Dashboard';
import { PostList, PostShow, PostCreate, PostEdit } from './posts';
import { UserList, UserShow, UserCreate, UserEdit } from './users';
import jsonServerProvider from 'ra-data-json-server';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import CustomLoginPage from './CustomLoginPage';
import {authProvider,dataProvider,auth} from './firebase'

function App() {
    return (
        <Admin dataProvider={dataProvider} dashboard={Dashboard} authProvider={authProvider} loginPage={CustomLoginPage}>
            <Resource
                name="posts"
                icon={PostIcon}
                list={PostList}
                show={PostShow}
                create={PostCreate}
                edit={PostEdit}
            />
            <Resource
                name="users"
                icon={UserIcon}
                list={UserList}
                show={UserShow}
                create={UserCreate}
                edit={UserEdit}
            />
        </Admin>
    )
};

export default App