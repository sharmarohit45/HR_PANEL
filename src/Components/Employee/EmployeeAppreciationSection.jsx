import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios'; // Import axios for making HTTP requests

const EmployeeAppreciationSection = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://smarthrbackend-production.up.railway.app/appericiation');
                if (response.status === 200) {
                    setRows(response.data);
                }
            } catch (error) {
                console.error('Error fetching employee appreciation data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid pb-0">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-head-box">
                                <h3>Appreciation</h3>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/employee">Dashboard</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Appreciation</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <DataGrid
                                    columns={[
                                        // { field: 'id', headerName: 'ID', width: 100 },
                                        {
                                            field: 'givenTo',
                                            headerName: 'Given To',
                                            width: 370,
                                            renderCell: (params) => (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={`data:image/png;base64,${params.row.imageData}`}
                                                        alt={params.row.givenTo}
                                                        style={{ height: '30px', width: '30px', marginRight: '10px', borderRadius: '50%' }}
                                                    />
                                                    {params.row.givenTo}
                                                </div>
                                            ),
                                        },
                                        { field: 'awardName', headerName: 'Award Name', width: 390 },
                                        { field: 'givenOn', headerName: 'Given On', width: 240 },
                                    ]}
                                    rows={rows.map(item => ({
                                        id: item.id,
                                        givenTo: item.employee.empName,
                                        imageData: item.employee.imageData,
                                        awardName: item.awardList.title,
                                        givenOn: item.givenDate
                                    }))}
                                    components={{ Toolbar: GridToolbar }}
                                    checkboxSelection
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeAppreciationSection;