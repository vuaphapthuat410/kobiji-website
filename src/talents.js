// in src/User.js
import * as React from "react";
import {auth} from "./firebase"
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
  DateField,
  DateInput,
  SelectInput,
  ListButton,
  TopToolbar,
  Toolbar,
  SaveButton,
  useRedirect,
  email,
  required,
  minLength,
  maxLength,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

const genderList = [
  { id: "女", name: "女" },
  { id: "男", name: "男" },
];

const statusList = [
  { id: "新規", name: "新規" },
  { id: "新規", name: "学中" },
  { id: "卒業", name: "卒業" },
];

const countryList = [
  { id: "ベトナム", name: "ベトナム" },
  { id: "日本", name: "日本" },
  { id: "イギリス", name: "イギリス" },
];

const validateEmail = email();
const validateName = [required(), minLength(2), maxLength(64)];
const validateBirthday = [required()];
const validateGender = required();
const validateStatus = required();
const validateCountry = required();

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
        <TextField source="mailAddress" label="メールアドレス"/>
        <TextField source="birthday" label="生年月日" />
        <TextField source="status" label="ステータス" />
        <TextField source="country" label="国籍" />
        <DateField disabled showTime="false" source="createdate" label="作成日" />
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

const CreateToolbar = (props) => {
  const onSuccess = ({ data }) => {
    auth.createUserWithEmailAndPassword(data.mailAddress,'hoanganh23')
  };
  return(
  <Toolbar {...props}>
    <SaveButton label="追加" redirect="show" submitOnEnter={true}/>
    {/* <Button
      variant="contained"
      color="secondary"
      startIcon={<DeleteIcon />}
      style={{ marginLeft: "10px" }}
    >
      キャンセル
    </Button> */}
  </Toolbar>
)};

export const TalentCreate = (props) => {
  const redirect = useRedirect();
  const onSuccess = ({ data }) => {
    console.log(data.id)
    redirect(`/talents/${data.id}/show`);
    auth.createUserWithEmailAndPassword(data.mailAddress,'hoanganh23')
  };
  return(
  <Create {...props} actions={<CreateActionList /> } onSuccess={onSuccess}>
    <SimpleForm toolbar={<CreateToolbar />}> 
      {/* <TextInput source="id" label="ID" /> */}
      <TextInput source="name" label="名前" validate={validateName}/>
      <TextInput source="mailAddress" label="メールアドレス" validate={validateEmail}/>
      <DateInput source="birthday" label="生年月日" validate={validateBirthday}/>
      <SelectInput source="gender" label="性別" choices={genderList} validate={validateGender}/>
      <SelectInput source="status" label="ステータス" choices={statusList} validate={validateStatus}/>
      <SelectInput source="country" label="国籍" choices={countryList} validate={validateCountry}/>
    </SimpleForm>
  </Create>
)};

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
      {/* <TextInput source="id" label="ID" /> */}
      <TextInput source="name" label="名前" validate={validateName}/>
      <TextInput source="mailAddress" label="メールアドレス" validate={validateEmail}/>
      <DateInput source="birthday" label="生年月日" validate={validateBirthday}/>
      <SelectInput source="gender" label="性別" choices={genderList} validate={validateGender}/>
      <SelectInput source="status" label="ステータス" choices={statusList} validate={validateStatus}/>
      <SelectInput source="country" label="国籍" choices={countryList} validate={validateCountry}/>
    </SimpleForm>
  </Edit>
);
