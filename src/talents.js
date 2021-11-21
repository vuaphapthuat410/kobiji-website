// in src/User.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  DateInput,
  SelectInput,
  ListButton,
  TopToolbar,
  Toolbar,
  SaveButton,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

const genderList = [
  { id: 0, name: "女" },
  { id: 1, name: "男" },
];

const statusList = [
  { id: 0, name: "新規" },
  { id: 1, name: "学中" },
  { id: 2, name: "卒業" },
];

const countryList = [
  { id: 0, name: "ベトナム" },
  { id: 1, name: "日本" },
  { id: 2, name: "イギリス" },
];

const TalentFilter = (props) => (
  <Filter {...props}>
    <TextInput label="探索" source="name" alwaysOn />
  </Filter>
);

const ListActions = (props) => (
  <div>
    <CreateButton label="追加" />
    <ExportButton label="エクスポート" />
  </div>
);

export const TalentList = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント管理</div>
    <List
      {...props}
      filters={<TalentFilter />}
      actions={<ListActions />}
      title="タレント管理"
    >
      <Datagrid>
        <TextField source="name" label="名前" />
        <TextField source="mailAddress" label="メールアドレス" />
        <TextField source="birthday" label="生年月日" />
        <TextField source="status" label="ステータス" />
        <TextField source="country" label="国籍" />
        <TextField disabled source="createdate" label="作成日" />
        <ShowButton label="詳細" />
        <EditButton label="変更" />
        <DeleteButton label="削除" redirect={false} />
      </Datagrid>
    </List>
  </>
);

const ShowActionList = ({ basePath, data }) => {
  console.log("Data===>", data);
  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="タレント一覧へ"
        icon={<ChevronLeft />}
      />
      <EditButton label="タレント更新" to="edit" />
    </TopToolbar>
  );
};

export const TalentShow = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント詳細</div>
    <Show {...props} title="タレント詳細" actions={<ShowActionList />}>
      <SimpleShowLayout>
        <TextField source="name" label="名前" />
        <TextField source="mailAddress" label="メールアドレス" />
        <TextField source="birthday" label="生年月日" />
        <TextField source="gender" label="セックス" />
        <TextField source="status" label="ステータス" />
        <TextField source="country" label="国籍" />
      </SimpleShowLayout>
    </Show>
  </>
);

const CreateActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="タレント一覧へ"
      icon={<ChevronLeft />}
    />
  </TopToolbar>
);

const CreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="追加" redirect="show" submitOnEnter={true} />
    <Button
      variant="contained"
      color="secondary"
      startIcon={<DeleteIcon />}
      style={{ marginLeft: "10px" }}
    >
      キャンセル
    </Button>
  </Toolbar>
);

export const TalentCreate = (props) => (
  <Create {...props} actions={<CreateActionList />}>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="id" label="ID" />
      <TextInput source="name" label="名前" />
      <TextInput source="mailAddress" label="メールアドレス" />
      <DateInput source="birthday" label="生年月日" />
      <SelectInput source="gender" label="セックス" choices={genderList} />
      <SelectInput source="status" label="ステータス" choices={statusList} />
      <SelectInput source="country" label="国籍" choices={countryList} />
    </SimpleForm>
  </Create>
);

const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="タレント一覧へ"
      icon={<ChevronLeft />}
    />
    <ShowButton label="タレント詳細へ" to="show"></ShowButton>
  </TopToolbar>
);

export const TalentEdit = (props) => (
  <Edit {...props} actions={<EditActionList />}>
    <SimpleForm>
      <TextInput source="id" label="ID" />
      <TextInput source="name" label="名前" />
      <TextInput source="mailAddress" label="メールアドレス" />
      <DateInput source="birthday" label="生年月日" />
      <SelectInput source="gender" label="セックス" choices={genderList} />
      <SelectInput source="status" label="ステータス" choices={statusList} />
      <SelectInput source="country" label="国籍" choices={countryList} />
    </SimpleForm>
  </Edit>
);
