import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EditButton,
  TopToolbar,
  ListButton,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";

const ShowActionList = ({ basePath, data }) => {
  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="アカウント一覧へ"
        icon={<ChevronLeft />}
      />
      <EditButton label="アカウント更新" to="edit" />
    </TopToolbar>
  );
};
const AccountShow = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント詳細</div>
    <Show {...props} actions={<ShowActionList />}>
      <SimpleShowLayout>
        <TextField source="name" label="名前" />
        <TextField source="mail" label="メールアドレス" />
        <TextField source="role" label="役割" />
      </SimpleShowLayout>
    </Show>
  </>
);

export default AccountShow;
