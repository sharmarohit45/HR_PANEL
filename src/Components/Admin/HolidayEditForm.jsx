import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from "react-activity/dist/Dots";
import "react-activity/dist/Dots.css";
import { toast } from 'react-toastify';

const HolidayEditForm = ({ id }) => {
  const [holiday, setHoliday] = useState({});
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!id) {
      console.error('Holiday ID is missing');
      return;
    }

    try {
      const deptResponse = await axios.get('https://smarthrbackend-production.up.railway.app/departments');
      setDepartments(deptResponse.data);

      const desgResponse = await axios.get('https://smarthrbackend-production.up.railway.app/designations');
      setDesignations(desgResponse.data);

      const holidayResponse = await axios.get(`https://smarthrbackend-production.up.railway.app/holiday/${id}`);
      const data = holidayResponse.data;

      console.log('Fetched holiday data:', data);

      if (data) {
        setHoliday(data);
        setSelectedDepartment(data.department || '');
        setSelectedDesignation(data.designation || '');
        setEmploymentType(data.employmentType || '');

        // Extract the first item from holiDayDateOcassion array
        const holidayDetail = data.holiDayDateOcassion[0] || {};
        setHoliday({
          ...data,
          date: holidayDetail.date || '',
          occasion: holidayDetail.occasion || ''
        });
      } else {
        console.warn('No holiday data found for the given ID');
      }
    } catch (error) {
      console.error('Data fetching failed', error);
      toast.error('Failed to fetch holiday data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setHoliday(prevHoliday => ({ ...prevHoliday, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`https://smarthrbackend-production.up.railway.app/holiday/${id}`, {
        ...holiday,
        department: selectedDepartment,
        designation: selectedDesignation,
        employmentType,
      });
      toast.success('Holiday updated successfully');
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed to update holiday');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHoliday({});
    setSelectedDepartment('');
    setSelectedDesignation('');
    setEmploymentType('');
  };

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="row">
            <div className="col">
              <h3><b>Edit Holiday</b></h3>
            </div>
          </div>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={holiday.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div className="col">
                <label>Occasion</label>
                <input
                  type="text"
                  className="form-control"
                  value={holiday.occasion || ''}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col">
                <label htmlFor="department">Department</label>
                <select
                  name="department"
                  id="department"
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="" disabled>--</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentName} value={dept.departmentName}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="designation">Designation</label>
                <select
                  name="designation"
                  id="designation"
                  className="form-select"
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                >
                  <option value="" disabled>--</option>
                  {designations.map((desg) => (
                    <option key={desg.name} value={desg.name}>
                      {desg.name}
                    </option>
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
                  <option value="" disabled>--</option>
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
                <button className="btn btn-primary" type="submit">
                  {loading ? <Spinner size={30} color="blue" speed={1} /> : 'Submit'}
                </button>{' '}
                &nbsp;
                <button className="btn btn-secondary" type="button" onClick={handleReset}>
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

export default HolidayEditForm;
