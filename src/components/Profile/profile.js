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

const ProfileContext = createContext();

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
      <SimpleForm save={handleSave} record={identity ? identity : {}}>
        <TextInput source="fullName" validate={validateName} />
        <ImageInput source="avatar" validate={required()}>
          <ImageField />
        </ImageInput>
      </SimpleForm>
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
