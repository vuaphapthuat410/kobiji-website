import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import {
  CreateButton, 
  Datagrid, 
  DateField, 
  DeleteButton, 
  EditButton, 
  Loading, 
  Pagination, 
  ShowButton, 
  TextField, 
  useQuery, 
  useRefresh, 
  ExportButton,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
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
    <div style={{ float: "right", marginBottom: "30px" }}>
      <CreateButton label="追加" />
      <ExportButton label="エクスポート" />
    </div>
  </div>
);

const AccountList = (props) => {
  const reFresh = useRefresh();
  const onSuccess = async ({ data }) => {
    // ToDo: Delete user in firebase auth
    reFresh();
  };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [filter, setFilter] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const {
    data: accounts,
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

  const searchedList = accounts.filter((item) => {
    return item.name.match(new RegExp(searchInput, "gi"));
  });

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>アカウント管理</div>
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
        <TextField source="role" label="役割" />
        <DateField
          disabled
          showTime="false"
          source="createdate"
          label="作成日"
        />
        <ShowButton label="詳細" />
        <EditButton label="変更" />
        <DeleteButton label="削除" undoable={false} onSuccess={onSuccess} />
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

export default AccountList;
