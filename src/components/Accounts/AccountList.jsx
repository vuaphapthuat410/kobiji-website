import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  ShowButton,
  EditButton,
  DeleteButton,
  CreateButton,
} from "react-admin";
const ListActions = (props) => (
  <div>
    <CreateButton label="追加" />
    {/* <ExportButton label="エクスポート" /> */}
  </div>
);

const AccountList = (props) => {
  const onSuccess = async ({ data }) => {
    // ToDo: Delete user in firebase auth
  };
  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>アカウント管理</div>
      <List
        {...props}
        // filters={<AccountFilter />}
        actions={<ListActions />}
        title="アカウント管理"
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="name" label="名前" />
          <TextField source="mail" label="メールアドレス" />
          <TextField source="role" label="役割" />
          <DateField
            disabled
            showTime="false"
            source="createdate"
            label="作成日"
          />
          <ShowButton label="詳細" />
          <EditButton label="変更" />
          <DeleteButton label="削除" undoable={false} redirect={false} onSuccess={onSuccess} />
        </Datagrid>
      </List>
    </>
  );
};

export default AccountList;
