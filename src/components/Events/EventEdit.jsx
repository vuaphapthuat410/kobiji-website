import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  AutocompleteArrayInput,
  DateInput,
  Edit,
  ListButton, SaveButton, SelectInput, SimpleForm,
  TextInput, Toolbar, TopToolbar
} from "react-admin";
import useContext from "../../db/useContext";
import { validateRequired, validateTitle } from "../../utils/validate";

const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="イベント一覧へ"
      icon={<ChevronLeft />}
    />
    {/* <ShowButton label="イベント詳細へ" to="show" /> */}
  </TopToolbar>
);

function userChoices(users) {
  return users.map((user) => {
    return { id: user.mail, name: `(${user.role}) ${user.name} - ${user.mail}` };
  });
}

const CreateToolbar = (props) => {
  return (
    <Toolbar {...props}>
      <SaveButton
        label="変更"
        redirect="show"
        transform={(data) => {
          data.date = new Date(data.date);
          return data;
        }}
        submitOnEnter={true}
      />
    </Toolbar>
  );
};



const EventEdit = (props) => {
  const [{ users }, loading] = useContext();

  if (loading) return <></>;

  return (
    <Edit
      {...props}
      actions={<EditActionList />}
      transform={(data) => {
        let members_read = {};
        data.members.forEach(
          (member) =>
            (members_read[member] = data.members_read[member] ?? false)
        );
        data.members_read = members_read;
        data.date = new Date(data.date);
        return data;
      }}
    >
      <SimpleForm toolbar={<CreateToolbar />}>
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
        />
        <AutocompleteArrayInput
          source="members"
          label="参加者"
          validate={validateRequired}
          choices={userChoices(users)}
        />
      </SimpleForm>
    </Edit>
  );
};
export default EventEdit;
