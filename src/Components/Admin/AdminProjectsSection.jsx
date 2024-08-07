import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminAddProjectForm from './AdminAddProjectForm';
import { toast, ToastContainer } from 'react-toastify';

const AdminProjectsSection = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/getallProject");
            setRows(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }
    async function deleteData(projectId) {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/project/${projectId}`);
            toast.success("Data Deleted")
            getData();
        } catch (error) {
            console.error('Failed:', error);
            toast.error("Failed")
        }
    }
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
                                <h3>Projects</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Projects</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>



                    <div className="row mb-3">
                        <div className="row mb-3">
                            <div className="col">
                                <button className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                    <i className='fa fa-plus'></i> Add Projects
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card" style={{ minHeight: '600px' }}>
                                    <DataGrid
                                        columns={[
                                            { field: 'id', headerName: 'id', hideable: false, width: 100 },
                                            { field: 'code', headerName: 'Project Code', hideable: false, width: 150 },
                                            { field: 'projectName', headerName: 'Project Name', hideable: false, width: 150 },
                                            {
                                                field: 'members',
                                                headerName: 'Members',
                                                hideable: false,
                                                width: 200,
                                                renderCell: (params) => {
                                                    // Ensure params.value is an array of member objects
                                                    const members = params.value || [];

                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                            {members.length > 0 ? (
                                                                members.map((member, index) => (
                                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                                                        {member.imageData ? (
                                                                            <img
                                                                                src={`data:image/png;base64,${member.imageData}`} // Ensure MIME type matches the data format
                                                                                alt={`Image of ${member.empName}`}
                                                                                style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                                                                            />
                                                                        ) : (
                                                                            <div style={{ height: '30px', width: '30px', borderRadius: '50%', backgroundColor: '#ccc' }} />
                                                                        )}
                                                                        <span style={{ marginLeft: '5px' }}>{member.empName}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span>No Members</span>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            }
                                            ,
                                            { field: 'startDate', headerName: 'Start Date', hideable: false, width: 150 },
                                            { field: 'deadline', headerName: 'Deadline', hideable: false, width: 150 },
                                            {
                                                field: 'client',
                                                headerName: 'Client',
                                                hideable: false,
                                                width: 200,
                                                renderCell: (params) => {
                                                    // Ensure params.value is the client object
                                                    const { clientName, imageProfileData } = params.value || {};

                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                            {imageProfileData ? (
                                                                <img
                                                                    src={`data:image/png;base64,${imageProfileData}`} // Ensure MIME type matches your data
                                                                    alt={`Profile of ${clientName}`}
                                                                    style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}
                                                                />
                                                            ) : (
                                                                <div style={{ height: '30px', width: '30px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px' }} />
                                                            )}
                                                            <span>{clientName || 'No Client Name'}</span>
                                                        </div>
                                                    );
                                                }
                                            }
                                            ,
                                            {
                                                field: 'status', headerName: 'Status', hideable: false, width: 150, renderCell: (params) => (
                                                    <select className="form-select mt-2" aria-label="status">
                                                        <option value="in progress">in progress</option>
                                                        <option value="not started">not started</option>
                                                        <option value="on hold">on hold</option>
                                                        <option value="canceled">canceled</option>
                                                        <option value="finished">finished</option>
                                                    </select>
                                                )
                                            },
                                            {
                                                field: 'action', headerName: 'Action', width: 190, renderCell: (params) => (
                                                    <div>
                                                        <MoreVertIcon style={{ fontSize: '20px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                        <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                            <li><a className="dropdown-item" ><i className="fa fa-eye"></i> View</a></li>
                                                            <li ><a className="dropdown-item"><i className="fa fa-pen"></i> Edit</a></li>
                                                            {/* <li><a className="dropdown-item"><i className="fa fa-copy"></i> Duplicate</a></li>
                                                            <li><a className="dropdown-item"><i className="fa fa-project-diagram"></i> Gant Chart</a></li>
                                                            <li><a className="dropdown-item"><i className="fa fa-share-square"></i> Public Gant Chart</a></li>
                                                            <li><a className="dropdown-item"><i className="fa fa-share-square"></i> Public Task Board</a></li>
                                                            <li><a className="dropdown-item"><i className="fa fa-archive"></i> Archive</a></li> */}
                                                            <li onClick={() => deleteData(params.row.projectId)}><a className="dropdown-item"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                )
                                            },
                                        ]}
                                        rows={rows.map(row => ({
                                            id: row.id,
                                            projectId:row.id,
                                            code: row.code,
                                            projectName: row.projectName,
                                            members: row.members.map(emp => ({
                                                empName: emp.empName,
                                                imageData: emp.imageData
                                            })),
                                            startDate: row.startDate,
                                            deadline: row.deadline,
                                            client: {
                                                clientName: row.client.clientName,
                                                imageProfileData: row.client.imageProfileData
                                            },
                                            Status: row.Status,
                                            imageProfileData: row.client.imageProfileData
                                        }))}
                                        loading={loading}
                                        slots={{
                                            toolbar: GridToolbar,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                            <div className="offcanvas-header">
                                <h2 id="offcanvasRightLabel" className='text-bold'><b>Projects</b></h2>
                                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <AdminAddProjectForm onProject={getData} />
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default AdminProjectsSection;
