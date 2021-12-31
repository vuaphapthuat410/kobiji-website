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
    useGetIdentity, useRedirect
  } from "react-admin";
  import {
    validatePasswd
  } from "../../utils/validate"
  import { auth } from "../../db/firebase";
  // import { getAuth, updatePassword } from "firebase/auth"
  export const PasswdChange = ({ staticContext, ...props }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [saving, setSaving] = useState();
    const redirect = useRedirect();
    const { loaded, identity } = useGetIdentity();
    const currentUser = auth.currentUser;
    const handleSave = useCallback(
      (values) => {
        setSaving(true);
        if (values.new_passwd !== values.re_passwd){
          setSaving(false);
            notify(
              "new password does not match",
              {
                _:
                  "new password does not match"
              }
            );
        } else if (values.old_passwd === values.re_passwd){
          setSaving(false);
            notify(
              "The new password is the same as the old password",
              {
                _:
                  "The new password is the same as the old password"
              }
            );
        } else {
          auth.signInWithEmailAndPassword(currentUser.email,values.old_passwd)
          .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            await currentUser.updatePassword(values.new_passwd).then(()=>{
              setSaving(false);
              notify("Your password has been changed", "info", {
                _: "Your password has been changed"
              });
             redirect(`/#/`);
            }).catch((error)=>{
              setSaving(false);
                  notify(
                    "A technical error occured while changing your password. Please try later.",
                    "warning",
                    {
                      _:
                        "A technical error occured while updating your password. Please try later."
                    }
                  );
            })
          })
          .catch((error) => {
            setSaving(false);
              notify(
                "old password incorrect",
                {
                  _:
                    "old password incorrect"
                }
              );
            })
        }
      
        // });
        // currentUser.updatePassword(values.new_passwd).then(()=>{
        //   console.log("object");
        //   setSaving(false);
        //   notify("Your password has been changed", "info", {
        //     _: "Your password has been changed"
        //   });
        // }).catch((error)=>{
        //   console.log("a");
        //   setSaving(false);
        //       notify(
        //         "A technical error occured while changing your password. Please try later.",
        //         "warning",
        //         {
        //           _:
        //             "A technical error occured while updating your password. Please try later."
        //         }
        //       );
        // })
        //   { data: values },
        //   {
        //     onSuccess: ({ data }) => {
        //       setSaving(false);
        //       notify("Your password has been changed", "info", {
        //         _: "Your password has been changed"
        //       });

        //     },
        //     onFailure: () => {
        //       setSaving(false);
        //       notify(
        //         "A technical error occured while changing your password. Please try later.",
        //         "warning",
        //         {
        //           _:
        //             "A technical error occured while updating your password. Please try later."
        //         }
        //       );
        //     }
        //   }
        // );
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
          <PasswordInput source="old_passwd" validate={validatePasswd} />
          <PasswordInput source="new_passwd" validate={validatePasswd} />
          <PasswordInput source="re_passwd" validate={validatePasswd} />
        </SimpleForm>
      </SaveContextProvider>
    );
  };
  