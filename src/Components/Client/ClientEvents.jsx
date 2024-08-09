import React, { useEffect, useState } from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
function ClientEvents() {
  const [events, setEvents] = useState([]);

    useEffect(() => {
        async function getEventsData() {
            try {
                const response = await axios.get("https://smarthrbackend-production.up.railway.app/events");
                const eventData = response.data.map(event => ({
                    title: event.eventName,
                    start: event.startsOnDate + 'T' + event.startsOnTime,
                    end: event.endsOnDate + 'T' + event.endsOnTime,
                }));
                setEvents(eventData);
            } catch (error) {
                console.log("Data fetching failed", error);
            }
        }
        
        getEventsData();
    }, []);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row mt-2">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            start: "today prev,next",
                                            center: "title",
                                            end: "dayGridMonth,dayGridWeek,dayGridDay",
                                        }}
                                        events={events}
                                        
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientEvents