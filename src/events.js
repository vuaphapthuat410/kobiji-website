// in src/User.js
import * as React  from "react";
import { auth } from "./firebase"
// tslint:disable-next-line:no-var-requires
import {
    Datagrid,
    List,
    Show,
    Create,
    Edit,
    Filter,
    SimpleShowLayout,
    SimpleForm,
    TextField,
    TextInput,
    ShowButton,
    EditButton,
    DeleteButton,
    CreateButton,
    ExportButton,
    DateField,
    DateInput,
    SelectInput,
    ListButton,
    TopToolbar,
    Toolbar,
    SaveButton,
    useRedirect,
    email,
    required,
    minLength,
    maxLength,
    AutocompleteArrayInput,
    useDataProvider, 
    Loading, 
    Error,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import RichTextInput from 'ra-input-rich-text';
import { dataProvider } from "./firebase";
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ja';
import { Card, CardContent, CardHeader } from '@material-ui/core';

const users = [
    {id: 'giang@gmail.com', name :"giang@gmail.com"}, 
    {id: 'admin@gmail.com', name: "admin@gmail.com"},
    {id: 'xx@gmail.com', name: "xx@gmail.com"}
]

const EventFilter = (props) => (
    <Filter {...props}>
        <TextInput label="探索" source="name" alwaysOn />
    </Filter>
);

const localizer = momentLocalizer(moment)
const events = [
    {
        id: 0,
        title: "All Day Event very long title",
        allDay: true,
        start: new Date(2015, 3, 0),
        end: new Date(2015, 3, 1)
    },
    {
        id: 1,
        title: "Long Event",
        start: new Date(2015, 3, 7),
        end: new Date(2015, 3, 10)
    },

    {
        id: 2,
        title: "DTS STARTS",
        start: new Date(2016, 2, 13, 0, 0, 0),
        end: new Date(2016, 2, 20, 0, 0, 0)
    },

    {
        id: 3,
        title: "DTS ENDS",
        start: new Date(2016, 10, 6, 0, 0, 0),
        end: new Date(2016, 10, 13, 0, 0, 0)
    },

    {
        id: 4,
        title: "Some Event",
        start: new Date(2015, 3, 9, 0, 0, 0),
        end: new Date(2015, 3, 9, 0, 0, 0)
    },
    {
        id: 5,
        title: "Conference",
        start: new Date(2015, 3, 11),
        end: new Date(2015, 3, 13),
        desc: "Big conference for important people"
    },
    {
        id: 6,
        title: "Meeting",
        start: new Date(2015, 3, 12, 10, 30, 0, 0),
        end: new Date(2015, 3, 12, 12, 30, 0, 0),
        desc: "Pre-meeting meeting, to prepare for the meeting"
    },
    {
        id: 7,
        title: "Lunch",
        start: new Date(2015, 3, 12, 12, 0, 0, 0),
        end: new Date(2015, 3, 12, 13, 0, 0, 0),
        desc: "Power lunch"
    },
    {
        id: 8,
        title: "Meeting",
        start: new Date(2015, 3, 12, 14, 0, 0, 0),
        end: new Date(2015, 3, 12, 15, 0, 0, 0)
    },
    {
        id: 9,
        title: "Happy Hour",
        start: new Date(2015, 3, 12, 17, 0, 0, 0),
        end: new Date(2015, 3, 12, 17, 30, 0, 0),
        desc: "Most important meal of the day"
    },
    {
        id: 10,
        title: "Dinner",
        start: new Date(2015, 3, 12, 20, 0, 0, 0),
        end: new Date(2015, 3, 12, 21, 0, 0, 0)
    },
    {
        id: 11,
        title: "Birthday Party",
        start: new Date(2015, 3, 13, 7, 0, 0),
        end: new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        id: 12,
        title: "Late Night Event",
        start: new Date(2015, 3, 17, 19, 30, 0),
        end: new Date(2015, 3, 18, 2, 0, 0)
    },
    {
        id: 13,
        title: "Multi-day Event",
        start: new Date(2015, 3, 20, 19, 30, 0),
        end: new Date(2015, 3, 22, 2, 0, 0)
    },
    {
        id: 14,
        title: "Today",
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3))
    }
];

const choices = [
    { id: 'talent', name: 'タレント' },
    { id: 'manager', name: '管理者' },
];

