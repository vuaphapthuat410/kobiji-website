import * as React from "react";
import firebase, { auth } from "../../db/firebase";

var users = new Map();
users.set("admin@gmail.com", { name: "adminfake", role: "アドミンfake" });
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

const Info = () => {

  let account_id = auth.currentUser?.email ?? "";

  

  return (
    <>
      {users.get(account_id)?.name} - {users.get(account_id)?.role}
    </>
  );
};

export default Info;
