import * as React from "react";
import { auth } from "./firebase";
import firebase from "firebase";

var users = { name: "admin", role: "アドミン" } ; 
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users = {
        name: doc.data().name,
        role: doc.data().role,
      }
    });
  });
db.collection("talents")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      users = {
        name: doc.data().name,
        role: "タレント",
      }
    });
  });

const Info = () => {
    return (
        <>
            {users.name} - {users.role}
        </>
    )
}

export default Info