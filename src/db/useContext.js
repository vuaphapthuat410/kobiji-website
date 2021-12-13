import { useEffect, useState } from "react";
import { auth, dataProvider } from "./firebase";

export default function useContext() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        let _currentUser = {};
        await dataProvider
          .getList("accounts", {
            pagination: { page: 1, perPage: 1000 },
            filter: {},
          })
          .then(({ data }) => {
            const index = data.findIndex((value) => value.mail === user.email);
            _currentUser = { ...data[index], ...user };
            // console.log("_currentuserne", _currentUser, data);

            setCurrentUser(_currentUser);
            setUsers(data);
            // console.log("setloading false");
            setLoading(false);
          });
      }
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const data = { users, currentUser };
  return [data, loading];
}
