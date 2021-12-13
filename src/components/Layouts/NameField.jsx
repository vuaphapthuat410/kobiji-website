import { Chip } from "@material-ui/core";
import React from "react";
import { Loading, useRecordContext } from "react-admin";
import useContext from "../../db/useContext";


const NameField = (props) => {
  const [{ users }, loading] = useContext();

  const record = useRecordContext(props);
  if (loading) return <></>;
  return (
    <>
      {record.members_read &&
        Object.keys(record.members_read).map((key) => (
          <Chip
            size="small"
            variant="outlined"
            label={users?.find((user) => user.mail === key)?.name}
          />
        ))}
    </>
  );
};

export default NameField;
