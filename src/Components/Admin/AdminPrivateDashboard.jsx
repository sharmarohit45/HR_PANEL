import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminMyCalender from './AdminMyCalender';
import { useNavigate } from 'react-router-dom';
function AdminPrivateDashboard() {
  const [admin, setAdmin] = useState(null);
  const [notice, setNotice] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [isOtherLocation, setIsOtherLocation] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [currentLeaveEmployees, setCurrentLeaveEmployees] = useState([]);
  const [anniversaryEmployees, setAnniversaryEmployees] = useState([]);
  const [joinedTodayEmployees, setJoinedTodayEmployees] = useState([]);
  const [internshipEndEmployees, setInternshipEndEmployees] = useState([]);

  const navigate = useNavigate();
  const [noticePeriodEmployees, setNoticePeriodEmployees] = useState([]);
  const [workingHome, setWorkinHome] = useState([]);
  const [sectionsVisibility, setSectionsVisibility] = useState({
    profile: true,
    shiftSchedule: true,
    birthdays: true,
    notices: true,
    tasks: true,
    projects: true,
    myTasks: true,
    myCalendar: true,
    contractDate: true,
    weekTimelogs: true,
    onLeaveToday: true,
    leads: true,
    workFromHomeToday: true,
    appreciations: true,
    workAnniversary: true,
    tickets: true,
    noticePeriodDuration: true,
    probationDate: true,
    internshipDate: true,
  });
  const [appreciation, setAppreciation] = useState([]);
  const [contractEndEmployees, setContractEndEmployees] = useState([]);

  const [filteredAppreciation, setFilteredAppreciation] = useState([]);
  const [probationEndEmployees, setProbationEndEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    currentDate: new Date().toLocaleDateString(),
    currentTime: new Date().toLocaleTimeString(),
    location: '',
    workingFrom: '',
    clockInTime: null,
    clockOutTime: null,
  });
  const [birthdays, setBirthdays] = useState([]);
  async function getEmpData() {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/allEmployee");
      setEmpData(response.data);
      filterBirthdays(response.data);
      filterAnniversaryEmployees(response.data);
      filterJoinedTodayEmployees(response.data);
      filterNoticePeriodEmployees(response.data);
      filterProbationEmployees(response.data);
      filterInternshipEndWithinMonth(response.data);
      filterContractEndEmployees(response.data);
    } catch (error) {
      console.log("data fetching failed", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/leaves");
      setLeaveData(response.data);
      filterCurrentDateLeaves(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'workingFrom' && value === 'Other') {
      setIsOtherLocation(true);
    } else if (name === 'workingFrom') {
      setIsOtherLocation(false);
    }
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/attendance/clock-in', {
      ...formData,
      clockInTime: new Date(),
    });
    setFormData({ ...formData, clockInTime: response.data.clockInTime });
  };

  const handleClockOut = async (e) => {
    e.preventDefault();
    const response = await axios.put(`/api/attendance/clock-out/${formData.id}`, {
      clockOutTime: new Date(),
    });
    setFormData({ ...formData, clockOutTime: response.data.clockOutTime });
  };

  const getAdmin = async () => {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/admin/data");
      if (!response.data || response.data.length === 0) {
        throw new Error('Failed to fetch data');
      }
      setAdmin(response.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAdmin();
    const intervalID = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);

  const formattedDateTime = {
    day: dateTime.toLocaleDateString(undefined, { weekday: 'long' }),
    time: dateTime.toLocaleTimeString()
  };

  const toggleSectionVisibility = (section) => {
    setSectionsVisibility({
      ...sectionsVisibility,
      [section]: !sectionsVisibility[section],
    });
  };


  async function getdata() {
    try {
      const noticeReponse = await axios.get("https://smarthrbackend-production.up.railway.app/notice");
      setNotice(noticeReponse.data);
    } catch (error) {
      console.log("data fetching failed", error);
    }
  }
  const fetchAppreciationData = async () => {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/appericiation");
      const data = response.data;
      filterAppreciationData(data);
    } catch (error) {
      console.error("Data fetching failed", error);
    }
  };
  const filterProbationEmployees = (data) => {
    const today = new Date();
    const filteredEmployees = data.filter(employee => {
      const probationEndDate = new Date(employee.provision_End_Date);
      return probationEndDate >= today;
    });
    setProbationEndEmployees(filteredEmployees);
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



  const fetchEmployeesWorkingFromHome = async () => {
    try {
      const response = await axios.get('https://smarthrbackend-production.up.railway.app/clockAttendance/clock-in');
      const employees = response.data;
      const homeWorkers = employees.filter(employee => employee.workingFrom === 'Home');

      setWorkinHome(homeWorkers);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setWorkinHome([]);
    }
  };

  useEffect(() => {
    fetchAppreciationData();
    fetchEmployeesWorkingFromHome();
  }, []);
  const filterNoticePeriodEmployees = (data) => {
    const today = new Date();
    const filteredEmployees = data.filter(employee => {
      const noticeStartDate = new Date(employee.notice_Period_Date);
      const noticeEndDate = new Date(employee.notice_Period_Enddate);
      return (
        today >= noticeStartDate &&
        today <= noticeEndDate
      );
    });
    setNoticePeriodEmployees(filteredEmployees);
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
  const filterContractEndEmployees = (data) => {
    const today = new Date();
    const filteredEmployees = data.filter(employee => {
      const contractEndDate = new Date(employee.contract_end_date);
      return contractEndDate >= today;
    });
    setContractEndEmployees(filteredEmployees);
  };

  const filterInternshipEndWithinMonth = (data) => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    const filteredEmployees = data.filter(employee => {
      const internshipEndDate = new Date(employee.internship_end_date);
      return internshipEndDate >= today && internshipEndDate <= oneMonthFromNow;
    });

    setInternshipEndEmployees(filteredEmployees);
  };

  function filterBirthdays(data) {
    const currentMonth = new Date().getMonth() + 1;
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
  const profileOnchange = (empId) => {
    navigate(`/admin/employee-profile/${empId}`, { state: { empId } });
  };
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    setFormData((prevData) => ({
      ...prevData,
      currentDate,
      currentTime,
    }));
  }, []);
  useEffect(() => {
    getdata();
  }, [])
  useEffect(() => {
    getEmpData();
  }, []);
  return (
    <div className="page-wrapper">
      <div className="content container-fluid pb-0">
        <div className="row p-2">
          <div className="col-md-12">
            <div className="page-head-box">
              <h3>Dashboard</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="admin-dashboard.html">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Private Dashboard</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="row p-2" >
          <div className="col">
            <h3>
              <b>Welcome {admin ? admin.adminName : 'Admin'}</b>
            </h3>
          </div>

          <div className="col">
            <div className="row">
              <div className="col text-end" style={{ fontWeight: 'bold' }}>
                <p>{formattedDateTime.time} <br /> {formattedDateTime.day}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 p-2">
          <div className="col-sm-6">
            {sectionsVisibility.profile && (
              <div className="card">
                <div className="row p-3">
                  <div className="col-sm-4">
                    <img src={`data:image/png;base64,${admin ? admin.fileData : 'Admin'}`} alt="" style={{ height: '100px', width: '100px' }} />
                  </div>
                  <div className="col-sm-8">
                    <h4>
                      <b>{admin ? admin.adminName : 'Admin Name'}</b>
                    </h4>
                    <h5>
                      <b>Junior</b>
                    </h5>
                    <h6>
                      <b>Emp Id : Emp-04</b>
                    </h6>
                  </div>
                </div>
                <hr />
                <div className="row p-2">
                  <div className="col">
                    <p>Open Tasks</p>
                    <b>7</b>
                  </div>
                  <div className="col">
                    <p>Projects</p>
                    <b>6</b>
                  </div>
                  <div className="col">
                    <p>Open Tickets</p>
                    <b>0</b>
                  </div>
                </div>
              </div>
            )}
            {sectionsVisibility.shiftSchedule && (
              <div className="">
                {/* <div className="row p-2">
                  <div className="col-sm-8 pt-2">
                    <h4>
                      <b>Shift Schedule</b>
                    </h4>
                  </div>
                  <div className="col-sm-4">
                    <button type="button" className='btn btn-primary'>Employee Shift</button>
                  </div>
                </div> */}
                {/* <div className="row pt-2">
                  <div className="col-sm-12">
                    <table className='table' style={{ width: '100%', fontSize: 'smaller' }}>
                      <tbody>
                        <tr>
                          <td>13-05-2024</td>
                          <td>Monday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>14-05-2024</td>
                          <td>Tuesday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>15-05-2024</td>
                          <td>Wednesday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>16-05-2024</td>
                          <td>Thursday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>16-05-2024</td>
                          <td>Friday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>16-05-2024</td>
                          <td>SaturDay</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                        <tr>
                          <td>16-05-2024</td>
                          <td>Sunday</td>
                          <td>General Shift</td>
                          <td>This is default shift</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>
            )}
            {sectionsVisibility.birthdays && (
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
                                <p onClick={() => profileOnchange(employee.empId)} style={{ cursor: 'pointer', fontSize: 'smaller' }}><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '50%', height: '30px', width: '30px' }} alt="" /> &nbsp; <b>{employee.empName}</b></p>

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
            )}
            {sectionsVisibility.appreciations && (
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
                            <div className="col text-start" onClick={() => profileOnchange(item.employee.empId)} >
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

            )}
            {sectionsVisibility.onLeaveToday && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>On Leave Today</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {currentLeaveEmployees && currentLeaveEmployees.length > 0 ? (
                        currentLeaveEmployees.map(leaveData => (
                          <div className="row" key={leaveData.leaveId}>
                            <div className="col pt-1 text-start">
                              <p onClick={() => profileOnchange(leaveData.employee.empId)}
                                style={{ cursor: 'pointer', fontSize: 'smaller' }}>
                                {console.log(leaveData.employee.imageData)}
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
            )}
            {sectionsVisibility.workFromHomeToday && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>On Work From Home Today</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    {workingHome.length > 0 ? (
                      workingHome.map(workingHome => (
                        <div key={workingHome.id} className="row mt-2 overflow-y" style={{ fontSize: 'smaller' }}>
                          <div className="col text-start">
                            <p onClick={() => profileOnchange(workingHome.employee.empId)} style={{ cursor: 'pointer' }}>
                              <img
                                src={`data:image/png;base64,${workingHome.employee.imageData}`}
                                alt={workingHome.employee.empName}
                                style={{ borderRadius: '15px', height: '30px', width: '30px' }}
                              />
                              &nbsp;
                              <b>{workingHome.employee.empName}</b>
                            </p>
                          </div>
                          <div className="col">
                            <i className="fa fa-home p-2 bg-primary text-white"></i>
                          </div>
                          <div className="col text-end p-1">
                            <p><b>{workingHome.workingFrom}</b></p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col">
                        <i className='fa fa-list'></i>
                        <p>- No record found. -</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
            {sectionsVisibility.workAnniversary && (
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
                                <p onClick={() => profileOnchange(employee.empId)} style={{ cursor: 'pointer' }}><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '15px', height: '30px', width: '30px' }} /> &nbsp; <b>{employee.empName}</b></p>
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
            )}
            {sectionsVisibility.noticePeriodDuration && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>Notice Period Duration</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {noticePeriodEmployees.length > 0 ? (
                        noticePeriodEmployees.map(employee => (
                          <div className="row" style={{ fontSize: 'smaller' }}>
                            <div className="col text-start">
                              <p onClick={() => profileOnchange(employee.empId)} style={{ cursor: 'pointer' }}><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '15px', height: '30px', width: '30px' }} /> &nbsp; <b>{employee.empName}</b></p>
                            </div>
                            <div className="col pt-2 text-end">
                              <p><b>{employee.notice_Period_Date} -  {employee.notice_Period_Enddate}</b></p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <i className='fa fa-list'></i>
                          <p>- No employees in notice period. -</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {sectionsVisibility.probationDate && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>Probation Date</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {probationEndEmployees.length > 0 ? (
                        probationEndEmployees.map(employee => (
                          <div className="row" key={employee.employeeId} style={{ fontSize: 'smaller' }}>
                            <div className="col text-start">

                              <p onClick={() => profileOnchange(employee.empId)} style={{ cursor: 'pointer' }}><img src={`data:image/png;base64,${employee.imageData}`} style={{ borderRadius: '15px', height: '30px', width: '30px' }} /> &nbsp; <b>{employee.empName}</b></p>

                            </div>
                            <div className="col text-end p-1">
                              <strong>Probation End Date: {employee.provision_End_Date}</strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <i className='fa fa-list'></i>
                          <p>- No employees ending probation today. -</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {sectionsVisibility.internshipDate && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>Internship Date</b><hr />
                  </h4>
                  <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                    <div className="col">
                      {internshipEndEmployees.length > 0 ? (
                        internshipEndEmployees.map(employee => (
                          <div className="row" key={employee.employeeId} style={{ fontSize: 'smaller' }}>
                            <div className="col text-start">
                              <p
                                onClick={() => profileOnchange(employee.empId)}
                                style={{ cursor: 'pointer' }}
                              >
                                <img
                                  src={`data:image/png;base64,${employee.imageData}`}
                                  style={{ borderRadius: '15px', height: '30px', width: '30px' }}
                                  alt={`${employee.empName}'s profile`}
                                />
                                &nbsp;
                                <b>{employee.empName}</b>
                              </p>
                            </div>
                            <div className="col text-end p-1">
                              <strong>Internship End Date: {new Date(employee.internship_end_date).toLocaleDateString()}</strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <i className='fa fa-list'></i>
                          <p>- No employees ending their internship within the next month. -</p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            )}
            {sectionsVisibility.contractDate && (
              <div className="card">
                <div className="row p-2">
                  <h4>
                    <b>Contract Date</b><hr />
                  </h4>
                  {contractEndEmployees.length === 0 ? (
                    <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                      <div className="col">
                        <i className='fa fa-list' style={{ fontSize: '24px', marginBottom: '10px' }}></i>
                        <p style={{ margin: '0' }}>- No records found. -</p>
                      </div>
                    </div>
                  ) : (
                    contractEndEmployees.map(contract => (
                      <div className="row" style={{ fontSize: 'smaller', color: 'gray' }}>
                        <div className="col text-start">
                          <p
                            onClick={() => profileOnchange(contract.empId)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={`data:image/png;base64,${contract.imageData}`}
                              style={{ borderRadius: '15px', height: '30px', width: '30px' }}
                              alt={`${contract.empName}'s profile`}
                            />
                            &nbsp;
                            <b>{contract.empName}</b>
                          </p>
                        </div>
                        <div className="col text-end p-1">
                          <strong>Contract End Date: {contract.contract_end_date}</strong>
                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
            )}
          </div>
          <div className="col-sm-6">
            <div className="row ">
              <div className="col-sm-6">
                {sectionsVisibility.tasks && (
                  <div className="card p-3">
                    <h4>
                      <b>Tasks</b><hr />
                    </h4>
                    <div className="row">
                      <div className="col">
                        <b>7</b>
                        <p>Pending</p>
                      </div>
                      <div className="col">
                        <b>6</b>
                        <p>Overdue</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                {sectionsVisibility.projects && (
                  <div className="card">
                    <div className="row p-2">
                      <h4>
                        <b>Projects</b><hr />
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
                )}
              </div>
            </div>
            {sectionsVisibility.weekTimelogs && (
              <div className="card">
                <div className="row p-2">
                  <div className="col">
                    <h4><b>Week Timelogs</b><hr /></h4>
                    <div className='row text-center d-flex align-items-center justify-content-center' style={{ color: 'gray', fontSize: '15px', height: '100%' }}>
                      <div className="col pb-4">
                        <i className='fa fa-list'></i>
                        <p>- No record found. -</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
            {sectionsVisibility.myTasks && (
              <div className="card">
                <div className="row p-2">
                  <h4><b>My Tasks</b><hr /></h4>
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
            )}
            {sectionsVisibility.tickets && (
              <div className="card">
                <div className="row p-2">
                  <h4><b>Tickets</b><hr /></h4>
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
            )}
            {sectionsVisibility.myCalendar && (
              <div className="row">
                <div className="col">
                  <div className="card" style={{width:'100%'}}>
                    <AdminMyCalender  />
                  </div>
                </div>
              </div>

            )}
            {sectionsVisibility.notices && (
              <div className="card">
                <div className="row p-2">
                  <h4><b>Notices</b><hr /></h4>
                  <div className="col">
                    <div className='row'>
                      <div className="col">
                        {notice.map(item => (
                          <div className="row" style={{ fontSize: 'smaller' }}>
                            <div className="col-sm-4">
                              <b>{item.date}</b>
                            </div>
                            <div className="col">
                              <b className='pt-4' dangerouslySetInnerHTML={{ __html: item.noticeDetails }}></b>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div >
  );
}

export default AdminPrivateDashboard;
