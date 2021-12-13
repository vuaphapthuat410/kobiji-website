import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React from "react";
import {
  DateField,
  EditButton,
  ListButton,
  Loading,
  SelectField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar
} from "react-admin";
import useContext from "../../db/useContext";
import NameField from "../Layouts/NameField";

const ShowActionList = ({ basePath, data }) => {

  const [{ currentUser }, loading] = useContext();

  if (loading) return <Loading />;

  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="イベント一覧へ"
        icon={<ChevronLeft />}
      />
      {currentUser?.role === "管理" && (
        <EditButton label="イベント更新" to="edit" />
      )}
    </TopToolbar>
  );
};

const EventShow = (props) => (
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

export default EventShow;
