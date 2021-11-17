import firebase from 'firebase';
import {
    FirebaseDataProvider,
    FirebaseAuthProvider,
} from 'react-admin-firebase';
const firebaseConfig = {
    apiKey: "AIzaSyA0p_U3GRFQSPrZxNJiQAJtEXVGkWcXP-M",
    authDomain: "fir-itss.firebaseapp.com",
    databaseURL: "https://fir-itss-default-rtdb.firebaseio.com",
    projectId: "fir-itss",
    storageBucket: "fir-itss.appspot.com",
    messagingSenderId: "974351502349",
    appId: "1:974351502349:web:f07ae26811e77d4e4d1944"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const options = {
    app: firebaseApp,
    logging: true,
    watch: ['about'],
    dontwatch: ['resume'],
}
export const authProvider = FirebaseAuthProvider(firebaseConfig,options);
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