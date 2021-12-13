import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  AutocompleteArrayInput,
  Create,
  DateInput,
  ListButton,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  TopToolbar, useRedirect
} from "react-admin";
import useContext from "../../db/useContext";
import firebase from "../../db/firebase";
import { validateRequired, validateTitle } from "../../utils/validate";

const CreateActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="イベント一覧へ"
      icon={<ChevronLeft />}
    />
  </TopToolbar>
);

function userChoices(users) {
  const usersWithouAdmin = users.filter((user) => user.role !== "アドミン");
  return usersWithouAdmin.map((user) => {
    return { id: user.mail, name: `(${user.role}) ${user.name} - ${user.mail}` };
  });
}

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
    </Toolbar>
  );
};
const EventCreate = (props) => {
  const redirect = useRedirect();
  const onSuccess = ({ data }) => {
    const { active, date, description, members, members_read } = data;
    console.log("databe", data);
    firebase
      .database()
      .ref("events/" + data.id)
      .set({
        active,
        date,
        description,
        members,
      });
    redirect(`/events/${data.id}/show`);
  };
  const [{ users }, loading] = useContext();

  if (loading) return <></>;

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
          choices={userChoices(users)}
        />
      </SimpleForm>
    </Create>
  );
};
export default EventCreate;
