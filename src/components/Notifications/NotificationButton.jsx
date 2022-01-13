import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Badge,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Check, Notifications, RemoveCircle } from "@material-ui/icons";
import * as React from "react";
import { Loading, useMutation } from "react-admin";
import firebase, { auth } from "../../db/firebase";
import useContext from "../../db/useContext";

const ReadButton = ({ record, member, notifs, setNotifs }) => {
  let members_read = { ...record.members_read };
  members_read[member] = true;
  const updateFb = async() =>{
    const dataEvent = await firebase.firestore().collection("events").doc(record.id).get();
    firebase
      .firestore()
      .collection("events")
      .doc(record.id)
      .set({...dataEvent.data(), members_read: members_read})
  }
  return (
    <IconButton
      onClick={updateFb}
      disabled={record.members_read[member]}
      edge="end"
    >
      {(record.members_read[member]) ? <Check /> : <RemoveCircle color="primary" />}
    </IconButton>
  );

  // <Button label="Approve" onClick={approve} disabled={loading} />;
};

const NotificationList = (props) => {
  const account_id = auth.currentUser?.email ?? "";

  const [{ currentUser }, loading] = useContext();

  var unsubscribe = firebase
    .firestore()
    .collection("events")
    .onSnapshot(() => {});

  

  if (loading) return <Loading />;
  if (!props.notifs || !props.notifs[0])
    return (
      <>
        <ListItem style={{ whiteSpace: "normal" }}>
          <ListItemText primary={"通知がありません"} />
        </ListItem>
        <Divider />
      </>
    );

  let notifList = props.notifs
    .sort((a, b) => {
      return a.members_read[account_id]
        ? b.members_read[account_id]
          ? 0
          : 1
        : b.members_read[account_id]
        ? -1
        : 0;
    })
    .map((notif) => {
      let read = notif.members_read[account_id];
      return (
        <>
          <ListItem
            style={{ whiteSpace: "normal" }}
            button
            component="a"
            href={`/#/events/${notif.id}/show`}
          >
            <ListItemText
              primary={
                <div
                  style={{
                    fontWeight: read ? "normal" : "bold",
                  }}
                >
                  {notif.title}
                </div>
              }
              primaryTypographyProps={{ variant: "h6", noWrap: true }}
              secondary={
                <div
                  style={{
                    fontWeight: read ? "normal" : "bold",
                  }}
                >
                  {new Date(notif.date.seconds * 1000).toDateString()} -
                  イベントに招待されました。
                </div>
              }
            />
            <ListItemSecondaryAction>
              <ReadButton
                record={notif}
                member={account_id}
                notifs={props.notifs}
                setNotifs={props.setNotifs}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </>
      );
    });

  return <>{notifList}</>;
};

function NotificationButton(props) {
  const account_id = auth.currentUser?.email ?? "";
  const [notifs, setNotifs] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "menu";
  const [{ currentUser }, loading] = useContext();
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("events")
      .onSnapshot((querySnapshot) => {
        var events = [];
        querySnapshot.forEach((doc) => {
          events.push({ ...doc.data(), id: doc.id });
        });

        if (currentUser) {
          if (currentUser.role === "タレント") {
            events = events.filter((event) =>
              event.members.some((member) => member === account_id)
            );
          } else if (currentUser.role === "管理") {
            events = events.filter((event) => event.createdby === account_id);
          }
          setNotifs(events);
        }
        console.log("Currentevents: ", events);
      });
  },[currentUser]);
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
        <NotificationList notifs={notifs} setNotifs={setNotifs} />
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
          <Badge
            badgeContent={
              notifs?.filter(
                (notif) => notif.members_read[account_id] !== true
              ).length
            }
            color="error"
            max={9}
          >
            <Notifications />
          </Badge>
        </IconButton>
      </Box>
      {renderMenu}
    </>
  );
}

export default NotificationButton;
