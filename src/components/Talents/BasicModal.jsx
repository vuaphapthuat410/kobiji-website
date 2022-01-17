import * as React from "react";
// import Box from "@mui/material/Box";
// import Typography from "@material-ui/Typography";
import Button from "@material-ui/core/Button";

import {
  Modal,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import {
  validateBirthday,
  validateCountry,
  validateEmail,
  validateGender,
  validateName,
  validatePasswd,
  validateStatus,
} from "../../utils/validate";
import { countryList, genderList, statusList } from "../../utils/list";
import {
  DateInput,
  PasswordInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "ra-ui-materialui";

import { useMutation } from "react-admin";
import { auth } from "../../db/firebase";
import { firestore } from "firebase";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  data,
  open,
  handleOpen,
  handleClose,
  url,
  reFresh,
}) {
  const { name, birthday, address, email, phoneNumber, introduction } = data;
  // const [gender, setGender] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [createTalent, { loading, loaded }] = useMutation({
    type: "create",
    resource: "accounts",
    payload: {
      data: {
        name,
        birthday: birthday,
        address,
        mail: email,
        phoneNumber,
        self_introduction: introduction,
        createdate: firestore.Timestamp.fromDate(new Date()),
        lastupdate: firestore.Timestamp.fromDate(new Date()),
        createdby: auth.currentUser.email,
        gender: "女",
        password,
        role: "タレント",
        status: "商売可能",
        updatedby: auth.currentUser.email,
        cv_url: url,
      },
    },
  });

  return (
    data && (
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div class="ocr-form">
              <div className="left-form">
                <TextField
                  label="名前"
                  validate={validateName}
                  defaultValue={data?.name}
                />
                <TextField
                  label="生年月日"
                  validate={validateBirthday}
                  defaultValue={data?.birthday}
                />

                <TextField
                  label="住所"
                  validate={validateEmail}
                  defaultValue={data?.address}
                />

                <TextField
                  label="メールアドレス"
                  validate={validateEmail}
                  defaultValue={data?.email}
                />
                <TextField
                  label="自己紹介"
                  // validate={validateEmail}
                  defaultValue={data?.introduction}
                />

                <InputLabel id="demo-simple-select-label">性別</InputLabel>
                {/* <Select
                  label="性別"
                  id="demo-simple-select"
                  // choices={genderList}
                  // validate={validateGender}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  {genderList.map((choice) => (
                    <MenuItem value={choice.id}>{choice.name}</MenuItem>
                  ))}
                </Select> */}

                <TextField
                  label="パスワード"
                  validate={validatePasswd}
                  value={password}
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                {/* <SelectInput
              label="性別"
              choices={genderList}
              validate={validateGender}
            /> */}
              </div>
              <div className="right-form">
                <div>
                  <img src={url} alt="Cv" />
                </div>
              </div>
            </div>

            <Button
              variant="contained"
              color="red"
              style={{
                background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
              }}
              onClick={async () => {
                const payload = {
                  data: {
                    name,
                    birthday: birthday,
                    address,
                    mail: email,
                    phoneNumber,
                    self_introduction: introduction,
                    createdate: firestore.Timestamp.fromDate(new Date()),
                    lastupdate: firestore.Timestamp.fromDate(new Date()),
                    createdby: auth.currentUser.email,
                    gender: "女",
                    password,
                    role: "タレント",
                    status: "商売可能",
                    updatedby: auth.currentUser.email,
                    cv_url: url,
                  },
                };
                console.log("create payload", payload);
                await createTalent();
                reFresh();
              }}
            >
              ✙ 追加
            </Button>
          </Box>
        </Modal>
      </div>
    )
  );
}
