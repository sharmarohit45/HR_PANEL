import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import EmployeeLeaveForm from './EmployeeLeaveForm';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeLeavesSection = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const email = localStorage.getItem('email');

    const fetchData = async () => {
        try {
            const response = await axios.get('https://smarthrbackend-production.up.railway.app/leaves');
            const allLeaves = response.data;
            const filteredLeaves = allLeaves.filter(leave => leave.employee.email === email);
            setRows(filteredLeaves);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching leaves data');
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveDetails = async (leaveId) => {
        try {
            const response = await axios.get(`https://smarthrbackend-production.up.railway.app/leaves/${leaveId}`);
            setSelectedLeave(response.data);
            console.log('Selected Leave Data:', response.data); // Debugging line
        } catch (error) {
            toast.error('Error fetching leave details');
        }
    };

    useEffect(() => {
        if (email) {
            fetchData();
        } else {
            toast.error('Email not found');
        }
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
                    {/* Page Content */}
                    <div className="row mb-3">
                        <div className="col-8">
                            <button className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                <i className='fa fa-plus'></i> New Leave
                            </button>
                        </div>
                        <div className="col-4 d-flex justify-content-end">
                            <div className="btn-group">
                                <Link to="/employee/leaves" className="btn btn-dark text-white" aria-current="page"><ListIcon /></Link>
                                <Link to="/employee/leaves-calendar" className="btn btn-white" aria-current="page"><CalendarTodayIcon /></Link>
                                <Link to="/employee/my-leaves" className="btn btn-white" aria-current="page"><PersonIcon /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{ minHeight: '550px' }}>
                                {loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <DataGrid
                                        columns={[
                                            { field: 'id', headerName: 'ID', width: 100 },
                                            {
                                                field: 'employee', headerName: 'Employee', width: 290, renderCell: (params) => (
                                                    <>
                                                        <img src={`data:image/jpeg;base64,${params.row.imageData}`} alt="Employee" style={{ borderRadius: '15px', height: '40px', width: '40px' }} />
                                                        &nbsp; {params.row.employee}
                                                    </>
                                                )
                                            },
                                            { field: 'leaveDate', headerName: 'Leave Date', width: 130 },
                                            { field: 'leaveDuration', headerName: 'Duration', width: 150 },
                                            { field: 'status', headerName: 'Leave Status', width: 150 },
                                            { field: 'leaveType', headerName: 'Leave Type', width: 150 },
                                            {
                                                field: 'action', headerName: 'Action', width: 100, renderCell: (params) => (
                                                    <div>
                                                        <MoreVertIcon
                                                            style={{ fontSize: '15px' }}
                                                            className="dropdown-toggle"
                                                            role="button"
                                                            id="dropdownMenuLink"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        />
                                                        <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                            <li data-bs-toggle="offcanvas" data-bs-target="#viewDetails" aria-controls="offcanvasRight" onClick={() => fetchLeaveDetails(params.row.id)}>
                                                                <a className="dropdown-item"><i className="fa fa-eye"></i> View</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )
                                            },
                                        ]}
                                        rows={rows.map(row => ({
                                            id: row.leaveId,
                                            employee: row.employee.empName,
                                            leaveDate: row.leaveDate,
                                            imageData: row.employee.imageData,
                                            leaveDuration: row.leaveDuration,
                                            status: row.status,
                                            leaveType: row.leaveType,
                                            action: row.action
                                        }))}
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Add Leave</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <EmployeeLeaveForm />
                        </div>
                    </div>
                    {selectedLeave && (
                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="viewDetails" aria-labelledby="viewDetailsLabel" style={{ width: '85%' }}>
                            <div className="offcanvas-header bg-primary text-white p-4">
                                <h2 id="viewDetailsLabel" className='text-bold'><b>Leave Details</b></h2>
                                <button type="button" className="btn-close text-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <div className="card p-5">
                                    <div className="row ">
                                        <div className="col-sm-12">
                                            <h3><b>Leave Info</b></h3>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col">
                                            <p><b>Applicant Name</b></p>
                                        </div>
                                        <div className="col">
                                            <img src={`data:image/jpeg;base64,${selectedLeave.employee.imageData}`} alt="Employee" style={{ borderRadius: '15px', height: '40px', width: '40px' }} />
                                            &nbsp; {selectedLeave.employee.empName}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Leave Date</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.leaveDate}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Leave Type</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.leaveType}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Paid</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.paid ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Reason For Absence</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.absenceReason}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Status</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.status}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <p><b>Files</b></p>
                                        </div>
                                        <div className="col">
                                            {selectedLeave.files ? selectedLeave.files.map(file => (
                                                <a href={`data:application/octet-stream;base64,${file.fileData}`} download={file.fileName} key={file.fileName}>{file.fileName}</a>
                                            )) : 'No files'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmployeeLeavesSection;
