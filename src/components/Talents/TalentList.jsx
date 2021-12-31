import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import {
  CreateButton,
  Datagrid,
  DateField, Loading,
  Pagination, ShowButton,
  TextField,
  useQuery
} from "react-admin";
import { auth } from "../../db/firebase";
import SearchInput from "../Layouts/SearchInput";

const ListActions = ({ user, searchInput, setSearchInput }) => (
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
      </div>
    )}
    {/* <ExportButton label="エクスポート" /> */}
  </div>
);

const TalentList = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [filter, setFilter] = useState(
    currentUser.role === "クライアント"
      ? {}
      : { createdby: auth.currentUser.email }
  );
  const [searchInput, setSearchInput] = useState("");

  const {
    data: talents,
    total,
    loading,
    error,
  } = useQuery({
    type: "getList",
    resource: "accounts",
    payload: {
      pagination: { page, perPage },
      sort,
      filter,
    },
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR: {error}</p>;
  }

  const searchedList = talents.filter((item) => {
    return (
      item.name.match(new RegExp(searchInput, "gi"))
    );
  });

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント管理</div>
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
        <TextField source="name" label="名前" />
        <TextField source="mail" label="メールアドレス" />
        <TextField source="birthday" label="生年月日" />
        <TextField source="status" label="ステータス" />
        <TextField source="country" label="国籍" />
        <DateField
          disabled
          showTime="false"
          source="createdate"
          label="作成日"
        />
        <ShowButton label="詳細" />
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

export default TalentList;
