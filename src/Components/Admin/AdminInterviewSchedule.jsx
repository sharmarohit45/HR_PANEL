import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AdminAddInterviewForm from './AdminAddInterviewForm';
import { toast, ToastContainer } from 'react-toastify';
import UpdateInterviewForm from './UpdateInterviewForm';
import { Link } from 'react-router-dom';

const AdminInterviewSchedule = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [updateEventId, setUpdateEventId] = useState(null);

    async function getEventsData() {
        try {
            const response = await axios.get('https://smarthrbackend-production.up.railway.app/interview');
            const interviewData = response.data.map(interview => {
                const startTime = interview.startsOnTime || '00:00:00';
                const endTime = interview.endsOnTime || '23:59:59';

                return {
                    id: interview.interviewId,
                    title: interview.job,
                    start: `${interview.startDate}T${startTime}`,
                    end: interview.endsOnDate
                        ? `${interview.endsOnDate}T${endTime}`
                        : undefined,
                    extendedProps: {
                        interviewer: interview.interviewer || 'N/A',
                        interviewType: interview.interviewType || 'N/A',
                        candidate: interview.candidate || 'N/A',
                        round: interview.round || 'N/A',
                        startTime: interview.startTime || 'N/A',
                    }
                };
            });

            setEvents(interviewData);
        } catch (error) {
            console.error('Data fetching failed', error);
            alert('Failed to load interview data. Please try again.');
        }
    }

    useEffect(() => {
        getEventsData();
    }, []);

    const handleViewModal = (event) => {
        setSelectedEvent(event);
    };

    const handleUpdateClick = (event) => {
        setUpdateEventId(event.id);  // Set the selected event ID for update
    };

    const deleteData = async (interviewId) => {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/interview/${interviewId}`);
            toast.success("Data Deleted Successfully");
            await getEventsData();
        } catch (error) {
            console.error('Failed to delete interview', error);
            toast.error('Failed to delete interview. Please try again.');
        }
    };

    const renderEventContent = ({ event }) => (
        <div>
            <b>Role: {event.title}</b><br />
            <span>Interviewer: {event.extendedProps.interviewer}</span><br />
            <span>Type: {event.extendedProps.interviewType}</span>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="content container-fluid pb-0">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-head-box">
                            <h3>Interview Schedule</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Interview Schedule</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <button className='btn btn-white' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                            <i className='fa fa-plus'></i> Add Interview Schedule
                        </button>
                    </div>
                    <div className="col text-end">
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-white">
                                <Link to='/admin/interview-schedule'><i className="fa fa-calendar text-dark"></i></Link>
                            </button>
                            <button type="button" className="btn btn-white">
                                <Link to='/admin/interview-list'>
                                    <i className="fa fa-list text-dark"></i>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                    <div className="offcanvas-header">
                        <h2 id="offcanvasRightLabel" className='text-bold'><b>Add Interview Schedule</b></h2>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <AdminAddInterviewForm />
                    </div>
                </div>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="update" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                    <div className="offcanvas-header">
                        <h2 id="offcanvasRightLabel" className='text-bold'><b>Update Interview Schedule</b></h2>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <UpdateInterviewForm interviewId={updateEventId} />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="card">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    start: 'today prev,next',
                                    center: 'title',
                                    end: 'dayGridMonth,dayGridWeek,dayGridDay',
                                }}
                                events={events}
                                eventContent={renderEventContent}
                                contentHeight="auto"
                                windowResizeDelay={200}
                                eventClick={({ event }) => handleViewModal(event)}
                            />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="row p-2">
                                <div className="col">
                                    <h3>Interview Schedule Details</h3>
                                </div>
                                <hr />
                            </div>
                            <div className="row">
                                <div className="col">
                                    {events.map((event, index) => (
                                        <div key={index} className="card bg-light mb-2">
                                            <div className="card-header">
                                                <div className="row">
                                                    <div className="col">
                                                        <strong>Interview Details</strong>
                                                    </div>
                                                    <div className="col text-end">
                                                        <div className="dropdown">
                                                            <i className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleViewModal(event)}>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className='fa fa-eye'></i> &nbsp; View
                                                                    </a>
                                                                </li>
                                                                <li data-bs-toggle="offcanvas" data-bs-target="#update" aria-controls="offcanvasRight" onClick={() => handleUpdateClick(event)}>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className='fa fa-edit'></i> &nbsp; Reschedule
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#" onClick={() => deleteData(event.id)}>
                                                                        <i className='fa fa-trash'></i> &nbsp; Delete
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title" id="exampleModalLabel">
                                                                            <h3 className='pt-3'><strong>Job Role:</strong> {selectedEvent?.title}</h3>
                                                                        </h1>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        {selectedEvent && (
                                                                            <div className="row">
                                                                                <div className="col">
                                                                                    <div className="card-body text-start" style={{ fontSize: 'smaller' }}>
                                                                                        <div className="row">
                                                                                            <div className="col">
                                                                                                <p><strong>Date :</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
                                                                                                <p><strong>Candidate :</strong> {selectedEvent.extendedProps.candidate}</p>
                                                                                                <p><strong>Interview Round :</strong> {selectedEvent.extendedProps.round}</p>

                                                                                            </div>
                                                                                            <div className="col">
                                                                                                <p><strong>Interviewer :</strong> {selectedEvent.extendedProps.interviewer}</p>
                                                                                                <p><strong>Type :</strong> {selectedEvent.extendedProps.interviewType}</p>
                                                                                                <p><strong>Start Time :</strong> {selectedEvent.extendedProps.startTime}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-white" data-bs-dismiss="modal">Close</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body" style={{ fontSize: 'smaller' }}>
                                                <div className="row">
                                                    <div className="col">
                                                        <p><strong>Date:</strong> {new Date(event.start).toLocaleDateString()}</p>
                                                        <p><strong>Candidate:</strong> {event.extendedProps.candidate}</p>
                                                        <p><strong>Job Role:</strong> {event.title}</p>
                                                    </div>
                                                    <div className="col">
                                                        <p><strong>Type:</strong> {event.extendedProps.interviewType}</p>
                                                        <p><strong>Interviewer:</strong> {event.extendedProps.interviewer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminInterviewSchedule;
