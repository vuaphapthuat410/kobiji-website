import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import {
  CreateButton,
  Datagrid,
  DateField,
  Loading,
  Pagination,
  ShowButton,
  TextField,
  useQuery,
  EditButton,
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
    {user.role === "クライアント" && (
      <div style={{ float: "right", marginBottom: "30px" }}>
        <Button variant="contained" color="secondary"　onClick={() => {
              window.alert("Write show talents added to wishlist feature here(just filter ) :))");
            }}>
          欲しいリスト
        </Button>
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
      filter: {},
    },
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR: {error}</p>;
  }

  let talents = [];
  if (currentUser.role === "クライアント") {
    talents = accounts.filter((account) => account.role === "タレント");
  } else {
    // manager
    talents = accounts.filter(
      (account) =>
        account.role === "タレント" &&
        account.createdby === auth.currentUser.email
    );
  }

  const searchedList = talents.filter((item) => {
    return item.name.match(new RegExp(searchInput, "gi"));
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
        {currentUser.role === "クライアント" ? (
          ""
        ) : (
          <DateField
            disabled
            showTime="false"
            source="createdate"
            label="作成日"
          />
        )}

        <ShowButton label="詳細" />
        {currentUser.role === "クライアント" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.alert("Write add to wishlist feature here :))");
            }}
          >
            ✙ 欲しいリスト
          </Button>
        ) : (
          <EditButton label="変更" />
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

export default TalentList;
