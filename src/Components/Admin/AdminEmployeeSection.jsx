import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminEmployeeForm from './AdminEmployeeForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminEmployeeSection() {
    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState('tab1');
    const navigate = useNavigate();

    async function getData() {
        try {
            const empResponse = await axios("https://smarthrbackend-production.up.railway.app/allEmployee");
            const employees = empResponse.data;

            const response = await axios.get("https://smarthrbackend-production.up.railway.app/clockAttendance/clock-in");
            const attendanceData = response.data;

            const updatedRows = employees.map(employee => {
                const attendanceRecords = attendanceData.filter(att => att.employeeId === employee.empId);

                const isActive = attendanceRecords.some(att => att.status === "Active");

                return {
                    ...employee,
                    Status: isActive ? 'active' : 'InActive'
                };
            });
            setRows(updatedRows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    useEffect(() => {
        getData();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const profileOnchange = (empId) => {
        navigate(`/admin/employee-profile/${empId}`, { state: { empId } });
    };

    const editProfile = (empId) => {
        navigate(`/admin/employee-edit-profile/${empId}`, { state: { empId } });
    }

    const deleteEmployee = async (empId) => {
        try {
            const response = await axios.delete(`https://smarthrbackend-production.up.railway.app/employee/${empId}`);
            toast.success("Data Deleted Successfully")
            getData();
        } catch (error) {
            console.error('There was an error deleting the employee!', error);
            toast.error('There was an error deleting the employee!');
            throw error;
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Employee</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">Dashboard</li>
                                        <li className="breadcrumb-item active" aria-current="page">Employee</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <button className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className='fa fa-plus'></i> Add Employee</button>&nbsp;
                            <button className='btn btn-white' data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i className='fa fa-plus'></i> Invite Employee</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    pageSizeOptions={[5, 10, { value: 100, label: '100' }]}
                                    columns={[
                                        { field: 'empId', headerName: 'ID', hideable: false, width: 100 },
                                        { field: 'employeeIdentity', headerName: 'Employee ID', hideable: false, width: 100 },
                                        {
                                            field: 'empName',
                                            headerName: 'Name',
                                            hideable: false,
                                            width: 190,
                                            renderCell: (params) => (
                                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => profileOnchange(params.row.empId)}>
                                                    <img src={`data:image/png;base64,${params.row.imageData}`} alt={params.value} style={{ height: '30px', width: '30px', marginRight: '10px', borderRadius: '50%' }} />
                                                    {params.value}
                                                </div>
                                            ),
                                        },
                                        { field: 'email', headerName: 'Email', width: 190 },
                                        {
                                            field: 'empUserRole',
                                            headerName: 'User Role',
                                            hideable: false,
                                            width: 200,
                                            renderCell: (params) => (
                                                <select
                                                    className="form-select"
                                                    style={{ marginTop: '6px' }}
                                                    aria-label="Default select User Role"
                                                    value={params.row.empUserRole || ''}
                                                    onChange={(e) => {
                                                        // Handle change event if needed
                                                    }}
                                                >
                                                    <option value="">{params.row.emp_User_Name}</option>
                                                    <option value="App Administrator">App Administrator</option>
                                                    <option value="Employee">Employee</option>
                                                    <option value="Manager">Manager</option>
                                                </select>
                                            ),
                                        },
                                        { field: 'reportingTo', headerName: 'Reporting To', width: 150 },
                                        {
                                            field: 'Status',
                                            headerName: 'Status',
                                            width: 150,
                                            renderCell: (params) => (
                                                <div>
                                                    {params.row.Status === 'active' ? (
                                                        <>
                                                            <i className="fa fa-circle" style={{ color: '#39e500', marginRight: '5px' }}></i>
                                                            {params.row.Status}
                                                        </>
                                                    ) : params.row.Status === 'InActive' ? (
                                                        <>
                                                            <i className="fa fa-circle" style={{ color: 'red', marginRight: '5px' }}></i>
                                                            {params.row.Status}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa fa-circle" style={{ color: 'red', marginRight: '5px' }}></i>
                                                            {params.row.Status}
                                                        </>
                                                    )}
                                                </div>
                                            ),
                                        },
                                        {
                                            field: 'action',
                                            headerName: 'Action',
                                            width: 100,
                                            renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li><a className="dropdown-item" onClick={() => profileOnchange(params.row.empId)}><i className="fa fa-eye"></i> View</a></li>
                                                        <li><a className="dropdown-item" onClick={() => editProfile(params.row.empId)}><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li onClick={() => deleteEmployee(params.row.empId)}><a className="dropdown-item" href="#"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul>
                                                </div>
                                            ),
                                        },
                                    ]}
                                    rows={rows.map(row => ({
                                        id: row.empId,
                                        empId: row.empId,
                                        employeeIdentity: row.employeeIdentity,
                                        empName: row.empName,
                                        email: row.email,
                                        empUserRole: row.emp_User_Name,
                                        reportingTo: row.reportingTo,
                                        Status: row.Status,
                                        imageData: row.imageData,
                                    }))}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Add Employee</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <AdminEmployeeForm onAddEmployee={getData} />
                        </div>
                    </div>
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title" id="staticBackdropLabel">Invite member to Smart HR</h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='row mb-4'>
                                        <div className="col">
                                            <button style={{ color: 'black', backgroundColor: 'white', border: '1px solid gray' }} onClick={() => handleTabClick('tab1')} className={activeTab === 'tab1' ? 'active-tab' : ''}>Invite By Email</button>
                                        </div>
                                        <div className="col">
                                            <button style={{ color: 'black', backgroundColor: 'white', border: '1px solid gray' }} onClick={() => handleTabClick('tab2')} className={activeTab === 'tab2' ? 'active-tab' : ''}>Invite By Link</button>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        {activeTab === 'tab1' && (
                                            <div className='row'>
                                                <div className="col-sm-12">
                                                    <form>
                                                        <div className="row">
                                                            <div className="col">
                                                                <label htmlFor="">Email</label>
                                                                <input type="email" className='form-control' />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <label htmlFor="">Message</label>
                                                                <textarea className='form-control'></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-4">
                                                            <div className="col-sm-3">
                                                                <button type='submit' className='btn btn-white'><i className="fa fa-paper-plane"></i> Send Invite</button> &nbsp;
                                                                <button type='button' className='btn btn-white' data-bs-dismiss="modal"><i className="fa fa-close"></i> Cancel</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'tab2' && (
                                            <div className='row'>
                                                <div className="col-sm-12">
                                                    <h5>Create an invite link for members to join.</h5>
                                                    <form style={{ fontSize: 'smaller' }}>
                                                        <div className="row mt-4">
                                                            <div className="col">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                        Allow any email address
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                        Only allow email addresses with domain
                                                                    </label>
                                                                    <div className="input-group mb-3">
                                                                        <span className="input-group-text" id="basic-addon1">@</span>
                                                                        <input type="text" className="form-control" placeholder="e.g. @gmail.com" aria-label="Domain" aria-describedby="basic-addon1" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <button type="button" className='btn btn-white'><i className="fa fa-link"></i> Create Link</button>  &nbsp;
                                                                <button type="button" className='btn btn-white' data-bs-dismiss="modal"><i className="fa fa-close"></i> Cancel</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default AdminEmployeeSection;