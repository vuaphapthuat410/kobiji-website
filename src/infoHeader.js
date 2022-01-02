import * as React from "react";
import { auth } from "./firebase";
import firebase from "firebase";

var users = new Map();
users.set("admin@gmail.com", { name: "admin", role: "アドミン" });
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users.set(doc.data().mail, {
        name: doc.data().name,
        role: doc.data().role,
      });
    });
  });
db.collection("talents")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users.set(doc.data().mailAddress, {
        name: doc.data().name,
        role: "タレント",
      });
    });
  });

const Info = () => {
  let account_id = auth.currentUser?.email ?? "";
  return (
      <>
          {users.get(account_id)?.name} - {users.get(account_id)?.role}
      </>
  )
}

export default Info