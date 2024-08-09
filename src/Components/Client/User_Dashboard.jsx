import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "axios";

function User_Dashboard() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const email = localStorage.getItem('email');

    async function getData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/getallProject");
            const projects = response.data;
            const filteredProjects = projects.filter(project => 
                project.client && project.client.email === email
            );
    
            setRows(filteredProjects);
            setTotalProjects(filteredProjects.length);
            setLoading(false);
            const labels = [
                "in progress",
                "not started",
                "on hold",
                "canceled",
                "finished"
            ];

            const statusCounts = labels.reduce((acc, label) => {
                acc[label] = 0;
                return acc;
            }, {});
    
            
            filteredProjects.forEach(project => {
                const status = project.status || "Unknown"; 
                if (statusCounts.hasOwnProperty(status)) {
                    statusCounts[status]++;
                } else {
                    statusCounts["Unknown"] = (statusCounts["Unknown"] || 0) + 1;
                }
            });
    
            // Convert the statusCounts object to array format for PieChart
            const pieChartData = Object.entries(statusCounts).map(([label, value], id) => ({
                id,
                label,
                value,
            }));
    
            setPieData(pieChartData);
    
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
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h4>Dashboard</h4>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div className="card">
                                <div className="row p-2">
                                    <div className='col-10'>
                                        <h4><b>Total Projects</b></h4>
                                        <p>{totalProjects}</p>
                                    </div>
                                    <div className="col-2">
                                        <i className="fas fa-layer-group" style={{ fontSize: '25px', paddingTop: '10px', color: 'gray' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card">
                                <div className="row p-2">
                                    <div className='col-10'>
                                        <h4><b>Unresolved Tickets</b></h4>
                                        <p>0</p>
                                    </div>
                                    <div className="col-2">
                                        <i className="fas fa-ticket-alt" style={{ fontSize: '25px', paddingTop: '10px', color: 'gray' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card">
                                <div className="row p-2">
                                    <div className='col-10'>
                                        <h4><b>Contract Signed</b></h4>
                                        <p>0</p>
                                    </div>
                                    <div className="col-2">
                                        <i className="fas fa-file-signature" style={{ fontSize: '25px', paddingTop: '10px', color: 'gray' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div className="card p-3">
                                <div className="row">
                                    <div className="col-sm-10">
                                        <h4><b>Invoices</b></h4>
                                        <div className="row">
                                            <div className="col-6">
                                                <h6><b>1</b></h6>
                                                <p>Paid Invoices</p>
                                            </div>
                                            <div className="col-6">
                                                <h6><b>2</b></h6>
                                                <p>Due Invoices</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <i className="fas fa-file-alt" style={{ fontSize: '25px', paddingTop: '10px', color: 'gray' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8"></div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="card p-5" style={{ height: '500px' }}>
                                <h4><b>Status wise Project</b></h4>
                                <div className="row p-5">
                                    <PieChart
                                        series={[
                                            {
                                                data: pieData,
                                            }
                                        ]}
                                        width={500}
                                        height={200}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-6"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default User_Dashboard;
