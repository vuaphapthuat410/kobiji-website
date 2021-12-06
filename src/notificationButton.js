import * as React from "react";
import { useDataProvider, useMutation, Loading, } from "react-admin";
import { auth } from "./firebase";
import { Notifications, RemoveCircle, Check } from "@material-ui/icons";
import {
  Box,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";

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
        <RemoveCircle fontSize="inherit" color="primary"/>
      )}
    </IconButton>
  );

  // <Button label="Approve" onClick={approve} disabled={loading} />;
};

const NotificationList = () => {
  const dataProvider = useDataProvider();
  const [notifs, setNotifs] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const account_id = auth.currentUser.email;

  React.useEffect(() => {
    dataProvider
      .getList("events", {
        pagination: { page: 1, perPage: 100 },
        filter: {},
      })
      .then(({ data }) => {
        let newData = data.filter(
          (notif) =>
            notif.members_read !== undefined &&
            notif.members_read[account_id] !== undefined
        );
        setNotifs(newData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [dataProvider, account_id]);

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
                href={`/events/${notif.id}/show`}
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
                {notif.date.toDateString()} - イベントに招待されました。
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
