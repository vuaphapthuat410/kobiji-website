import keyBy from "lodash/keyBy";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
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
  useRefresh,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import firebase, { auth, storage } from "../../db/firebase";
import SearchInput from "../Layouts/SearchInput";
import { downloadCSV } from "../Layouts/export";
import BasicModal from "./BasicModal";
import axios from "../../axios";

const fakeData = {
  name: "Pranpriya Manobal",
  birthday: "27 /03/ 1997",
  address: "Buriram, Thailand",
  email: "lisa@gmail.com",
  phoneNumber: "+84000000000",
  introduction:
    "身長167cm、血液型は0型[。母語のタイ語以外に、練習生になってから習得した韓国語、英語、日本語、中国語を話すことができる。BLACKPINKの最年少メンバーで、メインダンサーとリードラッパーを担当している。中でもダンスの実力は、K-POP界の中でもトップクラスである。3",
};

function Ava({ record }) {
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
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  }));
  const classes = useStyles();
  return <Avatar src={record?.avatar} className={classes.large} />;
}

function AddToWishList({ record, client, isWishList, setIsWishList, refetch }) {
  let wishList = [];
  if (client != undefined && client.wishlist != undefined) {
    wishList = [...client.wishlist];
  }
  const isContain = wishList.includes(record.mail);
  if (isContain) {
    wishList = wishList.filter((item) => {
      if (item != record.mail) {
        return item;
      }
    });
  } else {
    wishList = [...wishList, record.mail];
  }

  let id = null;
  if (client != undefined) {
    id = client.id;
  }

  const [updateWishList, { loading, loaded }] = useMutation({
    type: "update",
    resource: "accounts",
    payload: { id: id, data: { wishlist: wishList } },
  });

  if (loaded) {
    // client.wishlist = wishList
    // setIsWishList(!isWishList)
    refetch();
  }

  return (
    <>
      {/* {<Button
      variant="contained"
      color="red"
      onClick={updateWishList}
      style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}
    >
      {(isContain && "	− 欲しいリスト") || (!isContain && "✙ 欲しいリスト")}
    </Button>} */}
      {!isContain && !(record.status === "売れた") && (
        <Button
          variant="contained"
          color="red"
          onClick={updateWishList}
          style={{
            background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
          }}
        >
          ✙ 欲しいリスト
        </Button>
      )}
      {isContain && !(record.status === "売れた") && (
        <Button
          variant="contained"
          color="red"
          onClick={updateWishList}
          style={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          }}
        >
          − 欲しいリスト
        </Button>
      )}
      {record.status === "売れた" && (
        <Button variant="contained" style={{ background: "#dddddd" }}>
          追加できない
        </Button>
      )}
    </>
  );
}
const ListActions = ({
  user,
  searchInput,
  data,
  setSearchInput,
  isWishList,
  setWishList,
  downloadCSV,
}) => (
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
      <div
        style={{ float: "right", marginBottom: "30px", display: "flex" }}
        className="action-bar"
      >
        <CreateButton
          // variant="contained"
          // color="red"
          // style={{
          //   background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
          // }}
          label="追加"
        />
        <Button
          // variant="contained"
          // color="red"
          style={{
            // background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            color: "#3f51b5",
            fontSize: "0.8125rem",
          }}
          label="エクスポート"
          onClick={() => {
            downloadCSV(data, "talent");
          }}
        >
          エクスポート
        </Button>
        {/* <OCR /> */}
        <ReactFirebaseFileUpload />
      </div>
    )}
    {user.role === "クライアント" && (
      <div style={{ float: "right", marginBottom: "30px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            // window.alert("Write show talents added to wishlist feature here(just filter ) :))");
            setWishList(!isWishList);
          }}
        >
          {(!isWishList && "欲しいリスト") || (isWishList && "タレントリスト")}{" "}
          {/*change button*/}
        </Button>
      </div>
    )}
  </div>
);

const ReactFirebaseFileUpload = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ocrData, setOcrData] = useState("");
  const reFresh = useRefresh();
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(image.name).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
    console.log(image.name);
    return image.name;
  };

  return (
    <div className="ocr-action">
      <div id="overlay" className={isOcrLoading ? "" : "d-none"}>
        <div class="circle-loading"></div>
      </div>
      <input
        type="file"
        onChange={handleChange}
        id="ocr_file"
        style={{ display: "none" }}
      />
      <label
        class="ocr_button"
        // variant="contained"
        // color="red"
        style={{
          // background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
          color: "#3f51b5",
        }}
        htmlFor="ocr_file"
      >
        履歴書アップロード
      </label>
      <Button
        // variant="contained"
        // color="red"
        style={{
          // background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
          color: "#3f51b5",
        }}
        // disabled={url ? true : false}
        onClick={async () => {
          try {
            setIsOcrLoading(true);
            const imageName = await handleUpload();
            setTimeout(async () => {
              try {
                const _data = await axios.get(
                  `https://ocr-cv-detect.herokuapp.com/ocr?files=${imageName}`
                );
                console.log("data nee", _data);
                setIsOcrLoading(false);

                setOcrData(_data.data.data);
                handleOpen();
              } catch (error) {
                console.log(error);
                setIsOcrLoading(false);
              }
            }, 3000);
            // setOcrData(fakeData);
            // handleOpen();
          } catch (error) {
            console.log(error);
            setIsOcrLoading(false);
          }
        }}
      >
        情報抽出
      </Button>
      <BasicModal
        data={ocrData}
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        url={url}
        reFresh={reFresh}
      />
    </div>
  );
};

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
    refetch,
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
      account.role === "クライアント" && account.mail === auth.currentUser.email
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
      if (
        client.wishlist != undefined &&
        client.wishlist.includes(item.mail) &&
        item.status !== "売れた"
      ) {
        return item;
      }
    } else {
      return item;
    }
  });
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
        data={searchedList}
        downloadCSV={downloadCSV}
      />
      <Datagrid
        data={keyBy(searchedList, "id")}
        ids={searchedList.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
        <TextField source="name" label="名前" />
        <Ava />
        <TextField source="mail" label="メールアドレス" />
        <TextField source="birthday" label="生年月日" />
        <TextField source="status" label="ステータス" />
        {/* <TextField source="country" label="国籍" /> */}
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
          <AddToWishList
            client={client}
            isWishList={isWishList}
            setIsWishList={setIsWishList}
            refetch={refetch}
          />
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
