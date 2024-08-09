import axios from 'axios';
import { html2pdf } from 'html2pdf.js';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ClientContractInvoice = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState('')
    const location = useLocation();
    const contractId = location.state ? location.state.contractId : null;
    useEffect(() => {
        if (contractId) {
            getData();

        }
    }, [contractId]);

    const getData = async () => {
        try {
            const response = await axios.get(`https://smarthrbackend-production.up.railway.app/contract/${contractId}`);
            setData(response.data);
            setId(contractId)
        } catch (error) {
            console.log("Data fetching failed", error);
        } finally {
            setLoading(false);
        }
    };
    const deleteData = async (contractId) => {
        try {
            await axios.delete(`https://smarthrbackend-production.up.railway.app/contract/${contractId}`)
            toast.success("Deleted")
            getData();
        } catch (error) {
            console.log("Error in Delete : ", error);
            toast.error("Failed")
        }
    }
    const handlePrint = () => {
        const printContents = document.getElementById('invoice-section').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    const handleDownload = () => {
        const element = document.getElementById('invoice-section');
        const opt = {
            margin: 0.5,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-head-box">
                                    <h3>Invoice</h3>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="admin-dashboard.html">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Invoice</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col-auto float-end ms-auto">
                                    <div className="btn-group btn-group-sm">
                                        <button className="btn btn-white" onClick={handlePrint}>
                                            <i className="fa fa-print fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="row" id="invoice-section">
                                <div className="col-md-12">
                                    <div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col m-b-20">
                                                    <img src="/assets/img/logo2.png" className="inv-logo" alt="Company Logo" />
                                                </div>
                                                <div className="col mt-5">
                                                    <div className="invoice-details">
                                                        <h3 className="text-uppercase"><b>Contracts</b></h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-8">
                                                    <ul className="list-unstyled mt-2">
                                                        <li>PSSPL</li>
                                                        <li>New Delhi</li>
                                                        <li>89XXXXXX00</li>
                                                        <li>GST No: ABCDEFGHIJKLMNO</li>
                                                    </ul>
                                                </div>
                                                <div className="col-sm-4">
                                                    <table className='table table-bordered' style={{ fontSize: 'smaller', textAlign: 'start' }}>
                                                        <tbody>
                                                            <tr>
                                                                <th style={{ backgroundColor: '#f1f1f3' }}>Contract Number</th>
                                                                <td>{data.contractNumber}1</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{ backgroundColor: '#f1f1f3' }}>Start Date</th>
                                                                <td>{data.startDate}</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{ backgroundColor: '#f1f1f3' }}>End Date</th>
                                                                <td>{data.endDate}</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{ backgroundColor: '#f1f1f3' }}>Contract Type</th>
                                                                <td>{data.contractType}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 col-lg-7 col-xl-8 m-b-20">
                                                    <h5>
                                                        Billed To:</h5>
                                                    <ul className="list-unstyled">
                                                        <li><h5><strong>{data.client.clientName}</strong></h5></li>
                                                        <li><span>{data.client.companyName}</span></li>
                                                        <li>{data.client.city}</li>
                                                        <li>{data.client.state}</li>
                                                        <li>{data.client.country}</li>
                                                        <li>{data.client.mobileNo}</li>
                                                        <li>
                                                            <a href={`mailto:${data.client.email}`}>{data.client.email}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <h4><b>Subject</b></h4>
                                                    <p>{data.subject}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <h4><b>Notes</b></h4>
                                                    <p>{data.notes}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <h4><b>Description</b></h4>
                                                <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                            </div>
                                            <div className="row">
                                                <div className="col text-end" style={{ border: '1px solid gray', borderRight: 'none', borderLeft: 'none' }}>
                                                    <h4 className='p-2'><b>Contract Value: {data.contractValue}</b></h4>
                                                </div></div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="input-group m-3">
                                       
                                        <Link to="/admin/contracts"><button type="button" className='btn btn-white'>Cancel</button></Link>
                                        &nbsp; &nbsp;
                                        <button type="button" className="btn btn-outline-secondary">Action</button>
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><a className="dropdown-item" ><i className='fa fa-edit'></i> Edit</a></li>
                                            <li  onClick={() => deleteData(data.contractId)}><a className="dropdown-item" ><i className='fa fa-trash'></i> Delete</a></li>
                                            <li><a className="dropdown-item"  onClick={handleDownload}><i className='fa fa-download'></i> Download</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-paper-plane'></i> Send</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-plus'></i> Add Shipping Address</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-bell'></i> Payment Reminder</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-plus'></i> Add Payment</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-copy'></i> Copy Payment Link</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-external-link-alt'></i> Copy Payment Link</a></li>
                                            <li><a className="dropdown-item" ><i className='fa fa-copy'></i> Create Duplicate</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
};

export default ClientContractInvoice