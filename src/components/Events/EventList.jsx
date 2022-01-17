import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import {
  BooleanField,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  Loading,
  ShowButton,
  TextField,
  useQuery,
  ExportButton,
} from "react-admin";
import { auth } from "../../db/firebase";
import NameField from "../Layouts/NameField";
import { Pagination, TextInput } from "ra-ui-materialui";
import { makeStyles, Chip } from "@material-ui/core";
import SearchInput from "../Layouts/SearchInput";
const ListActions = ({ user, searchInput, setSearchInput }) => {
  return (
    <div
      style={{
        marginBottom: "1em",
      }}
    >
      <SearchInput
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
      />
      {user.role === "管理" && (
        <div style={{ float: "right", marginBottom: "30px" }}>
          <CreateButton label="追加" />
          <ExportButton label="エクスポート" />
        </div>
      )}
    </div>
  );
};


const EventList = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [searchInput, setSearchInput] = useState("");

  const {
    data: events,
    total,
    loading,
    error,
  } = useQuery({
    type: "getList",
    resource: "events",
    payload: {
      pagination: { page, perPage },
      sort,
      filter: {},
    },
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR: {error}</p>;
  }

  let filterdEvents = [];
  if (currentUser.role === "タレント" || currentUser.role === "クライアント") {
    filterdEvents = events.filter(
      (event) =>
        event.members.some((member) => member === auth.currentUser.email)
    );
  } else if (currentUser.role === "管理") {
    filterdEvents = events.filter(
      (event) => event.createdby === auth.currentUser.email
    );
  }
  // admin
  else {
    filterdEvents = [...events];
  }

  const searchedList = filterdEvents.filter((item) => {
    return (
      item.title.match(new RegExp(searchInput, "gi")) ||
      item.description.match(new RegExp(searchInput, "gi"))
    );
  });

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント管理</div>
      <ListActions
        user={currentUser}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <Datagrid
        data={keyBy(searchedList, "id")}
        ids={searchedList.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
        <TextField source="title" label="タイトル" />
        <TextField source="description" label="内容" />
        <BooleanField source="active" label="開催する" />
        <DateField
          disabled
          locales="ja-JP"
          options={{ dateStyle: "long" }}
          source="date"
          label="日時"
        />
        <NameField label="参加者" />
        <ShowButton label="詳細" />
        {/* <EditButton label="変更" />
        <DeleteButton label="削除" undoable={false}  /> */}

        {currentUser.role === "管理" && <EditButton label="変更" />}
        {currentUser.role === "管理" && (
          <DeleteButton undoable={false} label="削除" redirect={false} />
        )}
      </Datagrid>
      <Pagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
      />
    </>
  );
};

export default EventList;
