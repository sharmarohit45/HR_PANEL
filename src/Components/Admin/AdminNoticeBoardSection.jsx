import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminAddNotice from './AdminAddNotice';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminNoticeBoardSection = () => {
    const [rows, setRows] = useState([]);
    const [noticeDetails, setNoticeDetails] = useState(null);

    async function getData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/notice");
            setRows(response.data);
        } catch (error) {
            console.log("Fetching data unsuccessful", error);
        }
    }

    async function deleteData(id) {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/notice/${id}`);
            getData();
            toast.success("Deleted Successfully");
        } catch (error) {
            console.log("Deleting data unsuccessful", error);
            toast.error("Failed");
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleViewClick = (notice) => {
        setNoticeDetails(notice);
        document.getElementById('canvasModal').classList.add('show');
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Notice Board</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Notice Board</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="row mb-3">
                        <div className="col">
                            <button className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className='fa fa-plus'></i> Add New Notice</button> &nbsp;
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    columns={[
                                        { field: 'id', headerName: 'ID', width: 100 },
                                        {
                                            field: 'noticeHeading', headerName: 'Notice', width: 585,
                                            renderCell: (params) => (
                                                <>
                                                    <div style={{ cursor: 'pointer' }} data-bs-toggle="offcanvas" data-bs-target="#canvasModal" aria-controls="canvasModal" onClick={() => handleViewClick(params.row)}>{params.row.noticeHeading}</div>
                                                </>
                                            )
                                        },
                                        { field: 'date', headerName: 'Date', width: 155 },
                                        { field: 'type', headerName: 'To', width: 155 },
                                        {
                                            field: 'action', headerName: 'Action', width: 180, renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li data-bs-toggle="offcanvas" style={{ cursor: 'pointer' }}
                                                            data-bs-target="#canvasModal"
                                                            aria-controls="canvasModal"
                                                            onClick={() => handleViewClick(params.row)}>
                                                                <a className="dropdown-item"><i className="fa fa-eye"></i> View </a></li>
                                                        <li><a className="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUpdate" aria-controls="offcanvasRight"><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li onClick={() => deleteData(params.row.id)}><a className="dropdown-item"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul>
                                                </div>
                                            )
                                        },
                                    ]}
                                    rows={rows.map(row => ({
                                        id: row.noticeId,
                                        noticeHeading: row.noticeHeading,
                                        date: row.date,
                                        type: row.type,
                                        description: row.noticeDetails,
                                    }))}
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Add New notice</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminAddNotice noticeData={getData} />
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasUpdate" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Update notice</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminAddNotice noticeData={getData} />
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="canvasModal" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Notice Board</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            {noticeDetails ? (
                                <div className="row">
                                    <div className="col">
                                        <div className="row">
                                            <div className="col">
                                                <h3>Notice Details</h3>
                                            </div>
                                        </div><hr />
                                        <div className="row">
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col">
                                                        <h5><b>Notice Heading</b></h5>
                                                    </div>
                                                    <div className="col">
                                                        <h5>{noticeDetails.noticeHeading}</h5>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col">
                                                        <h5><b>Date</b></h5>
                                                    </div>
                                                    <div className="col">
                                                        <h5>{noticeDetails.date}</h5>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col">
                                                        <h5><b>To</b></h5>
                                                    </div>
                                                    <div className="col">
                                                        <h5>{noticeDetails.type}</h5>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col">
                                                        <h5><b>Description</b></h5>
                                                    </div>
                                                    <div className="col">
                                                        <b dangerouslySetInnerHTML={{ __html: noticeDetails.description }}></b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">No details available</div>
                            )}
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default AdminNoticeBoardSection;
