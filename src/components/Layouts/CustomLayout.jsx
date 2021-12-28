import * as React from 'react';
import { Layout } from 'react-admin';
import CustomAppBar from './CustomAppBar';
import { ProfileProvider } from "../Profile/profile";

// const CustomLayout = (props) => <Layout {...props} appBar={CustomAppBar} />;

const CustomLayout = (props) => (
    <ProfileProvider>
      <Layout {...props} appBar={CustomAppBar} />
    </ProfileProvider>
  );

export default CustomLayout;