export const EventList = (props) => (
    <Card>
        <CardHeader title="マイスケジュール" />
        <CardContent>kobiji</CardContent>
        <CreateButton label="追加" />
        <Calendar
            culture='ja'
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            defaultDate={new Date(2015, 3, 12)}
            messages={{
                'today': "今日",
                'previous': "前",
                'next': "次",
                'month': "月",
                'week': "週",
                'day': "日",
                "showMore": total => `${total}もっと見せる`,
                'agenda': "議題"
            }}
        />
    </Card>
);

const ListActions = (props) => (
    <div>
        <CreateButton label="追加" />
        <ExportButton label="エクスポート" />
    </div>
);

// export const EventList = (props) => (
//     <>
//         <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント管理</div>
//         <List
//             {...props}
//             filters={<EventFilter />}
//             actions={<ListActions />}
//             title="イベント管理"
//         >
//             <Datagrid>
//             <TextField source="title" label="イベント名前" />
//                 <TextField source="dated" label="時間" />
//                 <TextField source="description" label="ノート" />
//                 <TextField source="member_read" label="メンバー" />
//                 <ShowButton label="詳細" />
//                 <EditButton label="変更" />
//                 <DeleteButton label="削除" redirect={false} />
//             </Datagrid>
//         </List>
//     </>
// );

const ShowActionList = ({ basePath, data }) => {
    console.log("Data===>", data);
    return (
        <TopToolbar>
            <ListButton
                basePath={basePath}
                label="イベント一覧へ"
                icon={<ChevronLeft />}
            />
            <EditButton label="イベント更新" to="edit" />
        </TopToolbar>
    );
};

export const EventShow = (props) => (
    <>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>イベント詳細</div>
        <Show {...props} title="イベント詳細" actions={<ShowActionList />}>
            <SimpleShowLayout>
                <TextField source="title" label="イベント名前" />
                <TextField source="dated" label="時間" />
                <TextField source="description" label="ノート" />
                <TextField source="member_read" label="メンバー" />
            </SimpleShowLayout>
        </Show>
    </>
);

const CreateActionList = ({ basePath, data }) => (
    <TopToolbar>
        <ListButton
            basePath={basePath}
            label="タレント一覧へ"
            icon={<ChevronLeft />}
        />
    </TopToolbar>
);

const CreateToolbar = (props) => {

    const onSuccess = ({ data }) => {
        auth.createUserWithEmailAndPassword(data.mailAddress, 'hoanganh23')
    };
    return (
        <Toolbar {...props}>
            <SaveButton label="追加" redirect="show" submitOnEnter={true} />
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                style={{ marginLeft: "10px" }}
            >
                キャンセル
            </Button>
        </Toolbar>
    )
};

export const EventCreate = (props) => {
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    // useEffect(() => {
    //     dataProvider.getList('users', { pagination:{ page: 1, perPage: 100}, filter: {}})
    //         .then(({ data }) => {
    //             setUsers(data);
    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             setError(error);
    //             setLoading(false);
    //         })
            
    // },[]);   

    const redirect = useRedirect();
    const onSuccess = ({ data }) => {
        redirect(`/events/${data.id}/show`);
        auth.createUserWithEmailAndPassword(data.mailAddress, 'hoanganh23')
    };
    return (
        
        <Create {...props} actions={<CreateActionList />} onSuccess={onSuccess}>
            <SimpleForm toolbar={<CreateToolbar />}>
                <TextInput source="title" label="イベント名前" />
                <DateInput source="dated" label="生年月日" />
                <RichTextInput source="description" label="ノート" style={{ height: '40%' }} />
                <AutocompleteArrayInput source="member_read" label="メンバー" choices={users} />
            </SimpleForm>
        </Create>
    )
};

const EditActionList = ({ basePath, data }) => (
    <TopToolbar>
        <ListButton
            basePath={basePath}
            label="タレント一覧へ"
            icon={<ChevronLeft />}
        />
        <ShowButton label="タレント詳細へ" to="show"></ShowButton>
    </TopToolbar>
);

export const EventEdit = (props) => (
    <Edit {...props} actions={<EditActionList />}>
        <SimpleForm>
            <TextInput source="title" label="イベント名前" />
            <DateInput source="dated" label="生年月日" />
            <RichTextInput source="description" label="ノート" style={{ height: '40%' }} />
            <AutocompleteArrayInput source="member_read" label="メンバー" choices={users} />
        </SimpleForm>
    </Edit>
);
