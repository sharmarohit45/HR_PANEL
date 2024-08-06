import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EmployeeMyCalendar from './EmployeeMyCalendar';
function EmployeeDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const [user, setUser] = useState({});
  const [dateTime, setDateTime] = useState(new Date());
  const [isOtherLocation, setIsOtherLocation] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [sessionValue, setSessionValue] = useState('')
  const [birthdays, setBirthdays] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [currentLeaveEmployees, setCurrentLeaveEmployees] = useState([]);
  const [anniversaryEmployees, setAnniversaryEmployees] = useState([]);
  const [joinedTodayEmployees, setJoinedTodayEmployees] = useState([]);
  const [appreciation, setAppreciation] = useState([]);
  const [filteredAppreciation, setFilteredAppreciation] = useState([]);
  const [formData, setFormData] = useState({
    attendanceDate: new Date().toISOString().split('T')[0],
    attendanceTime: new Date().toLocaleTimeString(),
    location: '',
    workingFrom: '',
    otherlocation: ''
  });

  useEffect(() => {
    getData()
    getSessionValue()
    fetchData();
  }, [])

  useEffect(() => {
    const interval = setInterval(checkDayCompletion, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkDayCompletion = async () => {
    const currentDateTime = new Date();
    const endOfDay = new Date(formData.attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (currentDateTime > endOfDay && sessionValue === 'Active') {

    }
  };
  const fetchAppreciationData = async () => {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/appericiation");
      const data = response.data;
      filterAppreciationData(data);
    } catch (error) {
      console.error("Data fetching failed", error);
    }
  };
  const filterAppreciationData = (data) => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return;
    }
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const filteredData = data.filter(item => {
      const appreciationDate = new Date(item.givenDate);
      return appreciationDate >= startOfYear && appreciationDate <= endOfYear;
    });
    setFilteredAppreciation(filteredData);
  };
  useEffect(()=>{
    fetchAppreciationData();
  },[])
  const fetchData = async () => {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/leaves");
      setLeaveData(response.data);
      filterCurrentDateLeaves(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getSessionValue = () => {
    const getvalue = sessionStorage.getItem('clockin')
    setSessionValue(getvalue)
    console.log(getvalue)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'workingFrom') {
      if (value === 'Other') {
        setIsOtherLocation(true);
      } else {
        setIsOtherLocation(false);
        setFormData(prevState => ({
          ...prevState,
          otherlocation: ''
        }));
      }}
    };
  const handleClockIn = async (e) => {
    e.preventDefault();
    sessionStorage.setItem('clockin', 'Active');
    try {
      const payload = {
        employeeId: user.empId,
        attendanceDate: formData.attendanceDate,
        attendanceTime: formData.attendanceTime,
        location: formData.location,
        workingFrom: formData.workingFrom,
        otherlocation: formData.otherlocation,
        status: 'Active'
      };
      console.log('payload', payload)

      const response = await axios.post('https://smarthrbackend-production.up.railway.app/clockAttendance/clock-in', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      getSessionValue();
    } catch (error) {
      console.error('Error during clock-in:', error);
    }
  };


  const handleClockOut = async (e) => {
    sessionStorage.removeItem('clockin');
    e.preventDefault();

    try {
      const logoutTime = new Date().toLocaleTimeString();
      const logoutData = {
        logoutTime,
        status: 'Not Active'
      };
      const response = await axios.put(`https://smarthrbackend-production.up.railway.app/clockAttendance/clock-out/${user.empId}/${formData.attendanceDate}`, logoutData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Clock out response:', response.data);
      getSessionValue();
    } catch (error) {
      console.error('Error during clock-out:', error); 
    }
  };
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
      filterBirthdays(response.data);
      filterAnniversaryEmployees(response.data);
      filterJoinedTodayEmployees(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const filterJoinedTodayEmployees = (data) => {
    const today = new Date();
    const joinedTodayEmployees = data.filter(employee => {
      const joiningDate = new Date(employee.joiningDate);
      return (
        joiningDate.getFullYear() === today.getFullYear() &&
        joiningDate.getMonth() === today.getMonth() &&
        joiningDate.getDate() === today.getDate()
      );
    });
    setJoinedTodayEmployees(joinedTodayEmployees);
  };
  function filterBirthdays(data) {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-indexed month
    const filteredBirthdays = data.filter((employee) => {
      const dob = new Date(employee.dateOfBirth);
      if (dob.toString() === 'Invalid Date') {
        console.log('Invalid date format:', employee.dateOfBirth);
        return false;
      }
      const employeeMonth = dob.getMonth() + 1;
      return employeeMonth === currentMonth;
    });
    setBirthdays(filteredBirthdays);
  }
  const filterAnniversaryEmployees = (data) => {
    const today = new Date();
    const anniversaryEmployees = data.filter(employee => {
      const anniversaryDate = new Date(employee.joiningDate);
      return (
        anniversaryDate.getMonth() === today.getMonth() &&
        anniversaryDate.getDate() === today.getDate()
      );
    });
    setAnniversaryEmployees(anniversaryEmployees);
  };
  const filterCurrentDateLeaves = (data) => {
    const today = new Date();
    const filteredLeaves = data.filter(leave => {
      const leaveDate = new Date(leave.leaveDate);
      // Check if leaveDate is today's date (ignoring time)
      return leaveDate.getFullYear() === today.getFullYear() &&
        leaveDate.getMonth() === today.getMonth() &&
        leaveDate.getDate() === today.getDate() &&
        leave.status === 'Approved'; // Filter for approved leaves only
    });
    setCurrentLeaveEmployees(filteredLeaves);
  };
  const formattedDateTime = {
    day: dateTime.toLocaleDateString(undefined, { weekday: 'long' }),
    time: dateTime.toLocaleTimeString()
  };
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
         
          <div className="row">
            <div className="col-md-12">
              <div className="page-head-box">
                <h3>Dashboard</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/employee">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Employee Dashboard
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="row p-2" >
            <div className="col">
              <h3>
                <b>Welcome {user.empName}</b>
              </h3>
            </div>

            <div className="col">
              <div className="row">
                <div className="col text-end" style={{ fontWeight: 'bold' }}>
                  <p>{formattedDateTime.time} <br /> {formattedDateTime.day}</p>
                </div>
                <div className="col-sm-3">
                  {
                    sessionValue ?
                      <button type="button" className='btn btn-white' style={{ fontSize: '12px', backgroundColor: 'red' }} onClick={handleClockOut}>
                        <ExitToAppIcon /> Clock out</button>
                      :
                      <button type="button" className='btn btn-white' style={{ fontSize: '12px' }} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <ExitToAppIcon /> Clock In</button>
                  }
                  <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">Clock In</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={handleClockIn}>
                            <div className="row">
                              <div className="col" style={{ fontSize: '25px' }}>
                                <label>
                                  <i className="fa fa-clock"></i>
                                  <b> {`${formData.attendanceDate} ${formData.attendanceTime}`} </b>
                                </label>
                              </div>
                              <div className="col text-end">
                                <label className="btn-success p-1">General Shift</label>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col">
                                <label>Location</label>
                                <select name="location" className="form-select" value={formData.location} onChange={handleChange}>
                                  <option value="">--</option>
                                  <option value="PSSPL">PSSPL</option>
                                </select>
                              </div>
                              <div className="col">
                                <label>Working From</label>
                                <select name="workingFrom" className="form-select" value={formData.workingFrom} onChange={handleChange}>
                                  <option value="Office">Office</option>
                                  <option value="Home">Home</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                            {isOtherLocation && (
                              <div className="row mt-3">
                                <div className="col">
                                  <label>Other Locations</label>
                                  <input type="text" className="form-control" value={formData.otherlocation} onChange={handleChange} />
                                </div>
                              </div>
                            )}
                            <div className="mt-2 modal-footer">
                              {/* <button type="button" className="btn btn-white">Cancel</button> */}
                              <button type="submit" className="btn btn-white" data-bs-dismiss="modal">Clock In</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5">
              {/* PROFILE CARD */}
              <div className="card p-4">
                <div className="row">
                  <div className="col p-2">
                    <img
                      src={`data:image/png;base64,${user.imageData}`}
                      style={{ height: '120px', width: '120px', padding: '10px', borderRadius: '25%' }}
                    />
                    {user.imageUrl}
                  </div>
                  <div className="col pt-4">
                    <p style={{ fontSize: 'smaller', fontSize: '15px' }}><b style={{ fontSize: '20px' }}>{user.empName}</b> <br />{user.designation} <br /> <p style={{ fontSize: '13px', color: 'gray' }}>Employee Id : {user.employeeIdentity} </p></p>
                  </div>
                  <div className="col"></div>
                </div>
                <hr />
                <div className="row p-2">
                  <div className="col">
                    <p>Open Tasks</p>
                    <b>7</b>
                  </div>
                  <div className="col">
                  </div>
                  <div className="col">
                    <p>Projects</p>
                    <b>0</b>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>Birthday</b><hr />
                  </h4>
                  {birthdays.length > 0 ? (
                    <div className="row overflow-auto">
                      <div className="col ">

                        {birthdays.map((employee) => (
                          <>
                            <div className="row mt-2">
                              <div className="col">
                                <p style={{ fontSize: 'smaller' }}><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '50%', height: '30px', width: '30px' }} alt="" /> &nbsp; <b>{employee.empName}</b></p>

                              </div>
                              <div className="col text-end">
                                <p >{new Date(employee.dateOfBirth).toLocaleDateString()}&nbsp; &nbsp; <i className='fa fa-birthday-cake'></i> </p>
                              </div>
                            </div>
                          </>

                        ))}

                      </div>
                    </div>
                  ) : (
                    <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                      <div className="col">
                        <i className='fa fa-list'></i>
                        <p>- No birthdays found this month. -</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="p-2">
                  <h4><b>Employee Appreciations</b></h4>
                  <hr />
                  <div className='text-center' style={{ fontSize: 'smaller' }}>
                    {filteredAppreciation.length === 0 ? (
                      <p>No appreciations found for this year.</p>
                    ) : (
                      <>
                        {filteredAppreciation.map((item) => (
                          <div className="row" key={item.id}>
                            <div className="col text-start">
                              <p><img src={`data:image/png;base64,${item.employee.imageData}`} style={{ borderRadius: '50%', height: '30px', width: '30px' }} alt="" />&nbsp; <b>{item.employee.empName}</b>
                              </p>
                            </div>
                            <div className="col">
                              <div className="row pt-1">
                                <div className="col-sm-9 text-end" style={{ fontSize: 'smaller' }}>
                                  <b>{item.awardList.title}</b><br />
                                  <b>{new Date(item.givenDate).toLocaleDateString()}</b>
                                </div>
                                <div className="col-sm-3 text-start">
                                  <i style={{ backgroundColor: item.awardList.colorCode, fontSize: '18px', padding: '4px', borderRadius: '20%' }} className={item.awardList.icon}></i>

                                </div>
                              </div>
                            </div>

                          </div>

                        ))}
                      </>


                    )}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>On Leave Today</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {currentLeaveEmployees && currentLeaveEmployees.length > 0 ? (
                        currentLeaveEmployees.map(leaveData => (
                          <div className="row" style={{ fontSize: 'smaller' }} key={leaveData.leaveId}>
                            <div className="col text-start">
                              <p 
                                style={{ cursor: 'pointer', fontSize: 'smaller' }}>
                                <img src={`data:image/png;base64,${leaveData.employee.imageData}`} style={{ borderRadius: '50%', height: '30px', width: '30px' }} alt="" />
                                &nbsp; <b>{leaveData.employee.empName}</b>
                              </p>
                            </div>
                            <div className="col pt-2">
                              <b>{leaveData.leaveDuration}</b>
                            </div>
                            <div className="col pt-2 text-end">
                              <p><b>{leaveData.leaveDate}</b></p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <i className='fa fa-list'></i>
                          <p>- No employees on leave today. -</p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="row">
                  <h4>
                    <b>On Work From Home Today</b>
                  </h4>
                  <div className="col">
                    <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                      <div className="col">
                        <i className='fa fa-list'></i>
                        <p>- No record found. -</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="row p-2">
                  <h4><b>Today's Joinings & Work Anniversary</b><hr /></h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {anniversaryEmployees.length > 0 ? (
                        anniversaryEmployees.map(employee => (
                          <>
                            <div className="row mt-2 overflow-y" style={{ fontSize: 'smaller' }}>
                              <div className="col text-start">
                                <p><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '15px', height: '30px', width: '30px' }} /> &nbsp; <b>{employee.empName}</b></p>
                              </div>
                              <div className="col text-end">
                                <p>{employee.joiningDate}</p>
                              </div>
                            </div>
                          </>
                        ))
                      ) : (
                        <p>- No work anniversaries today. -</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="col-sm-7">
              <div className="row">
                <div className="col-sm-6">
                  <div className="card p-4">
                    <h4><b>Tasks</b></h4>
                    <div className="row">
                      <div className="col">
                        <b>7</b>
                        <p>Pending</p>
                      </div>
                      <div className="col">
                        <b>6</b>
                        <p>Overdue</p>
                      </div>
                      <div className="col text-center">
                        <i className="fa fa-list text-lightest" style={{ fontSize: '25px', color: 'gray' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  {/* Right Section */}
                  <div className="card p-4">
                    <div className="row">
                      <h4>
                        <b>Projects</b>
                      </h4>
                      <div className="row">
                        <div className="col">
                          <b>7</b>
                          <p>In Progress</p>
                        </div>
                        <div className="col">
                          <b>6</b>
                          <p>Overdue</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="card p-4">
                <h4><b>Week Timelogs</b></h4>
                <div className="col">
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      <i className='fa fa-list'></i>
                      <p>- No record found. -</p>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="card p-2">
                <h4><b>My Tasks</b></h4><hr/>
                <div className="col">
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      <i className='fa fa-list'></i>
                      <p>- No record found. -</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-2">
                <h4><b>Tickets</b></h4><hr />
                <div className="col">
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      <i className='fa fa-list'></i>
                      <p>- No record found. -</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <EmployeeMyCalendar />
              </div>
              <div className="card p-4">
                <h4><b>Notices</b></h4>
                <div className="col">
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      <i className='fa fa-list'></i>
                      <p>- No record found. -</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;
