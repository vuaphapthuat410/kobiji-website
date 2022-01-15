import ChevronLeft from "@material-ui/icons/ChevronLeft";
import React, { useState } from "react";
import "./account.css";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EditButton,
  TopToolbar,
  ListButton,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

function Ava({ record }) {
  console.log(record);
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      float: "right",
    },
  }));
  const classes = useStyles();
  if (record.role !== "タレント")
    return (
      <div className="flex-container">
        <div className="left-profile">
          <div>
            <Avatar src={record?.avatar} className={classes.large} />
          </div>
        </div>
        <div className="right-profile">
          <p>
            <label>
              名前：<span>{record.name}</span>
            </label>
          </p>
          <p>
            <label>
              メールアドレス：<span>{record.mail}</span>
            </label>
          </p>
          <p>
            <label>
              役割: <span>{record.role}</span>
            </label>
          </p>
        </div>
      </div>
    );
  return (
    <div className="flex-container">
      <div className="left-profile">
        <div>
          <Avatar src={record?.avatar} className={classes.large} />
        </div>
      </div>
      <div className="right-profile">
        <p>
          <label>
            性別：<span>{record.gender}</span>
          </label>
        </p>
        <p>
          <label>
            ステータス：<span>{record.status}</span>
          </label>
        </p>
        <p>
          <label>
            電話番号：<span>{record.phone}</span>
          </label>
        </p>
        <p>
          <label>
            国籍：<span>{record.country}</span>
          </label>
        </p>
        <p>
          <label>
            管理者：<span>{record.createdby}</span>
          </label>
        </p>
        <p>
          <label>
            名前：<span>{record.name}</span>
          </label>
        </p>
        <p>
          <label>
            メールアドレス：<span>{record.mail}</span>
          </label>
        </p>
        <p>
          <label>
            生年月日：<span>{record.birthday}</span>
          </label>
        </p>

        <p>
          <label>
            自己紹介：<span>{record.self_introduction}</span>
          </label>{" "}
        </p>
      </div>
    </div>
  );
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
  const { record } = props;
  console.log(record, "hih");
  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント詳細</div>
      <Show {...props} actions={<ShowActionList />}>
        <Ava />
      </Show>
    </>
  );
};

export default AccountShow;
