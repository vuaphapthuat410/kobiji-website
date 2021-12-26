import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  ShowButton,
  TextInput,
  EditButton,
  DeleteButton,
  CreateButton,useRefresh
} from "react-admin";
const ListActions = (props) => (
  <div>
    <CreateButton label="追加" />
    {/* <ExportButton label="エクスポート" /> */}
  </div>
);
const accountFilters = [
  <TextInput label="name" source="name" alwaysOn />,
  <TextInput label="mail" source="mail" alwaysOn />,
];
const AccountList = (props) => {
  const reFresh =useRefresh()
  const onSuccess = async ({ data }) => {
    // ToDo: Delete user in firebase auth
    reFresh()
  };
  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>アカウント管理</div>
      <List
        {...props}
        filters={accountFilters}
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
          <DeleteButton label="削除" undoable={false} onSuccess={onSuccess} />
        </Datagrid>
      </List>
    </>
  );
};

export default AccountList;
