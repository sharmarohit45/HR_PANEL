import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.core.css';

import { toast, ToastContainer } from 'react-toastify';

const AdminAddAppreciation = () => {
    const [award, setAward] = useState('');
    const [givenTo, setGivenTo] = useState('');
    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');
    const [photo, setPhoto] = useState(null);
    const [awardsOptions, setAwardsOptions] = useState([]);
    const [recipientsOptions, setRecipientsOptions] = useState([]);

    async function getData() {
        try {
            const awardResponse = await axios.get("https://smarthrbackend-production.up.railway.app/award");
            setAwardsOptions(awardResponse.data);
            const response = await axios.get("https://smarthrbackend-production.up.railway.app/allEmployee");
            setRecipientsOptions(response.data);
        } catch (error) {
            console.log("Data fetching failed", error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

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

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let fileData = '';
        if (photo) {
            fileData = await convertToBase64(photo);
        }

        const formData = {
            awardIId: award,
            employeesId: givenTo,
            givenDate: date,
            awardSummary: summary,
            fileData: fileData.split(',')[1],
        };

        try {
            const response = await axios.post('https://smarthrbackend-production.up.railway.app/appericiation', formData);
            toast.success("Data Send Successfully");
        } catch (error) {
            console.log('Error submitting data', error);
            toast.error("Data Send Failed");
        }
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <h3>Add Appreciation</h3>
                        </div>
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="award">Award</label>
                                <div className="input-group">
                                    <select name="award" id="award" className='form-select input-text' value={award} onChange={(e) => setAward(e.target.value)}>
                                        <option value="">--</option>
                                        {awardsOptions.map(option => (
                                            <option key={option.awardId} value={option.awardId}>{option.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <label htmlFor="givenTo">Given To</label>
                                <select name="givenTo" id="givenTo" className='form-select' value={givenTo} onChange={(e) => setGivenTo(e.target.value)}>
                                    <option value="">--</option>
                                    {recipientsOptions.map(option => (
                                        <option className='pt-2' key={option.empId} value={option.empId}>
                                            <p>
                                                <img src={`data:image/png;base64,${option.imageData}`} style={{ height: '30px', width: '30px', marginRight: '10px', borderRadius: '50%' }} alt="employee" />
                                                &nbsp;{option.empName}
                                            </p>
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="date">Date</label>
                                <input type="date" name="date" id="date" className='form-control' value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="summary">Summary</label>
                                <ReactQuill
                                    value={summary}
                                    onChange={setSummary}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="photo">Photo</label>
                                <input type="file" className='form-control' onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <button type="submit" className='btn btn-white'><i className='fa fa-check'></i> Save</button> &nbsp;
                                <button type="button" className='btn btn-white'>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default AdminAddAppreciation;
