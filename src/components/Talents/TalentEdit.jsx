import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React, { useEffect, useState } from "react";
import {
  DateInput,
  Edit,
  ListButton,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  TopToolbar,
  Loading,
  useDataProvider,
  useMutation,
  useRedirect,
} from "react-admin";
import { countryList, genderList, statusList } from "../../utils/list";
import useContext from "../../db/useContext";
import {
  validateBirthday,
  validateCountry,
  validateGender,
  validateName,
  validateRequired,
  validateStatus,
} from "../../utils/validate";
import { auth } from "../../db/firebase";

function userChoices(users) {
  let client = [];
  // for (let user in users) {
  //   if (user.role === "クライアント") {
  //     client.append({ id: user.mail, name: `${user.name} - ${user.mail}`});
  //     console.log(client)
  //   }
  //   console.log(user.mail)
  // }
  for (const [id, user] of users.entries()) {
    if (user.role === "クライアント") {
      client.push({ id: user.mail, name: `${user.name} - ${user.mail}` });
      console.log(client);
    }
    console.log(user.mail);
  }

  return client;
}

// function userChoices(users) {
//   return users.map((user) => {
//     return { id: user.mail, name: `(${user.role}) ${user.name} - ${user.mail}` };
//   });
// }

const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="タレント一覧へ"
      icon={<ChevronLeft />}
    />
    {/* <ShowButton label="タレント詳細へ" to="show"></ShowButton> */}
  </TopToolbar>
);

const CreateToolbar = (props) => {
  return (
    <Toolbar {...props}>
      <SaveButton
        label="変更"
        redirect="show"
        transform={(data) => {
          console.log("data nenn", data);
          if (data.status === "商売可能") {
            data.oldClient = data.client;
            data.client = "";
            return data;
          }
          return data;
        }}
        submitOnEnter={true}
      />
    </Toolbar>
  );
};

const Data = (props) => {
  const [isStatusSold, setIsStatusSold] = useState(
    props.record.status === "売れた" ? true : false
  );

  const { users } = props;
  return (
    <>
      {/* <TextInput source="id" label="ID" /> */}
      <TextInput
        source="name"
        label="名前"
        validate={validateName}
        // onClick={()=>{
        //   fetch("https://api.ocr.space/parse/imageurl?apikey=cf22af93a488957&url=https://firebasestorage.googleapis.com/v0/b/itss2-32f90.appspot.com/o/test_ocr.png?alt=media%26token=62914f48-d2d8-4afc-96e0-37bdd58db5cd&language=jpn&isOverlayRequired=false").then(data => console.log(data))
        // }}
      />
      <TextInput source="mail" label="メールアドレス" disabled />
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
        choices={statusList}
        validate={validateStatus}
        onChange={(e) => {
          console.log(e.target.value);
          setIsStatusSold(e.target.value === "売れた" ? true : false);
        }}
      />
      {/* <SelectInput
        source="country"
        label="国籍"
        choices={countryList}
        validate={validateCountry}
      /> */}

      {isStatusSold && (
        <SelectInput
          source="client"
          label="クライアントメール"
          choices={userChoices(users)}
        />
      )}
    </>
  );
};

const TalentEdit = (props) => {
  const [{ users }] = useContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);

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
        setClients(data.filter((_client) => _client.role === "クライアント"));
        setLoading(false);
      });
  }, [dataProvider, currentUser]);

  const onSuccess = async ({ data }) => {
    // Add talents to client field
    var client = clients.find((_user) => _user.mail === data.oldClient);
    let own = client?.own ?? [];

    if (data.status === "商売可能") {
      const newOwn = own.filter((talent) => talent !== data.mail);
      await mutate({
        type: "update",
        resource: "accounts",
        payload: {
          id: client.id,
          data: {
            own: newOwn,
          },
        },
      });
      await redirect(`/accounts/`);
    } else {
      let own = client?.own ?? [];
      own.push(data.mail);
      await mutate({
        type: "update",
        resource: "accounts",
        payload: {
          id: client.id,
          data: {
            own,
          },
        },
      });
      await redirect(`/accounts/`);
    }
  };

  if (loading) return <Loading />;

  return (
    <Edit
      {...props}
      actions={<EditActionList />}
      onSuccess={onSuccess}
      mutationMode="pessimistic"
    >
      <SimpleForm toolbar={<CreateToolbar />}>
        <Data users={users} />
      </SimpleForm>
    </Edit>
  );
};

export default TalentEdit;
