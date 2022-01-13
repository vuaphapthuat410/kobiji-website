import * as React from "react";
import firebase, { auth } from "../../db/firebase";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

var users = new Map();
users.set("admin@gmail.com", { name: "adminfake", role: "アドミンfake" });
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users.set(doc.data().mail, {
        avatar: doc.data().avatar,
        name: doc.data().name,
        role: doc.data().role,
      });
    });
  });

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

const Info = () => {
  let account_id = auth.currentUser?.email ?? "";

  const classes = useStyles();

  console.log(users.get(account_id)?.avatar);


  return (
    //In case this is not accepted, follow this instead:
    //https://stackoverflow.com/questions/52655827/where-i-can-change-the-profile-picture-in-the-react-admin-header
    //Or this: https://github.com/marmelab/react-admin/blob/040a6f08758de5fec6bf90a4cc71727f0bd7cc60/docs/Theming.md#usermenu-customization
    <>
      {users.get(account_id)?.avatar ? (
        <Avatar src={users.get(account_id)?.avatar} className={classes.small} />
      ) : (
        ""
      )}
      {users.get(account_id)?.name} - {users.get(account_id)?.role}
    </>
  );
};

export default Info;
