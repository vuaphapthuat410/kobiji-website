import React from "react";
import { UserMenu, MenuItemLink } from "react-admin";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from '@material-ui/icons/Lock';
import { useProfile } from "../Profile/profile";

const CustomUserMenu = (props) => {
  const { profileVersion } = useProfile();

  return (
    <UserMenu key={profileVersion} {...props}>
      <MenuItemLink
        to="/my-profile"
        primaryText="My Profile"
        leftIcon={<PersonIcon />}
      />
      <MenuItemLink
        to="/passwd-change"
        primaryText="Change Password"
        leftIcon={<LockIcon />}
      />
    </UserMenu>
  );
};

export default CustomUserMenu;
