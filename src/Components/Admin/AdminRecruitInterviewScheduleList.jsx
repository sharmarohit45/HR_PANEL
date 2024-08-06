import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import AdminAddInterviewForm from './AdminAddInterviewForm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import UpdateInterviewForm from './UpdateInterviewForm';

const AdminRecruitInterviewScheduleList = () => {
    const [data, setData] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const handleView = (interview) => {
        setSelectedInterview(interview);
    };

    const handleUpdate = (interview) => {
        setSelectedInterview(interview);
    };

    async function getdata() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/interview");
            setData(response.data);
        } catch (error) {
            console.log("data fetching failed", error);
        }
    }

    async function deleteData(id) {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/interview/${id}`);
            toast.success("Data Deleted Successfully");
            getdata();
        } catch (error) {
            console.log("data deletion failed", error);
            toast.error("Failed to delete data");
        }
    }

    useEffect(() => {
        getdata();
    }, []);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row mt-3 mb-3">
                        <div className="col">
                            <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" className="btn btn-white">
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
                    <div className="row">
                        <div className="col">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    pageSizeOptions={[5, 10, { value: 100, label: '100' }]}
                                    columns={[
                                        { field: 'candidate', headerName: 'Candidate', hideable: false, width: 180 },
                                        { field: 'interviewer', headerName: 'Interviewer', hideable: false, width: 180 },
                                        {
                                            field: 'scheduledDateTime', headerName: 'Scheduled Date and Time', hideable: false, width: 240, renderCell: (params) =>
                                            (
                                                <>
                                                    {params.row.scheduledDateTime}  &nbsp; {params.row.startTime}
                                                </>

                                            )
                                        },
                                        { field: 'interviewRound', headerName: 'Interview Round', hideable: false, width: 180 },
                                        {
                                            field: 'status', headerName: 'Status', hideable: false, width: 180, renderCell: (params) => (
                                                <strong className='bg-success text-dark p-2'>{params.row.status}</strong>
                                            )
                                        },
                                        {
                                            field: 'action',
                                            headerName: 'Action',
                                            width: 100,
                                            renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li onClick={() => handleView(params.row)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                            <a className="dropdown-item"><i className="fa fa-eye"></i> View</a>
                                                        </li>
                                                        <li onClick={() => handleUpdate(params.row)} data-bs-toggle="offcanvas" data-bs-target="#update" aria-controls="offcanvasRight">
                                                            <a className="dropdown-item"><i className="fa fa-pen"></i> Edit</a>
                                                        </li>
                                                        <li onClick={() => deleteData(params.row.id)}>
                                                            <a className="dropdown-item" href="#"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ),
                                        },
                                    ]}
                                    rows={data.map(row => ({
                                        id: row.interviewId,
                                        candidate: row.candidate,
                                        job: row.job,
                                        interviewer: row.interviewer,
                                        scheduledDateTime: row.startDate,
                                        startTime: row.startTime,
                                        interviewRound: row.round,
                                        interviewType: row.interviewType,
                                        status: row.status,
                                        imageData: row.imageData,
                                    }))}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="update" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                    <div className="offcanvas-header">
                        <h2 id="offcanvasRightLabel" className='text-bold'><b>Update Interview Schedule</b></h2>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <UpdateInterviewForm interviewId={selectedInterview} />
                    </div>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title" id="exampleModalLabel">
                                    <h3 className='pt-3'><strong>Job Role: {selectedInterview?.job}</strong> </h3>
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="card-body text-start" style={{ fontSize: 'smaller' }}>
                                            <div className="row">
                                                <div className="col">
                                                    <p><strong>Date : {selectedInterview?.scheduledDateTime}</strong></p>
                                                    <p><strong>Candidate : {selectedInterview?.candidate}</strong></p>
                                                    <p><strong>Interview Round : {selectedInterview?.interviewRound}</strong></p>
                                                </div>
                                                <div className="col">
                                                    <p><strong>Interviewer : {selectedInterview?.interviewer}</strong></p>
                                                    <p><strong>Type : {selectedInterview?.interviewType}</strong></p>
                                                    <p><strong>Start Time : {selectedInterview?.startTime}</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-white" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default AdminRecruitInterviewScheduleList;
