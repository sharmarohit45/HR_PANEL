import React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminSkillForm from './AdminSkillForm';

const AdminRecruitSkillsSection = () => {
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Skills</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Skills</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3 mb-3">
                        <div className="col">
                            <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" className="btn btn-white">Add Skill</button>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Add Skills</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                           <AdminSkillForm />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    pageSizeOptions={[5, 10, { value: 100, label: '100' }]}
                                    columns={[
                                        // { field: 'empId', headerName: 'ID', hideable: false, width: 100 },
                                        { field: 'name', headerName: 'Name', hideable: false, width: 1000 },
                                        
                                        {
                                            field: 'action',
                                            headerName: 'Action',
                                            width: 100,
                                            renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li><a className="dropdown-item"><i className="fa fa-eye"></i> View</a></li>
                                                        <li><a className="dropdown-item"><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul>
                                                </div>
                                            ),
                                        },
                                    ]}
                                    // rows={rows.map(row => ({
                                    //     id: row.empId,
                                    //     empId: row.empId,
                                    //     employeeIdentity: row.employeeIdentity,
                                    //     empName: row.empName,
                                    //     email: row.email,
                                    //     empUserRole: row.emp_User_Name,
                                    //     reportingTo: row.reportingTo,
                                    //     Status: row.Status,
                                    //     imageData: row.imageData,
                                    // }))}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminRecruitSkillsSection