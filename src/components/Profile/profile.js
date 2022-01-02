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
import { validateName, validateEmail } from "../../utils/validate";

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
  const dataProvider = useDataProvider();
  console.log("ProfileEdit", dataProvider);
  const notify = useNotify();
  const [saving, setSaving] = useState();
  const { refreshProfile } = useProfile();

  const { loaded, identity } = useGetIdentity();

  const handleSave = useCallback(
    (values) => {
      setSaving(true);
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
        <TextInput source="addressMail" validate={validateEmail} />
        <ImageInput source="avatar" validate={required()}>
          <ImageField />
        </ImageInput>
      </SimpleForm>
    </SaveContextProvider>
  );
};
