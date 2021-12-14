import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  DateInput,
  Edit,
  ListButton, SaveButton, SelectInput, SimpleForm,
  TextInput, Toolbar, TopToolbar
} from "react-admin";
import { countryList, genderList, statusList } from "../../utils/list";
import {
  validateBirthday,
  validateCountry, validateGender,
  validateName,
  validateStatus
} from "../../utils/validate";
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
          return data;
        }}
        submitOnEnter={true}
      />
    </Toolbar>
  );
};

const TalentEdit = (props) => (
  <Edit {...props} actions={<EditActionList />}>
    <SimpleForm toolbar={<CreateToolbar />}>
      {/* <TextInput source="id" label="ID" /> */}
      <TextInput source="name" label="名前" validate={validateName} />
      <TextInput
        source="mail"
        label="メールアドレス"
        disabled
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
        choices={statusList}
        validate={validateStatus}
      />
      <SelectInput
        source="country"
        label="国籍"
        choices={countryList}
        validate={validateCountry}
      />
    </SimpleForm>
  </Edit>
);

export default TalentEdit;
