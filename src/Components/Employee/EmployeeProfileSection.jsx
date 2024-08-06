import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
const EmployeeProfileSection = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const [user, setUser] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    async function getData() {
        try {
            const response = await axios.get('https://smarthrbackend-production.up.railway.app/allEmployee', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data) {
                throw new Error('Failed to fetch data');
            }

            const item = response.data.find((item) => item.email === email);

            if (item) {
                setUser(item);
                if (item.imageData) {
                    if (item.imageData.startsWith('data:image')) {
                        setImageUrl(item.imageData);
                    }
                }
                else {
                    console.error('No imageData found');
                }
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!email) {
            navigate('/');
        } else {
            getData();
        }
    }, [email, navigate]);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    {/* <!-- Page Header --> */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Profile</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/employee">Dashboard</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Profile</li>
                                        <li className="breadcrumb-item active" aria-current="page">Name</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /Page Header --> */}
                    {/* Page Content */}
                    <div className="card tab-box mt-3">
                        <div className="row user-tabs">
                            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                <ul className="nav nav-tabs nav-tabs-bottom pt-3 pb-2">
                                    <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active">Profile</a></li>
                                    <li className="nav-item"><a href="#emp_leaves" data-bs-toggle="tab" className="nav-link">Leaves</a></li>
                                    <li className="nav-item"><a href="#leave_quota" data-bs-toggle="tab" className="nav-link">Leaves Quota</a></li>
                                    <li className="nav-item"><a href="#immegration" data-bs-toggle="tab" className="nav-link">Immegration</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        {/* <!-- Profile Info Tab --> */}
                        <div id="emp_profile" className="pro-overview tab-pane fade show active">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="row">
                                            <div className="col-sm-10">
                                                <div className="row p-3">
                                                    <div className="col-sm-4">
                                                        <div className="profile-img">
                                                            <a href="#"><img src={`data:image/png;base64,${user.imageData}`} style={{ borderRadius: '15px', }} alt="" /></a>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <div className='profile-info pt-3'>
                                                            <h4><b>{user.empName}</b></h4>
                                                            <p>{user.department} | {user.designation}</p>
                                                            <p><i className='fa fa-birthday-cake'></i> &nbsp;{user.dateOfBirth}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col text-end">
                                               <Link to='/employee/settings'><i className='fa fa-edit text-dark'></i></Link> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card text-center p-3" style={{ fontSize: 'smaller' }}>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <h4><b>Reporting To</b></h4>
                                                <p><b>{user.reportingTo}</b></p>
                                            </div>
                                            <div className="col-sm-6">
                                                <h4><b>Reporting Team</b></h4>
                                                <p>--</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="row p-2">
                                            <div className="col">
                                                <h3><b>Profile Info</b></h3>
                                            </div>
                                        </div>
                                        <div className="row  p-3">
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>EMP ID</p>
                                                        <p>{user.employeeIdentity}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>Full Name</p>
                                                        <p>{user.empName}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>Designation</p>
                                                        <p>{user.designation}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>Department</p>
                                                        <p>{user.department}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>Gender</p>
                                                        <p>{user.gender}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p>Work Anniversary</p>
                                                        <p>{user.anniversary_date}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col d-flex justify-content-between">
                                                        <p></p>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <div className="col-sm-6">

                                        </div>
                                        <div className="col-sm-6">

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /Profile Info Tab --> */}

                        {/* <!-- Projects Tab --> */}
                        <div className="tab-pane fade" id="emp_leaves">
                            <div className="row">
                                <h1>LEAVE DATA</h1>
                            </div>
                        </div>
                        {/* <!-- /Projects Tab --> */}

                        {/* <!-- Bank Statutory Tab --> */}
                        <div className="tab-pane fade" id="leave_quota">
                            <h1>Leave Quota</h1>
                        </div>
                        {/* <!-- /Bank Statutory Tab --> */}
                        <div className='tab-pane fade' id="immegration">
                            <h1>IMMEGRATION DATA</h1>
                        </div>
                    </div>
                </div>
                {/*End Page Content*/}
            </div>
        </>
    )
}

export default EmployeeProfileSection