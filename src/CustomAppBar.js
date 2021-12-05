import * as React from "react";
import { Fragment } from "react";
import { AppBar, useDataProvider, Loading, Error } from "react-admin";
import {
  Box,
  Badge,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { Notifications, CheckCircle } from "@material-ui/icons";

const NotificationList = ({ account_id }) => {
  const dataProvider = useDataProvider();
  const [notifs, setNotifs] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

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
        setError(error);
        setLoading(false);
      });
  }, [dataProvider, account_id]);

  if (loading) return <Loading />;
  if (error) return <Error />;
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
    function updateRead() {
      notif.members_read[account_id] = true;
      setNotifs(notifs);
      console.log(notif.members_read[account_id]);
    }
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
                  ""
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => updateRead() }
                  >
                    <CheckCircle fontsize="inherit" />
                  </IconButton>
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

function CustomAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleNotificationsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
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
        <NotificationList
          account_id={JSON.parse(localStorage.getItem("user")).email}
        />
      </List>
    </Menu>
  );

  return (
    <AppBar {...props} container={Fragment}>
      <Box sx={{ flexGrow: 1 }} />
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
    </AppBar>
  );
}

export default CustomAppBar;
