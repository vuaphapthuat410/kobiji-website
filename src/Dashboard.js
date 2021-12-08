import * as React from "react";
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { auth } from "./firebase";
import { useDataProvider, Loading } from "react-admin";
import moment from 'moment'
import 'moment/locale/ja'

const localizer = momentLocalizer(moment)
function Dashboard() {
  const dataProvider = useDataProvider();
  const [events, setEvents] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const account_id = auth.currentUser?.email ?? "";

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
        newData = newData.map(e => {
          return { title: e.title, start: e.date, end: new Date(e.date.getTime() + 17*3600000), allDay: true };
        });
        console.log(newData);
        setEvents(newData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [dataProvider, account_id]);
  if (loading) return <Loading />;
    return(
        <Card>
        <CardHeader title="マイスケジュール" />
        {/* <CardContent>kobiji</CardContent> */}
        <CardContent></CardContent>
        <Calendar
        culture = 'ja'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
            'today':"今日",
            'previous':"前",
            'next':"次",
            'month':"月",
            'week':"週",
            'day':"日",
            "showMore":total => `${total}もっと見せる`,
            'agenda':"議題"
        }}
      />
    </Card>
    )
}
export default Dashboard