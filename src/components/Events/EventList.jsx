import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import {
  BooleanField,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  Loading,
  Pagination,
  ShowButton,
  TextField,
  useQuery
} from "react-admin";
import useContext from "../../db/useContext";
import { auth } from "../../db/firebase";
import NameField from "../Layouts/NameField";

const ListActions = (props) => {
  // console.log("useruse", props.user);
  return (
    <div>
      {( props.user.role === "管理") && (
        <CreateButton label="追加" />
      )}
    </div>
  );
};

const EventList = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  const {
    data: events,
    total,
    loading: eLoading,
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

  const [{  currentUser }, loading] = useContext();

  if (loading || eLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR: {error}</p>;
  }

  let filterdEvents = [];
  if (currentUser.role === "タレント") {
    filterdEvents = events.filter((event) =>
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
  return (
    events && (
      <>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント管理</div>
        <ListActions user={currentUser} />

        <Datagrid
          data={keyBy(filterdEvents, "id")}
          ids={filterdEvents.map(({ id }) => id)}
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
    )
  );
};

export default EventList;
