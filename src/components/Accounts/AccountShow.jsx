import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React,{useState} from "react";
import "./account.css"
import {
  Show,
  SimpleShowLayout,
  TextField,
  EditButton,
  TopToolbar,
  ListButton,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
function Ava({record}){
  console.log(record);
  return(
    <div className="flex-container">
    <div>
    <p><label>名前：<span>{record.name}</span></label></p>
    <p><label>メールアドレス：<span>{record.mail}</span></label></p>
    <p><label>役割<span>{record.role}</span></label></p>
    </div>
    </div>
  )
}

const ShowActionList = ({ basePath, data }) => {
  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        label="アカウント一覧へ"
        icon={<ChevronLeft />}
      />
      <EditButton label="アカウント更新" to="edit" />
    </TopToolbar>
  );
};
const AccountShow = (props) => {
  return(
  <>
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント詳細</div>
    <Show {...props} actions={<ShowActionList />}>
      <Ava />
    </Show>
  </>
)
};

export default AccountShow;
