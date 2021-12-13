import firebase from "firebase";
import { required, minLength, maxLength, email } from "react-admin";

var dupList = [];
var db = firebase.firestore();
db.collection("accounts")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      dupList.push(doc.data().mail);
    });
  });

const dupValidation = (value, allValues) => {
  for (const dup of dupList) {
    if (dup !== undefined && value === dup) {
      return "Duplicate email";
    }
    // console.log(dup)
  }
  return undefined;
};

export const validateEmail = [required(), email(), dupValidation];
export const validateName = [required(), minLength(2), maxLength(64)];
export const validateRole = required();
export const validatePasswd = [required(), minLength(8), maxLength(20)];
export const validateTitle = [required(), minLength(2), maxLength(64)];
export const validateRequired = required();
export const validateBirthday = [required()];
export const validateGender = required();
export const validateStatus = required();
export const validateCountry = required();
