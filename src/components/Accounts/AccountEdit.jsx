import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React, { useEffect, useState } from "react";
import {
  DateInput, Edit, ListButton, SaveButton, SelectInput, SimpleForm,
  TextInput, Toolbar, TopToolbar, useEditController
} from "react-admin";
import {
  countryList,
  genderList,
  roleList,
  statusList
} from "../../utils/list";
import {
  validateBirthday,
  validateCountry, validateGender,
  validateName,
  validateRole,
  validateStatus
} from "../../utils/validate";


const EditActionList = ({ basePath, data }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      label="アカウント一覧へ"
      icon={<ChevronLeft />}
    />
    {/* <ShowButton label="アカウント詳細へ" to="show"></ShowButton> */}
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

const AccountEdit = (props) => {
  const [selectedRole, setSeletedRole] = useState(null);
  const controllerProps = useEditController(props);
  const { record } = controllerProps;
  console.log(record);

  useEffect(() => {
    setSeletedRole(record.role);
  }, []);
  return (
    <Edit {...props} actions={<EditActionList />}>
      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput source="name" label="名前" validate={validateName} />
        <TextInput source="mail" label="メールアドレス" disabled />
        <SelectInput
          source="role"
          label="役割"
          choices={roleList}
          validate={validateRole}
          onChange={(e) => {
            setSeletedRole(e.target.value);
          }}
        />
        {selectedRole === "タレント" && (
          <DateInput
            source="birthday"
            label="生年月日"
            validate={validateBirthday}
          />
        )}
        {selectedRole === "タレント" && (
          <SelectInput
            source="gender"
            label="性別"
            choices={genderList}
            validate={validateGender}
          />
        )}
        {selectedRole === "タレント" && (
          <SelectInput
            source="status"
            label="ステータス"
            choices={statusList}
            validate={validateStatus}
          />
        )}
        {selectedRole === "タレント" && (
          <SelectInput
            source="country"
            label="国籍"
            choices={countryList}
            validate={validateCountry}
          />
        )}
      </SimpleForm>
    </Edit>
  );
};

export default AccountEdit;
