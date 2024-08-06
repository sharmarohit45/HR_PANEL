import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHolidayForm from './AdminHolidayForm';
import { toast, ToastContainer } from 'react-toastify';
import HolidayEditForm from './HolidayEditForm';

const AdminHolidayList = () => {
    const [holiday, setHoliday] = useState([]);
    const [selectedHolidayId, setSelectedHolidayId] = useState(null);

    const getData = async () => {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/holiday");
            setHoliday(response.data);
        } catch (error) {
            console.log("Data Fetching Failed", error);
        }
    };

    const deleteData = async (id) => {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/holiday/${id}`);
            
            toast.success("Data Deleted Successfully");
            await getData();
        } catch (error) {
            console.error("Data Deletion Failed", error);
            toast.error("Failed to Delete Data");
           
        }
    };
     

    useEffect(() => {
        getData();
    }, []);


    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Holiday List View</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Holiday List View</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <button className="btn btn-white mb-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                <i className='fa fa-plus'></i> Add Holiday
                            </button>
                        </div>
                        <div className="col text-end">
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-white">
                                    <Link to="/admin/holiday"><i className="fa fa-calendar"></i></Link>
                                </button>
                                <Link to='/admin/holiday-list'>
                                    <button type="button" className="btn btn-white">
                                        <i className="fa fa-list"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    columns={[
                                        { field: 'id', headerName: 'ID', width: 100 },
                                        { field: 'date', headerName: 'Date', width: 155 },
                                        { field: 'occasion', headerName: 'Occasion', width: 155 },
                                        { field: 'day', headerName: 'Day', width: 155 },
                                        { field: 'department', headerName: 'Department', width: 155 },
                                        { field: 'designation', headerName: 'Designation', width: 155 },
                                        { field: 'employementType', headerName: 'Employment Type', width: 155 },
                                        {
                                            field: 'action',
                                            headerName: 'Action',
                                            width: 100,
                                            renderCell: (params) => (
                                                <>
                                                    <MoreVertIcon
                                                        style={{ fontSize: '20px' }}
                                                        className="dropdown-toggle"
                                                        role="button"
                                                        id={`dropdownMenuLink-${params.row.id}`}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    />
                                                    <ul
                                                        className="dropdown-menu btn"
                                                        aria-labelledby={`dropdownMenuLink-${params.row.id}`}
                                                        style={{ fontSize: 'smaller' }}
                                                    >
                                                        <li>
                                                            <a className="dropdown-item">
                                                                <i className="fa fa-eye"></i> View
                                                            </a>
                                                        </li>
                                                        <li data-bs-toggle="offcanvas" data-bs-target="#editForm" aria-controls="editForm" onClick={() => setSelectedHolidayId(params.row.id)}>
                                                            <a className="dropdown-item">
                                                                <i className="fa fa-pen"></i> Edit
                                                            </a>
                                                        </li>
                                                        <li onClick={() => deleteData(params.row.id)}>
                                                            <a className="dropdown-item">
                                                                <i className="fa fa-trash" aria-hidden="true"></i> Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </>
                                            )
                                        },
                                    ]}
                                    rows={holiday.flatMap(h =>
                                        h.holiDayDateOcassion.map(occasion => ({
                                            id: occasion.id,
                                            date: occasion.date,
                                            occasion: occasion.occasion,
                                            day: new Date(occasion.date).toLocaleDateString('en-US', { weekday: 'long' }),
                                            department: h.department,
                                            designation: h.designation,
                                            employementType: h.employmentType,
                                            action: ''
                                        }))
                                    )}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                />

                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Holiday</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminHolidayForm />
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="editForm" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Holiday</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            {selectedHolidayId && <HolidayEditForm id={selectedHolidayId} />}
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default AdminHolidayList;
