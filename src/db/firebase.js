import firebase from "firebase";
import {
  FirebaseDataProvider,
  FirebaseAuthProvider,
} from "react-admin-firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDi0U5ii2wQP2mK0xl0XdFqCGQYstwQ5oY",
  authDomain: "itss2-32f90.firebaseapp.com",
  databaseURL:
    "https://itss2-32f90-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itss2-32f90",
  storageBucket: "itss2-32f90.appspot.com",
  messagingSenderId: "487624671126",
  appId: "1:487624671126:web:165ee0fd92941c318c27b7",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const options = {
  logging: true,
  // rootRef: 'rootrefcollection/QQG2McwjR2Bohi9OwQzP',
  app: firebaseApp,
  // watch: ['posts'];
  // dontwatch: ['comments'];
  persistence: "local",
  // disableMeta: true
  dontAddIdFieldToDoc: true,
  lazyLoading: {
    enabled: true,
  },
  firestoreCostsLogger: {
    enabled: true,
  },
};
export const authProvider = FirebaseAuthProvider(firebaseConfig, options);
export const dataProvider = FirebaseDataProvider(firebaseConfig, options);

//     {
//     // logging: false,
//     // rootRef: 'rootrefcollection/QQG2McwjR2Bohi9OwQzP',
//     app: firebaseApp,
//     // watch: ['posts'];
//     // dontwatch: ['comments'];
//     persistence: 'local',
//     // disableMeta: true
//     dontAddIdFieldToDoc: true,
//     lazyLoading: {
//         enabled: true,
//     },
//     firestoreCostsLogger: {
//         enabled: true,
//     },
// });
export default firebase;
