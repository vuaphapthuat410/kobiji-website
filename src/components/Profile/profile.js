import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  TextInput,
  ImageInput,
  ImageField,
  SimpleForm,
  required,
  useDataProvider,
  useNotify,
  SaveContextProvider,
  useGetIdentity,
} from "react-admin";
import { validateName } from "../../utils/validate";
import firebase, { auth } from "../../db/firebase";
import { Button, Popover } from "@material-ui/core";


var users = new Map();
// users.set("admin@gmail.com", { name: "adminfake", role: "アドミンfake" });
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


const ProfileContext = createContext();

console.log(users);

export const ProfileProvider = ({ children }) => {
  const [profileVersion, setProfileVersion] = useState(0);
  const context = useMemo(
    () => ({
      profileVersion,
      refreshProfile: () =>
        setProfileVersion((currentVersion) => currentVersion + 1),
    }),
    [profileVersion]
  );

  return (
    <ProfileContext.Provider value={context}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export const ProfileEdit = ({ staticContext, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  let account_id = auth.currentUser?.email ?? "";
  console.log("ProfileEdit");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [saving, setSaving] = useState();
  const { refreshProfile } = useProfile();

  const { loaded, identity } = useGetIdentity();

  const handleSave = useCallback(
    async (values) => {
      setSaving(true);

      const avatar = await (values.avatar.rawFile instanceof File
        ? convertFileToBase64(values.avatar)
        : values.avatar);
      firebase
        .firestore()
        .collection("accounts")
        .where("mail", "==", auth.currentUser.email)
        .get()
        .then(async (snapshot) => {
          await firebase
            .firestore()
            .collection("accounts")
            .doc(snapshot.docs.at(0).id)
            .update({
              name: values.fullName,
              avatar: avatar,
            });
          window.location.reload();
        });

      dataProvider.updateUserProfile(
        { data: values },
        {
          onSuccess: ({ data }) => {
            setSaving(false);
            notify("Your profile has been updated", "info", {
              _: "Your profile has been updated",
            });
            refreshProfile();
          },
          onFailure: () => {
            setSaving(false);
            notify(
              "A technical error occured while updating your profile. Please try later.",
              "warning",
              {
                _: "A technical error occured while updating your profile. Please try later.",
              }
            );
          },
        }
      );
    },
    [dataProvider, notify, refreshProfile]
  );

  const saveContext = useMemo(
    () => ({
      save: handleSave,
      saving,
    }),
    [saving, handleSave]
  );

  if (!loaded) {
    return null;
  }

  

  return (
    <SaveContextProvider value={saveContext}>
      <h1>プロフィール</h1>
      <div style={{ marginLeft: '50px' }}>
        <h2>名前</h2>
        <p>{users.get(account_id)?.name}</p>
        <h2>アバター</h2>
        {users.get(account_id)?.avatar ? (
          <img src={users.get(account_id)?.avatar} style={{ height: '200px', width: '200px' }} />
        ) : (
          <img style={{ height: '200px', width: '200px' }} />
        )}
      </div>
      <Button variant="contained" aria-describedby={id} onClick={handleClick} style={{width:'300px'}}>
        編集
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <div style={{width: '800px', height: '450px', marginBottom: '100px'}}>
          <h1　style={{textAlign: 'center'}}>編集プロフィール</h1>
          <SimpleForm save={handleSave} record={identity ? identity : {}}>
            <TextInput source="fullName" initialValue="" validate={validateName} />
            <ImageInput source="avatar" validate={required()}>
              <ImageField />
            </ImageInput>
          </SimpleForm>
        </div>
        
      </Popover>


    </SaveContextProvider>
  );
};

const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file.rawFile);
  });
