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

  const user = auth.currentUser;

  const roleList = [
    { id: "管理", name: "管理" },
    { id: "アドミン", name: "アドミン" },
  ];

  const validateEmail = [required(), email()];
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
          <DateField disabled showTime="false" source="createdate" label="作成日" />
          <ShowButton label="詳細" />
          <EditButton label="変更" />
          <DeleteButton label="削除" redirect={false} />
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
      <Show
        {...props}
        actions={<ShowActionList />}>
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
    const onSuccess = ({ data }) => {
      auth.createUserWithEmailAndPassword(data.mail, data.password)
        .then( (data) =>{
          console.log(data.user.uid);
        })
      auth.updateCurrentUser(user) // not run
      redirect(`/accounts/${data.id}/show`);
    };
    return(
    <Create
      {...props}
      actions={<CreateActionList />}
      onSuccess={onSuccess}
    >
      <SimpleForm toolbar={<CreateToolbar />}>
        {/* <TextInput source="id" label="ID" /> */}
        <TextInput source="name" label="名前" validate={validateName}/>
        <TextInput source="mail" label="メールアドレス" validate={validateEmail}/>
        <SelectInput source="role" label="役割" choices={roleList} validate={validateRole}/>
        <PasswordInput source="password" label="パスワード" validate={validatePasswd}/>
      </SimpleForm>
    </Create>
  )};

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
    <Edit
      {...props}
      actions={<EditActionList />}
    >
      <SimpleForm>
        <TextInput source="name" label="名前" validate={validateName}/>
        <TextInput source="mail" label="メールアドレス" validate={validateEmail}/>
        <SelectInput source="role" label="役割" choices={roleList} validate={validateRole}/>
      </SimpleForm>
    </Edit>
  );
