import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React, { useState } from "react";
import {
  Create,
  DateInput,
  ListButton,
  Loading,
  PasswordInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  ImageInput,
  Toolbar,
  TopToolbar,
  useDataProvider,
  useMutation,
  useRedirect,
} from "react-admin";
import { auth } from "../../db/firebase";
import {
  countryList,
  genderList, statusList
} from "../../utils/list";
import {
  validateBirthday,
  validateCountry,
  validateEmail,
  validateGender,
  validateName,
  validatePasswd, validateStatus
} from "../../utils/validate";

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
    <SaveButton
      label="追加"
      redirect="show"
      transform={(data) => {
        data.role = "タレント";
        return data;
      }}
      submitOnEnter={true}
    />
  </Toolbar>
);

const AccountCreate = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .getList("accounts", {
        pagination: { page: 1, perPage: 100 },
        filter: {},
      })
      .then(({ data }) => {
        setUser(data.find((_user) => _user.mail === currentUser.email));
        setLoading(false);
      });
  }, [dataProvider, currentUser]);

  const onSuccess = async ({ data }) => {
    // Add talents to manager field
    let manage_talents = user?.manage_talents ?? [];
    manage_talents.push(data.mail);
    await mutate({
      type: "update",
      resource: "accounts",
      payload: {
        id: user.id,
        data: {
          manage_talents,
        },
      },
    });
    await auth
      .createUserWithEmailAndPassword(data.mail, data.password)
      .then(async (newUser) => {
        await auth.updateCurrentUser(currentUser);
        redirect(`/accounts/`);
      });
  };

  if (loading) return <Loading />;

  return (
    <Create {...props} actions={<CreateActionList />} onSuccess={onSuccess} >
      <SimpleForm toolbar={<CreateToolbar />}>
        {/* <TextInput source="id" label="ID" /> */}
        <TextInput source="name" label="名前" validate={validateName} />
        <TextInput
          source="mail"
          label="メールアドレス"
          validate={validateEmail}
        />

        <PasswordInput
          source="password"
          label="パスワード"
          validate={validatePasswd}
        />

        <DateInput
          source="birthday"
          label="生年月日"
          validate={validateBirthday}
        />

        <SelectInput
          source="gender"
          label="性別"
          choices={genderList}
          validate={validateGender}
        />

        <SelectInput
          source="status"
          label="ステータス"
          choices={[{ id: "新規", name: "新規" }]}
          validate={validateStatus}
        />

        <SelectInput
          source="country"
          label="国籍"
          choices={countryList}
          validate={validateCountry}
        />
      </SimpleForm>
    </Create>
  );
};

export default AccountCreate;
