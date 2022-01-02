import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@material-ui/core";

import firebase from "firebase";

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    console.log("sending email to: ", email);
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setOpen(false);
      setToastOpen(true);
      // setToastMessage("Password reset email sent!");
      setToastMessage("パスワードリセットメールが送信されました!");
    } catch (error) {
      setToastOpen(true);
      setToastMessage(error.message);
    }
  };

  const handleOnChange = (event) => {
    const email = event.target.value;
    setEmail(email);
  };

  const handleToastClose = () => {
    setToastOpen(false);
    setToastOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Forgot Password?
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">パスワードリセットメールを送信しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          パスワードリセットメールは、次の電子メールに送信されます：
          </DialogContentText>
          <TextField
            id="outlined-basic"
            label="Email"
            type="email"
            variant="outlined"
            style={{width: '100%'}}
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
          メールを送る
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        onClose={handleToastClose}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        message={toastMessage}
      ></Snackbar>
    </div>
  );
}
