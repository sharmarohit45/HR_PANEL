import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';

const ClientContractsSection = () => {
    const [rows, setRows] = useState([]);
    const email = localStorage.getItem('email');
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/contract");
            const filteredContracts = response.data.filter((item) => item.client.email === email);
            setRows(filteredContracts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleProfileChange = (contractId) => {
        navigate(`/client/contracts-invoice/${contractId}`, { state: { contractId } });
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Contracts</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Contracts</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                    <div className="row">
                            <div className="col-sm-12">
                                <div className="card" style={{ minHeight: '500px' }}>
                                    <DataGrid
                                        columns={[
                                            { field: 'id', headerName: 'id', hideable: false, width: 100 },
                                            { field: 'subject', headerName: 'Subject', hideable: false, width: 150 },
                                            { field: 'client', headerName: 'Client', hideable: false, width: 150 },
                                            { field: 'project', headerName: 'Project', hideable: false, width: 150 },
                                            {
                                                field: 'Amount', headerName: 'Amount', hideable: false, width: 110
                                            },
                                            {
                                                field: 'startdate', headerName: 'Start Date', hideable: false, width: 150
                                            },
                                            {
                                                field: 'enddate', headerName: 'End Date', hideable: false, width: 150
                                            },
                                            {
                                                field: 'action', headerName: 'Action', width: 150, renderCell: (params) => (
                                                    <div>
                                                        <MoreVertIcon className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                                                        <ul className="dropdown-menu btn" aria-labelledby="dropdownMenuLink" style={{ fontSize: 'smaller' }}>
                                                            <li onClick={() => handleProfileChange(params.row.contractId)}><a className="dropdown-item"><i className="fa fa-eye"></i> View</a></li>
                                                        </ul>
                                                    </div>
                                                )
                                            },
                                        ]}
                                        rows={rows.map(row => ({
                                            id: row.contractId,
                                            contractId: row.contractId,
                                            subject: row.subject,
                                            client: row.client.clientName,
                                            project: row.project,
                                            Amount: row.contractValue,
                                            startdate: row.startDate,
                                            enddate: row.endDate,
                                            imageData: row.client.imageProfileData,
                                            action: row.action
                                        }))
                                        }
                                        slots={{
                                            toolbar: GridToolbar,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default ClientContractsSection;
