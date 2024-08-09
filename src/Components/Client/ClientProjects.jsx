import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PushPinIcon from '@mui/icons-material/PushPin';
import ListIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

function ClientProjects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('email'); // Assuming this is the client's email

  async function getData() {
    try {
      const response = await axios.get("https://smarthrbackend-production.up.railway.app/getallProject");
      const projects = response.data;

      // Filter projects where the client's email matches
      const filteredProjects = projects.filter(project => 
        project.client && project.client.email === email
      );

      setRows(filteredProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* <!-- Page Header --> */}
          <div className="row">
            <div className="col-md-12">
              <div className="page-head-box">
                <h3>Projects</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">Dashboard</li>
                    <li className="breadcrumb-item active" aria-current="page">Projects</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ minHeight: '600px' }}>
                <DataGrid
                  columns={[
                    { field: 'id', headerName: 'ID', hideable: false, width: 100 },
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
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px', paddingTop: '10px' }}>
                                  {member.imageData ? (
                                    <img
                                      src={`data:image/png;base64,${member.imageData}`}
                                      alt={`Image of ${member.empName}`}
                                      style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                                    />
                                  ) : (
                                    <div style={{ height: '30px', width: '30px', borderRadius: '50%', backgroundColor: '#ccc' }} />
                                  )}
                                </div>
                              ))
                            ) : (
                              <span>No Members</span>
                            )}
                          </div>
                        );
                      }
                    },
                    { field: 'startDate', headerName: 'Start Date', hideable: false, width: 150 },
                    { field: 'deadline', headerName: 'Deadline', hideable: false, width: 150 },
                    {
                      field: 'client',
                      headerName: 'Client',
                      hideable: false,
                      width: 200,
                      renderCell: (params) => {
                        const { clientName, imageProfileData } = params.value || {};
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            {imageProfileData ? (
                              <img
                                src={`data:image/png;base64,${imageProfileData}`}
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
                    },
                    {
                      field: 'status', headerName: 'Status', hideable: false, width: 150,
                    },
                    {
                      field: 'action', headerName: 'Action', width: 190, renderCell: (params) => (
                        <div>
                          <MoreVertIcon style={{ fontSize: '20px' }} className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                          <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                            <li><a className="dropdown-item" ><i className="fa fa-eye"></i> View</a></li>
                          </ul>
                        </div>
                      )
                    },
                  ]}
                  rows={rows.map(row => ({
                    id: row.id,
                    projectId: row.id,
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
                    status: row.status,
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

        </div>
      </div>
    </>
  );
}

export default ClientProjects;
