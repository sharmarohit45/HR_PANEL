import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.core.css';

import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminAddProjectForm = ({ onProject }) => {
    const [editorData, setEditorData] = useState('');
    const [projectNotes, setprojectNotes] = useState('');
    const [showDeadline, setShowDeadline] = useState(true);
    const [showFeild, setShowFeild] = useState(true);
    const [selectedemployee, setSelectedemployee] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [clientSingle, setClientSingle] = useState(null);
    const [EmployeeIds, setEmployeeIds] = useState();
    const [ClientId, setClientId] = useState('');
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        projectName: '',
        startDate: '',
        deadline: '',
        projectCategory: '',
        department: '',
        projectSummery: '',
        projectNotes: '',
        currency: '',
        budget: '',
        hoursEstimate: '',
        allowmanualtimelogs: false,
        miroBoard: '',
        canaccessmiro: false,
        sendTaskNotification: false,
        addfile: null
    });

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                addfile: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleEditorChange = (value) => {
        setEditorData(value);
    };

    const projectNotesChange = (value) => {
        setprojectNotes(value);
    };

    const handleCheckboxChange = () => {
        setShowDeadline(!showDeadline);
    };

    const fieldChange = () => {
        setShowFeild(!showFeild);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key !== 'employeeIds' && key !== 'addfile') {
                data.append(key, formData[key]);
            }
        }
        if (EmployeeIds) {
            const result = EmployeeIds.join(',');
            data.append('employeeIds', result)
        }
        if (ClientId) {
            data.append('ClientIId', ClientId);
        }

        if (formData.addfile) {
            data.append('addfile', formData.addfile);
        }


        try {
            const response = await axios.post('https://smarthrbackend-production.up.railway.app/createNewProject', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                }
            });
            toast.success("Project Add Successfully");
            onProject();
        } catch (error) {
            console.error('There was an error', error);
            toast.error("Failed")
        }
    };



    async function getEmployee() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/allEmployee");
            if (response.data) {
                setEmployeeData(response.data);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    }

    async function getClient() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/allclient");
            if (response.data) {
                setClientData(response.data);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    }

    async function deptData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/departments");
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    }
    useEffect(() => {
        getEmployee();
        getClient();
        deptData();
    }, []);

    const handleFilmsChange = (event, value) => {
        let selectedIds = value.map(employee => employee.empId);
        setSelectedemployee(value);
        setEmployeeIds(selectedIds);
    };

    const handleClient = (event, value) => {
        setClientSingle(value);
        setClientId(value.clientId);
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="row mb-2">
                        <div className="col">
                            <h2>Project Details</h2>
                        </div>
                    </div><hr />
                    <div className="row">
                        <div className="col">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="subject">Short Code</label>
                                            <input type="text" name="code" value={formData.code} onChange={handleChange} className="form-control" placeholder="Project unique short code" />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="subject">Project Name</label>
                                            <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="project name" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="">Start Date</label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className='form-control' />
                                    </div>
                                    {showDeadline && (
                                        <>
                                            <div className="col">
                                                <label htmlFor="">Deadline</label>
                                                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className='form-control' />
                                            </div>
                                        </>
                                    )}
                                    <div className="col pt-2">
                                        <label htmlFor=""></label><br />
                                        <input type="checkbox" onChange={handleCheckboxChange} checked={showDeadline} className="form-check-input" /> There is no project deadline
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="">Project Category</label>
                                        <div className="input-group">
                                            <input type="text" name="projectCategory" value={formData.projectCategory} onChange={handleChange} className="form-control" placeholder="" aria-label="" aria-describedby="btnGroupAddon" />
                                            <div className="input-group-text" id="btnGroupAddon" style={{ cursor: 'pointer' }}>Add</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="">Department</label>
                                        <select id="" name="department" value={formData.department} onChange={handleChange} className='form-select'>
                                            <option value="">--</option>
                                            {data && data.map((item, index) => (
                                                <option key={index} value={item.departmentName}>{item.departmentName}</option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="">Client</label>
                                        <Autocomplete
                                            sx={{ width: 300 }}
                                            options={clientData}
                                            autoHighlight
                                            value={clientSingle}
                                            onChange={handleClient}
                                            getOptionLabel={(option) => `${option.clientName}`}
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    <img
                                                        src={`data:image/png;base64,${option.imageLogoData}`}
                                                        style={{ height: '30px', width: '30px', marginRight: '10px', borderRadius: '50%' }}
                                                        alt="Profile"
                                                    />
                                                    {option.clientName}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select Client"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="editor">Project Summary</label>
                                            <ReactQuill
                                                value={editorData}
                                                onChange={handleEditorChange}
                                                theme="snow"
                                                modules={modules}
                                                formats={formats}

                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="editor">Notes</label>
                                            <ReactQuill
                                                value={projectNotes}
                                                onChange={projectNotesChange}
                                                theme="snow"
                                                modules={modules}
                                                formats={formats}

                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor=""></label><br />
                                        <input type="checkbox" className="form-check-input" onChange={fieldChange} checked={!showFeild} /> Create Public Project
                                    </div>
                                </div>
                                {showFeild && (
                                    <>
                                        <div className="row mt-2 mb-2">
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col-10">
                                                        <Autocomplete
                                                            multiple
                                                            options={employeeData}
                                                            getOptionLabel={(option) => option.empName}
                                                            value={selectedemployee}
                                                            onChange={handleFilmsChange}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Add Project Members"
                                                                    placeholder="Add Project Members"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-2 pt-2">
                                                        <button type='button' className='btn btn-white'>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <h2 style={{ textDecoration: 'none' }} data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                            <i className='fa fa-angle-down'></i> Other Details
                                        </h2>
                                        <div className="collapse" id="collapseExample">
                                            <div className="row mt-3 mb-3">
                                                <div className="col">
                                                    <label htmlFor="">Add File</label>
                                                    <input type="file" name="addfile" onChange={handleChange} className='form-control' />
                                                </div>
                                            </div>
                                            <div className="row mt-3 mb-3">
                                                <div className="col">
                                                    <label htmlFor="">Currency</label>
                                                    <input type="text" name="currency" value={formData.currency} onChange={handleChange} className='form-control' />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor="">Project Budget</label>
                                                    <input type="text" name="budget" value={formData.budget} onChange={handleChange} className='form-control' />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor="">Hours Estimate (In Hours)</label>
                                                    <input type="text" name="hoursEstimate" value={formData.hoursEstimate} onChange={handleChange} className='form-control' />
                                                </div>
                                            </div>
                                            <div className="row mt-3 mb-3">
                                                <div className="col"><input type="checkbox" name="" id="" className="form-check-input" /> Allow manual time logs</div>
                                                <div className="col"><input type="checkbox" name="allowmanualtimelogs" id="" className="form-check-input" onChange={fieldChange} checked={showFeild} /> Enable Miroboard</div>
                                                {showFeild && (
                                                    <>
                                                        <div className="col">
                                                            <label htmlFor="">Miro Board ID </label>
                                                            <input type="text" name="miroBoard" value={formData.miroBoard} onChange={handleChange} className='form-control' id="" />
                                                        </div>
                                                        <div className="col">
                                                            <input type="checkbox" name="" id="" />Client can access miro
                                                        </div>
                                                    </>
                                                )}

                                                <div className="col"><input type="checkbox" name="" id="" className="form-check-input" /> Send task notification to client</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-2 mb-0">
                                    <div className="row mb-3">
                                        <div className="col">
                                            <button type="submit" className="btn btn-white"><span>Submit</span></button> &nbsp;
                                            <button type="reset" className="btn btn-white" data-bs-dismiss="offcanvas"><span>Cancel</span></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default AdminAddProjectForm;

