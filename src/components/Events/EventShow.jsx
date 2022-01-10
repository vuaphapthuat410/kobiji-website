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

function DetailInfo({ record }) {
  console.log(record);
  return (
    <div className="flex-container">
      <div>
        <p><label>タイトル：<span>{record.title}</span></label></p>
        <p><label>内容：<span>{record.description}</span></label></p>
        {
          record.active
            ? <p><label>開催する：<span>開催する</span></label></p>
            : <p><label>開催する：<span>開催しない</span></label></p>
        }
        <p>
          <label>日時：
            <span> 
              <DateField
                disabled
                locales="ja-JP"
                options={{ dateStyle: "long" }}
                source="date"
                label="日時"
              />
            </span>
          </label>
        </p>
        <p>
          <label>参加者：
            <span>
              <NameField label="参加者" />
            </span>
          </label>
        </p>
      </div>
    </div>
  )
}

const EventShow = (props) => (
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント詳細</div>
    <Show {...props} title="イベント詳細" actions={<ShowActionList />}>
      <DetailInfo />
    </Show>
  </>
);

export default EventShow;
