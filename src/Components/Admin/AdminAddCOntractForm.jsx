import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.core.css';
import { toast, ToastContainer } from 'react-toastify';

const AdminAddContractForm = ({contractData}) => {
    const [editorData, setEditorData] = useState('');
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    const [project, setProject] = useState([]);
    const [formData, setFormData] = useState({
        contractNumber: '',
        subject: '',
        project: '',
        description: '',
        startDate: '',
        endDate: '',
        contractType: '',
        contractValue: '',
        currency: '',
        clientIId: '',
        cell: '',
        officePhoneNumber: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        alternateAddress: '',
        notes: '',
    });

    function visibility() {
        setVisible(!visible);
    }

    const handleEditorChange = (value) => {
        setEditorData(value);
        setFormData({ ...formData, description: value });
    };

    async function getData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/allclient");
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function getProjectData() {
        try {
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/getallProject");
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        getData();
        getProjectData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://smarthrbackend-production.up.railway.app/contract', formData);
            toast.success('Form submitted successfully');
            contractData();
            setFormData({
                contractNumber: '',
                subject: '',
                project: '',
                description: '',
                startDate: '',
                endDate: '',
                contractType: '',
                contractValue: '',
                currency: '',
                clientIId: '',
                cell: '',
                officePhoneNumber: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
                alternateAddress: '',
                notes: '',
            });
            setEditorData('');
            setVisible(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error submitting form. Please try again.');
        }
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
        <div className="row">
            {console.log("data", data)}
            <div className="col">
                <div className="card">
                    <div className="row">
                        <div className="col">
                            <h3>Contract Details</h3>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label htmlFor="contractNumber">Contract Number</label>
                                            <input type="text" id="contractNumber" name="contractNumber" placeholder="Add contract number" className="form-control" value={formData.contractNumber} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-8">
                                            <label htmlFor="subject">Subject</label>
                                            <input type="text" id="subject" name="subject" placeholder="Add subject" className="form-control" value={formData.subject} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label htmlFor="project">Project</label>
                                            <select name="project" id="project" className="form-select" value={formData.project} onChange={handleChange}>
                                                <option value="">--</option>
                                                {project.map((row) => (
                                                    <option key={row.projectName} value={row.projectName}>
                                                        {row.projectName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editor">Description</label>
                                    <ReactQuill
                                        value={editorData}
                                        onChange={handleEditorChange}
                                        theme="snow"
                                        modules={modules}
                                        formats={formats}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="startDate">Start Date</label>
                                            <input type="date" name="startDate" id="startDate" className="form-control" value={formData.startDate} onChange={handleChange} />
                                        </div>
                                        {!visible && (
                                            <div className="col">
                                                <label htmlFor="endDate">End Date</label>
                                                <input type="date" name="endDate" id="endDate" className="form-control" value={formData.endDate} onChange={handleChange} />
                                            </div>
                                        )}
                                        <div className="col">
                                            <div className="form-check mt-4">
                                                <input className="form-check-input" type="checkbox" id="withoutDueDate" name="withoutDueDate" onClick={visibility} />
                                                <label className="form-check-label" htmlFor="withoutDueDate">
                                                    Without Due Date
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="contractType">Contract Type</label>
                                            <div className="input-group mb-3">
                                               <input type="text" className='form-control' id="contractType" name="contractType" value={formData.contractType} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="contractValue">Contract Value</label>
                                        <input type="number" name="contractValue" id="contractValue" min={0} className="form-control" value={formData.contractValue} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="currency">Currency</label>
                                        <input type="text" name="currency" id="currency" className="form-control" value={formData.currency} onChange={handleChange} />
                                    </div>
                                    <div className="col"></div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <h4><b>Client Details</b></h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="clientIId">Client</label>
                                        <select name="clientIId" id="clientIId" className="form-select" value={formData.clientIId} onChange={handleChange}>
                                            <option value="">--</option>
                                            {data && data.map((client, index) => (
                                                <option key={index} value={client.clientId}>{client.clientName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="cell">Cell</label>
                                        <input type="text" name="cell" id="cell" className="form-control" value={formData.cell} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="officePhoneNumber">Office Phone Number</label>
                                        <input type="text" name="officePhoneNumber" id="officePhoneNumber" className="form-control" value={formData.officePhoneNumber} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="city">City</label>
                                        <input type="text" name="city" id="city" className="form-control" value={formData.city} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="state">State</label>
                                        <input type="text" name="state" id="state" className="form-control" value={formData.state} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="country">Country</label>
                                        <input type="text" name="country" id="country" className="form-control" value={formData.country} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="postalCode">Postal Code</label>
                                        <input type="text" name="postalCode" id="postalCode" className="form-control" value={formData.postalCode} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="alternateAddress">Alternate Address</label>
                                        <textarea name="alternateAddress" id="alternateAddress" className='form-control' value={formData.alternateAddress} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="notes">Notes</label>
                                        <textarea name="notes" id="notes" className='form-control' value={formData.notes} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                                <div className="form-group mt-3 mb-3">
                                    <div className="row">
                                        <div className="col">
                                            <button type="submit" className="btn btn-white"><span>Submit</span></button> &nbsp;
                                            <button type="reset" className="btn btn-white" data-bs-dismiss="offcanvas"><span>Cancel</span></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>

    );
};

export default AdminAddContractForm;
