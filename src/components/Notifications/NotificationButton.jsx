import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu
} from "@material-ui/core";
import { Check, Notifications, RemoveCircle } from "@material-ui/icons";
import * as React from "react";
import { Loading, useMutation } from "react-admin";
import firebase, { auth } from "../../db/firebase";
import useContext from "../../db/useContext";

const ReadButton = ({ record, member, notifs, setNotifs }) => {
  let members_read = { ...record.members_read };
  members_read[member] = true;
  const [updateRead, { loading, loaded }] = useMutation({
    type: "update",
    resource: "events",
    payload: { id: record.id, data: { members_read: members_read } },
  });
  if (loaded) {
    record.members_read[member] = true;
    setNotifs(notifs);
  }
  return (
    <IconButton size="small" onClick={updateRead} disabled={loading || loaded}>
      {loaded ? (
        <Check fontSize="inherit" />
      ) : (
        <RemoveCircle fontSize="inherit" color="primary" />
      )}
    </IconButton>
  );

  // <Button label="Approve" onClick={approve} disabled={loading} />;
};

const NotificationList = () => {
  const [notifs, setNotifs] = React.useState(null);
  const account_id = auth.currentUser?.email ?? "";

  const [{ currentUser }, loading] = useContext();


  var unsubscribe = firebase
    .firestore()
    .collection("events")
    .onSnapshot(() => {});

  React.useEffect(() => {
    firebase
      .firestore()
      .collection("events")
      .onSnapshot((querySnapshot) => {
        var events = [];
        querySnapshot.forEach((doc) => {
          events.push({...doc.data(), id: doc.id});
        });

        if (currentUser) {
          if (currentUser.role === "タレント") {
            events = events.filter((event) =>
              event.members.some((member) => member === account_id)
            );
          } else if (currentUser.role === "管理") {
            events = events.filter((event) => event.createdby === account_id);
          }
        }

        setNotifs(events);
        // console.log("Currentevents: ", events);
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  if (loading) return <Loading />;
  if (!notifs || !notifs[0])
    return (
      <>
        <ListItem style={{ whiteSpace: "normal" }}>
          <ListItemText primary={"通知がありません"} />
        </ListItem>
        <Divider />
      </>
    );

  let notifList = notifs.map((notif) => {
    let read = notif.members_read[account_id];
    return (
      <>
        <ListItem style={{ whiteSpace: "normal" }}>
          <ListItemText
            primary={
              <a
                style={{
                  fontWeight: read ? "normal" : "bold",
                }}
                href={`/#/events/${notif.id}/show`}
              >
                {notif.title}
              </a>
            }
            primaryTypographyProps={{ variant: "h6", noWrap: true }}
            secondary={
              <div
                style={{
                  fontWeight: read ? "normal" : "bold",
                }}
              >
                {new Date(notif.date.seconds).toDateString()} - イベントに招待されました。
                {read ? (
                  <Check fontSize="inherit" />
                ) : (
                  <ReadButton
                    record={notif}
                    member={account_id}
                    notifs={notifs}
                    setNotifs={setNotifs}
                  />
                )}
              </div>
            }
          />
        </ListItem>
        <Divider />
      </>
    );
  });

  return <>{notifList}</>;
};

function NotificationButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "menu";

  const handleNotificationsOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      sx={{ maxWidth: 180 }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleNotificationClose}
    >
      <List>
        <Divider />
        <NotificationList />
      </List>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          aria-haspopup="true"
          onClick={handleNotificationsOpen}
        >
          <Notifications />
        </IconButton>
      </Box>
      {renderMenu}
    </>
  );
}

export default NotificationButton;
