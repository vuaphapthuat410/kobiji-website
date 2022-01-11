import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import Button  from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
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
  ImageInput,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import firebase, { auth } from "../../db/firebase";
import SearchInput from "../Layouts/SearchInput";
import { downloadCSV } from "../Layouts/export";

import Tesseract from 'tesseract.js';

function Ava({record}){
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
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));
  const classes = useStyles();
  return(
    <Avatar src={record?.avatar} className={classes.small} />
  )
}

function AddToWishList({record, client, isWishList, setIsWishList, refetch}) {
  let wishList = []
  if (client != undefined && client.wishlist != undefined) {
    wishList = [...client.wishlist]
  }
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

  let id = null
  if (client != undefined) {
    id = client.id
  }

  const [updateWishList, { loading, loaded }] = useMutation({
    type: "update",
    resource: "accounts",
    payload: { id: id, data: { wishlist: wishList } },
  });

  if (loaded) {
    // client.wishlist = wishList
    // setIsWishList(!isWishList)
    refetch()
  }
  
  return(
    <>
    {/* {<Button
      variant="contained"
      color="red"
      onClick={updateWishList}
      style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}
    >
      {(isContain && "	− 欲しいリスト") || (!isContain && "✙ 欲しいリスト")}
    </Button>} */}
    {!isContain && !(record.status === "売れた") && <Button
      variant="contained"
      color="red"
      onClick={updateWishList}
      style={{background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'}}
    >
      ✙ 欲しいリスト
    </Button>}
    {isContain && !(record.status === "売れた") && <Button
      variant="contained"
      color="red"
      onClick={updateWishList}
      style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}
    >
      − 欲しいリスト
    </Button>}
    {record.status === "売れた" && <Button
      variant="contained"
      style={{background: '#dddddd'}}
    >
      追加できない
    </Button>}
    </>
  )
}
const ListActions = ({ user, searchInput,data, setSearchInput, isWishList, setWishList,downloadCSV }) => (
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
        <button label="エクスポート" 　onClick={()=>{downloadCSV(data,"talent")}}>エクスポート</button>
        <OCR />
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

function OCR() {
  const [imagePath, setImagePath] = useState("");
 
  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }
 
  const handleClick = () => {
    Tesseract.recognize(
      imagePath,
      'jpn',
      { logger: m => console.log(m) }
    )
    .catch (err => {
      console.error(err);
    })
    .then(({ data: { text } }) => {
      console.log(text);
    })
  }
 
  return (
    <>
      <input type="file" onChange={handleChange} display="invisible"/>
      <button onClick={handleClick} style={{height:25}}> convert to text</button>
    </>
  );
}

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
      if (client.wishlist != undefined && client.wishlist.includes(item.mail) && item.status !== "売れた") {
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
        data = {searchedList}
        downloadCSV={downloadCSV}
      />
      <Datagrid
        data={keyBy(searchedList, "id")}
        ids={searchedList.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
        <TextField source="name" label="名前" />
        <Ava/>
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
