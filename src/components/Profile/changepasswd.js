import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useContext
  } from "react";
  import {
    PasswordInput,
    SimpleForm,
    required,
    useDataProvider,
    useNotify,
    SaveContextProvider,
    useGetIdentity
  } from "react-admin";
  import {
    validatePasswd
  } from "../../utils/validate"
  
  export const PasswdChange = ({ staticContext, ...props }) => {
    console.log("Password change");
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [saving, setSaving] = useState();

    const { loaded, identity } = useGetIdentity();
  
    const handleSave = useCallback(
      (values) => {
        setSaving(true);
        dataProvider.updatePasswd(
          { data: values },
          {
            onSuccess: ({ data }) => {
              setSaving(false);
              notify("Your password has been changed", "info", {
                _: "Your password has been changed"
              });
            },
            onFailure: () => {
              setSaving(false);
              notify(
                "A technical error occured while changing your password. Please try later.",
                "warning",
                {
                  _:
                    "A technical error occured while updating your password. Please try later."
                }
              );
            }
          }
        );
      },
      [dataProvider, notify]
    );
  
    const saveContext = useMemo(
      () => ({
        save: handleSave,
        saving
      }),
      [saving, handleSave]
    );
  
    if (!loaded) {
      return null;
    }
  
    return (
      <SaveContextProvider value={saveContext}>
        <SimpleForm save={handleSave} record={identity ? identity : {}}>
          <PasswordInput source="old-passwd" validate={validatePasswd} />
          <PasswordInput source="new-passwd" validate={validatePasswd} />
          <PasswordInput source="re-passwd" validate={validatePasswd} />
        </SimpleForm>
      </SaveContextProvider>
    );
  };
  