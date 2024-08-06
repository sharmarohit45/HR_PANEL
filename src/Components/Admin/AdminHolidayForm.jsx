import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Spinner from "react-activity/dist/Dots";
import "react-activity/dist/Dots.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminHolidayForm = ({holidayData}) => {
    const [holidays, setHolidays] = useState([]);
    const [department, setDepartment] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [employmentType, setEmploymentType] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const departmentResponse = await axios.get("https://smarthrbackend-production.up.railway.app/departments");
            setDepartment(departmentResponse.data);
            const designationResponse = await axios.get("https://smarthrbackend-production.up.railway.app/designations");
            setDesignation(designationResponse.data);
        } catch (error) {
            console.log("Data fetching failed", error);
        }
    }

    const handleAddRow = () => {
        console.log('holiDay', holidays)
        setHolidays([...holidays, { date: '', occasion: '' }]);
    };

    const handleRemoveRow = (index) => {
        const newHolidays = holidays.filter((_, i) => i !== index);
        setHolidays(newHolidays);
    };

    const handleChange = (index, field, value) => {
        console.log('index, field, value', index, field, value)
        const newHolidays = holidays.map((holiday, i) => {
            if (i === index) {
                return { ...holiday, [field]: value };
            }
            return holiday;
        });
        setHolidays(newHolidays);
    };
    const handleSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();

        try {
            const formData = {
                holiDayDateOcassion: holidays,
                department: e.target.department.value,
                designation: e.target.designation.value,
                employmentType: employmentType
            };
            const response = await axios.post("https://smarthrbackend-production.up.railway.app/holiday", formData);
            toast.success("Form data sent successfully");
            holidayData();
            setHolidays([]);
            setEmploymentType('');
            e.target.reset();
        } catch (error) {
            console.error("Form submission failed:", error);
            toast.error("Data submission failed")
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col">
                <div className="card">
                    <div className="row">
                        <div className="col">
                            <h3><b>Add Holiday</b></h3>
                        </div>
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        {holidays.map((holiday, index) => (
                            <div className="row mb-3" key={index}>
                                <div className="col">
                                    <label htmlFor={`date-${index}`}>Date</label>
                                    <input type="date"
                                        id={`date-${index}`}
                                        className="form-control"
                                        value={holiday.date}
                                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor={`occasion-${index}`}>Occasion</label>
                                    <input type="text" id={`occasion-${index}`} className="form-control"
                                        value={holiday.occasion} onChange={(e) => handleChange(index, 'occasion', e.target.value)}
                                    />
                                </div>
                                <div className="col-auto d-flex align-items-end pb-3">
                                    <i className="fa fa-times text-danger" onClick={() => handleRemoveRow(index)}></i>
                                </div>
                            </div>
                        ))}
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <b><i className="fa fa-plus-circle text-blue" onClick={handleAddRow}></i> Add</b>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="department">Department</label>
                                <select name="department" id="department" className="form-select">
                                    <option disabled>--</option>
                                    {department && department.map((dept) => (
                                        <option key={dept.departmentName} value={dept.departmentName}>{dept.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="designation">Designation</label>
                                <select name="designation" id="designation" className="form-select">
                                    <option disabled>--</option>
                                    {designation && designation.map((desg) => (
                                        <option key={desg.name} value={desg.name}>{desg.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="employment-type">Employment Type</label>
                                <select
                                    name="employment-type"
                                    id="employment-type"
                                    className="form-select"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                >
                                    <option>--</option>
                                    <option value="Full time">Full time</option>
                                    <option value="Part time">Part time</option>
                                    <option value="On Contract">On Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Trainee">Trainee</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <button className="btn btn-white" type="submit">
                                    {loading ? <Spinner size={30} color="blue" speed={1} /> : 'Submit'}
                                </button>{' '}
                                &nbsp;
                                <button className="btn btn-white" type="reset">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminHolidayForm;
