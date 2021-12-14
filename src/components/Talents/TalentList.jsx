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
  useQuery
} from "react-admin";
import { auth } from "../../db/firebase";

const ListActions = (props) => (
  <div>
    <div style={{ float: "right", marginBottom: "30px" }}>
      <CreateButton label="追加" />
    </div>
    {/* <ExportButton label="エクスポート" /> */}
  </div>
);

const TalentList = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });
  const {
    data: users,
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

  const talents = users.filter(
    (user) => user.createdby === auth.currentUser.email
  );

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント管理</div>
      <ListActions />
      <Datagrid
        data={keyBy(talents, "id")}
        ids={talents.map(({ id }) => id)}
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
        <EditButton label="変更" />
        <DeleteButton undoable={false} label="削除" />
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
