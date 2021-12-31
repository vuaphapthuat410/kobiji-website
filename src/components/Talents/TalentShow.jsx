import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  EditButton,
  ListButton,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar
} from "react-admin";

const ShowActionList = ({ basePath, data }) => {
  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="タレント一覧へ"
        icon={<ChevronLeft />}
      />
      <EditButton label="タレント更新" to="edit" />
    </TopToolbar>
  );
};

const TalentShow = (props) => {
  
  return (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント詳細</div>
    <Show {...props} title="タレント詳細" actions={<ShowActionList />}>
      <SimpleShowLayout>
        <TextField source="createdby" label="管理者：" />
        <TextField source="name" label="名前" />
        <TextField source="mail" label="メールアドレス" />
        <TextField source="birthday" label="生年月日" />
        <TextField source="gender" label="性別" />
        <TextField source="status" label="ステータス" />
        <TextField source="phone" label="電話番号" />
        <TextField source="country" label="国籍" />
        <TextField source="self-introduction" label="自己紹介" />
      </SimpleShowLayout>
    </Show>
  </>
  )
};

export default TalentShow;
