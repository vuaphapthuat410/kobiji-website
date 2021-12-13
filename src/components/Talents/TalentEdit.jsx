import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  DateInput,
  Edit,
  ListButton,
  SelectInput,
  ShowButton,
  SimpleForm,
  TextInput,
  TopToolbar,
} from "react-admin";
import { countryList, genderList, statusList } from "../../utils/list";
import {
  validateBirthday,
  validateCountry,
  validateEmail,
  validateGender,
  validateName,
  validateStatus,
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
const TalentEdit = (props) => (
  <Edit {...props} actions={<EditActionList />}>
    <SimpleForm>
      {/* <TextInput source="id" label="ID" /> */}
      <TextInput source="name" label="名前" validate={validateName} />
      <TextInput
        source="mailAddress"
        label="メールアドレス"
        validate={validateEmail}
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