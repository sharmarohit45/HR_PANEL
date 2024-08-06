import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminAddDesignations from './AdminAddDesignations';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import AdminUpdateDesignation from './AdminUpdateDesignation';


const AdminDesignationSection = () => {
    const [designations, setDesignations] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    async function fetchDesignations() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/designations");
            setDesignations(response.data);
        } catch (error) {
            console.error("Failed to fetch designations:", error);
        }
    }
    const updateData = async (id) => {
        try {
            await axios.put(`https://smarthrbackend-production.up.railway.app/designations/${id}`);
            toast.success("Updated");
        } catch (error) {
            console.log("error" , error);
            toast.success("Failed");
        }
    }
    useEffect(() => {
        fetchDesignations();
    }, []);

    const handleViewClick = (designation) => {
        setSelectedDesignation(designation);
    };
    const dataDelete = async (id) => {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/designations/${id}`);
            toast.success("Deleted Successfully")
            fetchDesignations();
        } catch (error) {
            console.log("failed", error);
            toast.error("failed")
        }
    }
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Designation</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Designation</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <button className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className='fa fa-plus'></i> Add Designation</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    columns={[
                                        { field: 'name', headerName: 'Name', width: 450 },
                                        { field: 'parent', headerName: 'Parent Designation', width: 450 },
                                        {
                                            field: 'action', headerName: 'Action', width: 150, renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li onClick={() => handleViewClick(params.row)} data-bs-toggle="modal" data-bs-target="#viewModal"><a className="dropdown-item"><i className="fa fa-eye"></i> View</a></li>
                                                        <li><a className="dropdown-item"data-bs-toggle="offcanvas" data-bs-target="#update" aria-controls="offcanvasRight"><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li onClick={() => dataDelete(params.row.id)}><a className="dropdown-item"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul>
                                                </div>
                                            )
                                        },
                                    ]}
                                    rows={designations.map(designation => ({
                                        id: designation.designationId,
                                        name: designation.name,
                                        parent: designation.parent,
                                        action: '',
                                    }))}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Designations</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminAddDesignations designation={fetchDesignations}/>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="update" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Designations</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminUpdateDesignation />
                        </div>
                    </div>
                    <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Designation Details</h1>
                                    <div className="dropdown" style={{ fontSize: 'smaller' }}>
                                        <button className="btn btn-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa fa-ellipsis-h"></i>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item">Edit</a></li>
                                            <li onClick={dataDelete}><a className="dropdown-item">Delete</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <table style={{ border: 'none' }} className='table table-striped'>
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{selectedDesignation ? selectedDesignation.name : '--'}</td>
                                            </tr>
                                            <tr>
                                                <th>Parent</th>
                                                <td>{selectedDesignation ? selectedDesignation.parent : '--'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default AdminDesignationSection;
