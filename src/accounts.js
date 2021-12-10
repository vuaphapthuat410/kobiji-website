// in src/User.js
import * as React from "react";
import { auth } from "./firebase";
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
  SearchInput,
  DateField,
  PasswordInput,
  ShowButton,
  EditButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  TopToolbar,
  ListButton,
  Toolbar,
  SaveButton,
  SelectInput,
  useRedirect,
  email,
  required,
  minLength,
  maxLength,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import firebase from "firebase";

const user = firebase.auth().currentUser;

const roleList = [
  { id: "管理", name: "管理" },
  { id: "アドミン", name: "アドミン" },
];

// chữa cháy tạm thời
var dupList = [];
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      dupList.push(doc.data().mail);
    });
  });
db.collection("talents")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      dupList.push(doc.data().mailAddress);
    });
  });

const dupValidation = (value, allValues) => {
  for (const dup of dupList) {
    if (dup !== undefined && value === dup) {
      return "Duplicate email";
    }
    // console.log(dup)
  }
  return undefined;
};

// const dupValidation = (value, allValues) => {
//   return dupList.every( (dup) => {
//     if (dup !== undefined && value === dup) {
//       console.log("Dup " + value)
//       return 'Duplicate email';
//     }
//     return undefined;
//   })
// };

const validateEmail = [required(), email(), dupValidation];
const validateName = [required(), minLength(2), maxLength(64)];
const validateRole = required();
const validatePasswd = [required(), minLength(8), maxLength(20)];

const AccountFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="名前" alwaysOn />
  </Filter>
);

const ListActions = (props) => (
  <div>
    <CreateButton label="追加" />
    {/* <ExportButton label="エクスポート" /> */}
  </div>
);

export const AccountList = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>アカウント管理</div>
    <List
      {...props}
      // filters={<AccountFilter />}
      actions={<ListActions />}
      title="アカウント管理"
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
        <DeleteButton undoable={false} label="削除" redirect={false} />
      </Datagrid>
    </List>
  </>
);

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

export const AccountShow = (props) => (
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

const CreateActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="アカウント一覧へ"
      icon={<ChevronLeft />}
    />
  </TopToolbar>
);

const CreateToolbar = (props) => (
  <Toolbar {...props}>
    {/* {user !== null && <SaveButton label="追加" redirect="show" submitOnEnter={true} />} */}
    <SaveButton label="追加" redirect="show" submitOnEnter={true} />
    {/* <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        style={{ marginLeft: "10px" }}
      >
        キャンセル
      </Button> */}
  </Toolbar>
);

export const AccountCreate = (props) => {
  const redirect = useRedirect();
  const user = auth.currentUser;
  const onSuccess = async ({ data }) => {
    await auth
      .createUserWithEmailAndPassword(data.mail, data.password)
      .then(async (newUser) => {
        await auth.updateCurrentUser(user);
        redirect(`/accounts/`);
      });
  };
  return (
    <Create {...props} actions={<CreateActionList />} onSuccess={onSuccess}>
      <SimpleForm toolbar={<CreateToolbar />}>
        {/* <TextInput source="id" label="ID" /> */}
        <TextInput source="name" label="名前" validate={validateName} />
        <TextInput
          source="mail"
          label="メールアドレス"
          validate={validateEmail}
        />
        <SelectInput
          source="role"
          label="役割"
          choices={roleList}
          validate={validateRole}
        />
        <PasswordInput
          source="password"
          label="パスワード"
          validate={validatePasswd}
        />
      </SimpleForm>
    </Create>
  );
};

const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="アカウント一覧へ"
      icon={<ChevronLeft />}
    />
    <ShowButton label="アカウント詳細へ" to="show"></ShowButton>
  </TopToolbar>
);

export const AccountEdit = (props) => (
  <Edit {...props} actions={<EditActionList />}>
    <SimpleForm>
      <TextInput source="name" label="名前" validate={validateName} />
      <TextInput
        source="mail"
        label="メールアドレス"
        validate={validateEmail}
      />
      <SelectInput
        source="role"
        label="役割"
        choices={roleList}
        validate={validateRole}
      />
    </SimpleForm>
  </Edit>
);
