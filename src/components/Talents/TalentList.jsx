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
  ExportButton,
  useMutation,
} from "react-admin";
import firebase, { auth } from "../../db/firebase";
import SearchInput from "../Layouts/SearchInput";

function AddToWishList({record, client, isWishList, setIsWishList, refetch}) {
  let wishList = [...client.wishlist]
  const isContain = wishList.includes(record.mail)
  if (isContain) {
    wishList = wishList.filter((item) => {
      if (item != record.mail) {
        return item
      }
    })
  } 
  else {
    wishList = [...wishList, record.mail]
  }

  const [updateWishList, { loading, loaded }] = useMutation({
    type: "update",
    resource: "accounts",
    payload: { id: client.id, data: { wishlist: wishList } },
  });

  if (loaded) {
    // client.wishlist = wishList
    // setIsWishList(!isWishList)
    refetch()
  }
  
  return(
    <Button
      variant="contained"
      color="primary"
      onClick={updateWishList}
    >
      {(isContain && "	− 欲しいリスト") || (!isContain && "✙ 欲しいリスト")}
    </Button>
  )
}

const ListActions = ({ user, searchInput, setSearchInput, isWishList, setWishList }) => (
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
    {user.role === "クライアント" && (
      <div style={{ float: "right", marginBottom: "30px" }}>
        <Button variant="contained" color="secondary"　onClick={() => {
              // window.alert("Write show talents added to wishlist feature here(just filter ) :))");
              setWishList(!isWishList)
            }}>
          {(!isWishList && "欲しいリスト") || (isWishList && "タレントリスト")} {/*change button*/}
        </Button>
      </div>
    )}
  </div>
);

const TalentList = (props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [searchInput, setSearchInput] = useState("");
  const [isWishList, setIsWishList] = useState(false);

  const {
    data: accounts,
    total,
    loading,
    error,
    refetch
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

  var client = accounts.find(
    (account) =>
      account.role === "クライアント" &&
      account.mail === auth.currentUser.email
  );
  

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
  
  const wishList = talents.filter((item) => {
    if (isWishList == true) {
      if (client.wishlist.includes(item.mail)) {
        return item
      }
    }
    else {
      return item
    }
  })

  const searchedList = wishList.filter((item) => {
    return item.name.match(new RegExp(searchInput, "gi"));
  });

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>タレント管理</div>
      <ListActions
        user={currentUser}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isWishList={isWishList}
        setWishList={setIsWishList}
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
          <AddToWishList client={client} isWishList={isWishList} setIsWishList={setIsWishList} refetch={refetch}/>
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
