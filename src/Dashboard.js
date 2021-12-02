import * as React from "react";
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import 'moment/locale/ja'

const localizer = momentLocalizer(moment)
const events = [
    {
      id: 0,
      title: 'Meeting',
      start: moment({ hours: 8 }).toDate(),
      end: moment({ hours: 10 }).toDate(),
    },
    {
      id: 1,
      title: 'Lunch',
      start: moment({ hours: 12 }).toDate(),
      end: moment({ hours: 13 }).toDate()
    },
    {
      id: 2,
      title: 'Coding',
      start: moment({ hours: 14 }).toDate(),
      end: moment({ hours: 17 }).toDate(),
    },
  ];
function Dashboard(){
    return(
        <Card>
        <CardHeader title="マイスケジュール" />
        <CardContent>kobiji</CardContent>
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