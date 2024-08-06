import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import GroupsIcon from '@mui/icons-material/Groups';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const AdminRecruitReportSection = () => {
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Report</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Report</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Link to="">
                                <div className="card">
                                    <div className="row">
                                        <div className="col-sm-8 p-3">
                                            <h4 className='text-dark'><b>Job Application</b></h4>
                                            <h4><b>0</b></h4>
                                        </div>
                                        <div className="col-sm-4 pt-4 text-center">
                                            <i className='fa fa-coins' style={{ fontSize: '35px', color: 'gray' }} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="">
                                <div className="card">
                                    <div className="row">
                                        <div className="col-sm-8 p-3">
                                            <h4 className='text-dark'><b>Job Posted</b></h4>
                                            <h4><b>0</b></h4>
                                        </div>
                                        <div className="col-sm-4 pt-4 text-center">
                                            <i className='fa fa-coins' style={{ fontSize: '35px', color: 'gray' }} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="">
                                <div className="card">
                                    <div className="row fs-6">
                                        <div className="col-sm-8 p-3">
                                            <h4 className='text-dark'><b>Candidate Hired</b></h4>
                                            <h4>0</h4>
                                        </div>
                                        <div className="col-sm-4 pt-4 text-center">
                                            <i className='fa fa-coins' style={{ fontSize: '35px', color: 'gray' }} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="">
                                <div className="card">
                                    <div className="row fs-6">
                                        <div className="col-sm-8 p-3">
                                            <h4 className='text-dark'><b>Interview Schedule</b></h4>
                                            <h4>0</h4>
                                        </div>
                                        <div className="col-sm-4 pt-4 text-center">
                                            <i className='fa fa-coins' style={{ fontSize: '35px', color: 'gray' }} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className='card text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '500px' }}>
                        <div className="row">
                            <div className="col">
                                <i className='fa fa-list'></i>
                                <p>- No record found. -</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminRecruitReportSection