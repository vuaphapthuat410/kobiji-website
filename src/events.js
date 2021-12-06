import * as React from "react";
import { auth } from "./firebase";
import firebase from "firebase";
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
  BooleanField,
  ShowButton,
  EditButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  DateField,
  DateInput,
  SelectInput,
  SelectField,
  AutocompleteArrayInput,
  ListButton,
  TopToolbar,
  Toolbar,
  SaveButton,
  useRedirect,
  required,
  minLength,
  maxLength,
  useRecordContext,
} from "react-admin";
import { Chip } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

const validateTitle = [required(), minLength(2), maxLength(64)];
const validateRequired = required();
const account_id = auth.currentUser?.email ?? "";

var users = new Map();
users.set("admin@gmail.com", { name: "admin", role: "ユーザー" });
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users.set(doc.data().mail, {
        name: doc.data().name,
        role: doc.data().role,
      });
    });
  });
db.collection("talents")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users.set(doc.data().mailAddress, {
        name: doc.data().name,
        role: "タレント",
      });
    });
  });

function userChoices() {
  return Array.from(users).map((pair) => {
    return { id: pair[0], name: `(${pair[1].role}) ${pair[1].name}` };
  });
}

function getRole() {
  return users.get(account_id)?.role;
}

const EventFilter = (props) => (
  <Filter {...props}>
    <TextInput label="探索" source="title" alwaysOn />
  </Filter>
);

const ListActions = (props) => (
  <div>
    {getRole() === "ユーザー" && <CreateButton label="追加" />}
    <ExportButton label="エクスポート" />
  </div>
);

const NameField = (props) => {
  const record = useRecordContext(props);
  return (
    <>
      {record.members_read &&
        Object.keys(record.members_read).map((key) => (
          <Chip size="small" variant="outlined" label={users.get(key).name} />
        ))}
    </>
  );
};

export const EventList = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント管理</div>
    <List
      {...props}
      filters={<EventFilter />}
      actions={<ListActions />}
      title="イベント管理"
    >
      <Datagrid>
        <TextField source="title" label="タイトル" />
        <TextField source="description" label="内容" />
        <BooleanField source="active" label="開催する" />
        <DateField
          disabled
          locales="ja-JP"
          options={{ dateStyle: "long" }}
          source="date"
          label="日時"
        />
        <NameField label="参加者" />
        <ShowButton label="詳細" />
        {getRole() === "ユーザー" && <EditButton label="変更" />}
        {getRole() === "ユーザー" && <DeleteButton label="削除" redirect={false} />}
      </Datagrid>
    </List>
  </>
);

const ShowActionList = ({ basePath, data }) => {
  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="イベント一覧へ"
        icon={<ChevronLeft />}
      />
      {getRole() === "ユーザー" && <EditButton label="イベント更新" to="edit" /> }
    </TopToolbar>
  );
};

export const EventShow = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント詳細</div>
    <Show {...props} title="イベント詳細" actions={<ShowActionList />}>
      <SimpleShowLayout>
        <TextField source="title" label="タイトル" />
        <TextField source="description" label="内容" />
        <SelectField
          source="active"
          label="開催中"
          choices={[
            { id: true, name: "開催する" },
            { id: false, name: "開催しない" },
          ]}
        />
        <DateField
          disabled
          locales="ja-JP"
          options={{ dateStyle: "long" }}
          source="date"
          label="日時"
        />
        <NameField label="参加者" />
      </SimpleShowLayout>
    </Show>
  </>
);

const CreateActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="イベント一覧へ"
      icon={<ChevronLeft />}
    />
  </TopToolbar>
);

const CreateToolbar = (props) => {
  return (
    <Toolbar {...props}>
      <SaveButton
        label="追加"
        redirect="show"
        transform={(data) => {
          let members_read = {};
          data.members.forEach((member) => (members_read[member] = false));
          data.members_read = members_read;
          data.active = true;
          data.date = new Date(data.date);
          return data;
        }}
        submitOnEnter={true}
      />
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
};

export const EventCreate = (props) => {
  const redirect = useRedirect();
  const onSuccess = ({ data }) => {
    redirect(`/events/${data.id}/show`);
  };
  return (
    <Create {...props} actions={<CreateActionList />} onSuccess={onSuccess}>
      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput source="title" label="名前" validate={validateTitle} />
        <TextInput
          source="description"
          label="内容"
          validate={validateRequired}
        />
        <DateInput source="date" label="日時" validate={validateRequired} />
        <AutocompleteArrayInput
          source="members"
          label="参加者"
          validate={validateRequired}
          choices={userChoices()}
        />
      </SimpleForm>
    </Create>
  );
};

const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="イベント一覧へ"
      icon={<ChevronLeft />}
    />
    <ShowButton label="イベント詳細へ" to="show"></ShowButton>
  </TopToolbar>
);

export const EventEdit = (props) => (
  <Edit
    {...props}
    actions={<EditActionList />}
    transform={(data) => {
      let members_read = {};
      data.members.forEach((member) => (members_read[member] = data.members_read[member] ?? false));
      data.members_read = members_read;
      data.date = new Date(data.date);
      return data;
    }}
  >
    <SimpleForm>
      <TextInput source="title" label="名前" validate={validateTitle} />
      <TextInput
        source="description"
        label="内容"
        validate={validateRequired}
      />
      
      <DateInput source="date" label="日時" validate={validateRequired} />
      <SelectInput
        label="開催する"
        source="active"
        validate={validateRequired}
        choices={[
          { id: true, name: "開催する" },
          { id: false, name: "開催しない" },
        ]}
      /><AutocompleteArrayInput
        source="members"
        label="参加者"
        validate={validateRequired}
        choices={userChoices()}
      />
    </SimpleForm>
  </Edit>
);
