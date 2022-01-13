import { Card, CardContent, CardHeader } from "@material-ui/core";
import moment from "moment";
import "moment/locale/ja";
import * as React from "react";
import { Loading, useDataProvider, useRedirect } from "react-admin";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useContext from "../../db/useContext";
import { auth } from "../../db/firebase";

const localizer = momentLocalizer(moment);
function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const dataProvider = useDataProvider();
  const [events, setEvents] = React.useState();
  const account_id = auth.currentUser?.email ?? "";
  const redirect = useRedirect();
  const [{ currentUser }, loading2] = useContext();

  React.useEffect(() => {
    dataProvider
      .getList("events", {
        pagination: { page: 1, perPage: 100 },
        filter: {},
      })
      .then(({ data }) => {
        if (currentUser.role === "タレント") {
          data = data.filter((event) =>
            event.members.some((member) => member === account_id)
          );
        } else if (currentUser.role === "管理") {
          data = data.filter((event) => event.createdby === account_id);
        } else if(currentUser.role === "クライアント") {
          data = data.filter((event) =>
            event.members.some((member) => member === account_id)
          );
        }
        // debugger;

        data = data.map((e) => {
          return {
            title: e.title,
            start: e.date,
            end: new Date(e.date.getTime() + 17 * 3600000),
            allDay: true,
            id: e.id,
          };
        });
        if (!loading2) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("errornee", error)
        // setLoading(false);
      });
  }, [dataProvider, account_id, currentUser, loading2]);

  if (loading) return <Loading />;

  return (
    <Card>
      <CardHeader title="マイスケジュール" />
      {/* <CardContent>kobiji</CardContent> */}
      <CardContent></CardContent>
      <Calendar
        culture="ja"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
          today: "今日",
          previous: "前",
          next: "次",
          month: "月",
          week: "週",
          day: "日",
          showMore: (total) => `${total}もっと見せる`,
          agenda: "アジェンダ",
        }}
        onSelectEvent={(e) => {
          redirect(`events/${e.id}/show`);
        }}
      />
    </Card>
  );
}
export default Dashboard;
