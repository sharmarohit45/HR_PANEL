import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ListIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeLeaveCalender = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const email = localStorage.getItem('email');

    const fetchData = async () => {
        try {
            const response = await axios.get('https://smarthrbackend-production.up.railway.app/leaves');
            const allLeaves = response.data;
            const filteredLeaves = allLeaves.filter(leave => leave.employee.email === email);
            const calendarEvents = filteredLeaves.map(leave => ({
                title: `${leave.employee.empName} - ${leave.leaveType}`,
                start: leave.leaveDate,
                end: leave.leaveDate,
                extendedProps: {
                    leaveType: leave.leaveType,
                    status: leave.status,
                    absenceReason: leave.absenceReason
                }
            }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching leaves data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [email]);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    {/* Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Leaves</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/employee">Dashboard</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Leaves</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-8">
                           
                        </div>
                        <div className="col-4 d-flex justify-content-end">
                            <div className="btn-group">
                                <Link to="/employee/leaves" className="btn btn-white" aria-current="page"><ListIcon /></Link>
                                <Link to="/employee/leaves-calendar" className="btn btn-dark text-white" aria-current="page"><CalendarTodayIcon /></Link>
                                <Link to="/employee/my-leaves" className="btn btn-white" aria-current="page"><PersonIcon /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-12">
                            <div className="card">
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
        </>
    );
};

export default EmployeeLeaveCalender;
