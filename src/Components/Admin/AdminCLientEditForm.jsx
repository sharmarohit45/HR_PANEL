import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const AdminCLientEditForm = () => {
    const initialFormData = {
        salutation: '',
        clientName: '',
        email: '',
        clientProfileImage: null,
        password: '',
        country: '',
        mobileNo: '',
        gender: '',
        changeLanguage: '',
        clientCategory: '',
        clientSubCategory: '',
        companyName: '',
        officialWebsite: '',
        loginAllowed: '',
        emailNotificationAllowed: '',
        taxName: '',
        gstVatNumber: '',
        officeNumber: '',
        city: '',
        state: '',
        postalCode: '',
        addedBy: '',
        companyAddress: '',
        shoppingAddress: '',
        note: '',
        clientLogo: null,
        role: 'Client'
    };
    const location = useLocation();
    const empId = location.state ? location.state.empId : null;
    const [formData, setFormData] = useState(initialFormData);
    const [data, setData] = useState(null);
    const [imageProfileURL, setImageProfileURL] = useState(null);
    const [imagelogoURL, setImageLogoURL] = useState(null);

    useEffect(() => {
        if (empId) {
            getClientData();
        }
    }, [empId]);


    const getClientData = async () => {
        try {
            const response = await axios.get(`https://smarthrbackend-production.up.railway.app/client/${empId}`);
            setData(response.data);
            console.log('jfhdj==',response.data)
            if (response.data.imageProfileData) {
                const blob = new Blob([new Uint8Array(atob(response.data.imageProfileData).split("").map(char => char.charCodeAt(0)))], { type: "image/jpeg" });
                const blobkkk = new Blob([new Uint8Array(atob(response.data.imageLogoData).split("").map(char => char.charCodeAt(0)))], { type: "image/jpeg" });
                setImageProfileURL(URL.createObjectURL(blob));
                setImageLogoURL(URL.createObjectURL(blobkkk))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (data) {
            setFormData({
                salutation: data.salutation || '',
                clientName: data.clientName || '',
                email: data.email || '',
                file: data.imageData ? `data:image/jpeg;base64,${data.imageData}` : null,
                password: '',
                designation: data.designation || '',
                department: data.department || '',
                country: data.country || '',
                mobileNo: data.mobileNo || '',
                gender: data.gender || '',
                joiningDate: data.joiningDate || '',
                dateOfBirth: data.dateOfBirth || '',
                reportingTo: data.reportingTo || '',
                language: data.language || '',
                empUserRole: data.emp_User_Name || '',
                address: data.address || '',
                about: data.about || '',
                login_Allowed: data.login_Allowed || '',
                email_Notification: data.email_Notification || '',
                hourly_Rate: data.hourly_Rate || '',
                slack_Member_Id: data.slack_Member_Id || '',
                skills: data.skills || '',
                provision_End_Date: data.provision_End_Date || '',
                notice_Period_Date: data.notice_Period_Date || '',
                notice_Period_Enddate: data.notice_Period_Enddate || '',
                employement_Type: data.employement_Type || '',
                maritial_State: data.maritial_State || '',
                exit_date: data.exit_date || '',
                role: data.role || 'Employee'
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            const response = await axios.post('https://smarthrbackend-production.up.railway.app/client', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Client Add Successfully");
            setFormData(initialFormData);
        } catch (error) {
            console.error('There was an error', error);
            toast.success("Failed");
        }
    };

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
        setFormData({
            ...formData,
            note: JSON.stringify(convertToRaw(state.getCurrentContent()))
        });
    };

    const uploadImageCallBack = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({ data: { link: event.target.result } });
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };
  return (
    <>
     <div className="page-wrapper">
     <div className="content container-fluid pb-0">
    <div className="card">
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-12">
                    <h3><b>Account Details</b></h3><hr />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label>Salutation</label>
                    <select className="form-select" name="salutation" value={formData.salutation} onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Sir">Sir</option>
                        <option value="Madam">Madam</option>
                    </select>
                </div>
                <div className="col">
                    <label>Client Name</label>
                    <input type="text" name="clientName" onChange={handleChange} value={formData.clientName} className='form-control' />
                </div>
                <div className="col">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} className='form-control' />
                </div>
                <div className="col">
                    <label>Profile Picture</label>
                    <input type="file" name="clientProfileImage" onChange={handleChange} className='form-control' />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} value={formData.password} className='form-control' />
                </div>
                <div className="col">
                    <label>Country</label>
                    <input type="text" name="country" onChange={handleChange} value={formData.country} className='form-control' />
                </div>
                <div className="col">
                    <label>Mobile</label>
                    <input type="text" name="mobileNo" onChange={handleChange} value={formData.mobileNo} className='form-control' />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Gender</label>
                    <select className="form-select" name='gender' value={formData.gender} onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="col">
                    <label>Change Language</label>
                    <input type="text" name="changeLanguage" onChange={handleChange} value={formData.changeLanguage} className='form-control' />
                </div>
                <div className="col">
                    <label>Client Category</label>
                    <input type="text" name="clientCategory" onChange={handleChange} value={formData.clientCategory} className='form-control' />
                </div>
                <div className="col">
                    <label>Client Sub Category</label>
                    <input type="text" name="clientSubCategory" onChange={handleChange} value={formData.clientSubCategory} className='form-control' />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Login allowed?</label><br />
                    <input type="radio" name="loginAllowed" value="Yes" checked={formData.loginAllowed === 'Yes'} onChange={handleChange} /> Yes &nbsp;
                    <input type="radio" name="loginAllowed" value="No" checked={formData.loginAllowed === 'No'} onChange={handleChange} /> No
                </div>
                <div className="col">
                    <label>Receive email notifications?</label><br />
                    <input type="radio" name="emailNotificationAllowed" value="Yes" checked={formData.emailNotificationAllowed === 'Yes'} onChange={handleChange} /> Yes &nbsp;
                    <input type="radio" name="emailNotificationAllowed" value="No" checked={formData.emailNotificationAllowed === 'No'} onChange={handleChange} /> No
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-12" style={{ padding: '20px' }}>
                    <h3>Company Details</h3>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Company Name</label>
                    <input type="text" name="companyName" onChange={handleChange} value={formData.companyName} className='form-control' placeholder="e.g. Acme Corporation" />
                </div>
                <div className="col">
                    <label>Official Website</label>
                    <input type="text" name="officialWebsite" onChange={handleChange} value={formData.officialWebsite} className='form-control' placeholder="e.g. https://www.example.com" />
                </div>
                <div className="col">
                    <label>Tax Name</label>
                    <input type="text" name="taxName" onChange={handleChange} value={formData.taxName} className='form-control' placeholder="e.g. GST/VAT" />
                </div>
                <div className="col">
                    <label>GST/VAT Number</label>
                    <input type="text" name="gstVatNumber" onChange={handleChange} value={formData.gstVatNumber} className='form-control' placeholder="e.g. 18AABCU960XXXXX" />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Office Phone Number</label>
                    <input type="text" name="officeNumber" onChange={handleChange} value={formData.officeNumber} className='form-control' placeholder="e.g. +19876543" />
                </div>
                <div className="col">
                    <label>City</label>
                    <input type="text" name="city" onChange={handleChange} value={formData.city} className='form-control' placeholder="e.g. New York, Jaipur, Dubai" />
                </div>
                <div className="col">
                    <label>State</label>
                    <input type="text" name="state" onChange={handleChange} value={formData.state} className='form-control' placeholder="e.g. California, Rajasthan, Dubai" />
                </div>
                <div className="col">
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" onChange={handleChange} value={formData.postalCode} className='form-control' placeholder="e.g. 90250" />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Added By</label>
                    <select className="form-select" name="addedBy" value={formData.addedBy} onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Raj">Raj Rastogi</option>
                        <option value="Ramesh">Ramesh Singh</option>
                        <option value="Shweta">Shweta Mishra</option>
                    </select>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Company Address</label>
                    <textarea name="companyAddress" onChange={handleChange} value={formData.companyAddress} className='form-control'></textarea>
                </div>
                <div className="col">
                    <label>Shopping Address</label>
                    <textarea name="shoppingAddress" onChange={handleChange} value={formData.shoppingAddress} className='form-control'></textarea>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Note</label>
                    <div className="card">
                        <Editor name="note"
                            editorState={editorState}
                            onEditorStateChange={handleEditorChange}
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
                                inline: {
                                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                                },
                                list: {
                                    options: ['unordered', 'ordered'],
                                },
                                textAlign: {
                                    options: ['left', 'center', 'right', 'justify'],
                                },
                                image: {
                                    uploadEnabled: true,
                                    uploadCallback: uploadImageCallBack,
                                    alt: { present: true, mandatory: false },
                                    defaultSize: {
                                        height: 'auto',
                                        width: 'auto',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <label>Company Logo</label>
                    <input type="file" name="clientLogo" onChange={handleChange} className='form-control' />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <button type="submit" className='btn btn-white'><CheckIcon /> Save</button>
                            &nbsp;
                            <button type="button" className='btn btn-white'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <ToastContainer />
    </div>
    </div>
    </div>
</>
  )
}

export default AdminCLientEditForm