import React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import AdminPurchaseOrderForm from './AdminPurchaseOrderForm';
const AdminPurchaseOrderSection = () => {
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Purchase Order</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Purchase Order</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row pb-4">
                        <div className="col-sm-4">
                            <button type="button" className='btn btn-white' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" >
                                <i className='fa fa-plus f-s'></i> Add Order
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card text-dark" style={{ minHeight: '520px' }}>
                                <DataGrid
                                    columns={[
                                        // { field: 'id', headerName: 'Id', hideable: false, width: 150 },
                                        { field: 'orderNumber', headerName: 'Order Number', hideable: true, width: 150 },
                                        { field: 'vendor', headerName: 'Vendor', hideable: true, width: 130 },
                                        { field: 'purchaseDate', headerName: 'Purchase Date', hideable: true, width: 130 },
                                        { field: 'expectedDate', headerName: 'Expected Date', hideable: true, width: 130 },
                                        { field: 'totalAmount', headerName: 'Total Amount', hideable: true, width: 130 },
                                        {
                                            field: 'billedStatus', headerName: 'Billed Status', hideable: true, width: 130, renderCell: (params) => (
                                                <>
                                                </>
                                            )
                                        },
                                        {
                                            field: 'deliveryStatus', headerName: 'Delivery Status', hideable: true, width: 130, renderCell: (params) => (
                                                <>
                                                </>
                                            )
                                        },
                                        {
                                            field: 'action', headerName: 'Action', width: 100, renderCell: (params) => (
                                                <div>
                                                    <MoreVertIcon style={{ fontSize: '15px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    {/* <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-eye"></i> View</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-link"></i> Public link</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-download"></i> Download</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-pen"></i> Edit</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-send-o"></i> Send</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-plus"></i> create invoice</a></li>
                                                        <li><a className="dropdown-item" href="#"><i className="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
                                                    </ul> */}
                                                </div>
                                            )
                                        },
                                    ]}
                                    // rows={rows}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: '85%' }}>
                        <div className="offcanvas-header">
                            <h2 id="offcanvasRightLabel" className='text-bold'><b>Purchase Order</b></h2>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                           <AdminPurchaseOrderForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPurchaseOrderSection