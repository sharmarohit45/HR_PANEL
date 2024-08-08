import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminLeadContactsForm from './AdminLeadContactsForm';
import AdminLeadContactEditForm from './AdminLeadContactEditForm';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function AdminLeadContacts() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const response = await fetch("https://smarthrbackend-production.up.railway.app/lead", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setRows(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const profileOnchange = (id) => {
        navigate(`/admin/leadContactsProfile/${id}`, { state: { id: id } });
    };
    const deleteEmployee = async (id) => {
        try {
            const response = await axios.delete(`https://smarthrbackend-production.up.railway.app/lead/${id}`);
            toast.success('Lead deleted Successfully');
            return response.data;
        } catch (error) {
            console.error('There was an error deleting the lead!', error);
            toast.error('There was an error deleting the lead!');
            throw error;
        }
    };
    const handleEditClick = (id) => {
        setSelectedId(id);
    };
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                   
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Lead Contacts</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Lead Contacts</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row pb-4">
                        <div className="col">
                            <button type="button" className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                <i className='fa fa-plus f-s'></i> Add Lead Contact
                            </button> &nbsp;
                            <Link to='/admin/lead-form'><button type="button" className='btn btn-white text-dark'>
                                    <i className="fa fa-pen"></i> Lead Form   
                            </button>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card text-dark" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    columns={[
                                        { field: 'id', headerName: 'Id', hideable: false, width: 100 },
                                        {
                                            field: 'name', headerName: 'Contact Name', hideable: false, width: 190, renderCell: (params) => (
                                                <div style={{ display: 'flex', alignItems: 'center', cursor:'pointer' }} onClick={() => profileOnchange(params.row.id)}>
                                                    {/* <img src={`data:image/png;base64,${params.row.imageData}`} alt={params.value} style={{ height: '30px', width: '30px', marginRight: '10px', borderRadius: '50%' }} /> &nbsp; &nbsp; */}
                                                    {params.value}
                                                </div>
                                            ),
                                        },
                                        { field: 'companyName', headerName: 'Company Name', hideable: false, width: 190 },
                                        { field: 'email', headerName: 'Email', width: 190 },
                                        { field: 'addedBy', headerName: 'Added By', width: 150 },
                                        { field: 'savedAt', headerName: 'Created', width: 150 },
                                        {
                                            field: 'action', headerName: 'Action', width: 100, renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li onClick={() => profileOnchange(params.row.id)}><a className="dropdown-item" ><i className="fa fa-eye"></i> View</a></li>
                                                        <li onClick={() => handleEditClick(params.row.id)}><a className="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#updateForm" aria-controls="offcanvasRight"><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li onClick={() => deleteEmployee(params.row.id)}><a className="dropdown-item" ><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul>
                                                </div>
                                            )
                                        },
                                    ]}
                                    rows={rows.map(row => ({
                                        id: row.id,
                                        name: row.name,
                                        companyName: row.companyName,
                                        email: row.email,
                                        addedBy: row.addedBy,
                                        savedAt: row.savedAt,
                                        action: row.action
                                    }))}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                    {/* Lead Form Modal */}
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Add Lead Contact Info</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="card">
                                <AdminLeadContactsForm dataLead={getData}/>
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="updateForm" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Update Lead Contact Info</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="card">
                            <AdminLeadContactEditForm id={selectedId} />
                            </div>
                        </div>
                    </div>
                        <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default AdminLeadContacts;
