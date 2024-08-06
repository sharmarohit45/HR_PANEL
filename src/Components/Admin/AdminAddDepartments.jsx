import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminAddDepartments = ({ onAddDepartment }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [parentDepartment, setParentDepartment] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://smarthrbackend-production.up.railway.app/departments', {
        departmentName: departmentName,
        departmentParent: parentDepartment
      });
      onAddDepartment();

      toast.success('Department created successfully:', response.data);
      
    } catch (error) {
      console.error('Error creating department:', error);
  
    }
  };

  return (
    <div className="row">
      <div className="card">
        <div className="col">
          <div className="row">
            <div className="col">
              <h3>Add Departments</h3>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col">
                <label htmlFor="departmentName">Name</label>
                <input
                  type="text"
                  id="departmentName"
                  className='form-control'
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="parentDepartment">Parent</label>
                <select
                  id="parentDepartment"
                  className="form-select"
                  value={parentDepartment}
                  onChange={(e) => setParentDepartment(e.target.value)}
                >
                  <option value="">--</option>
                  <option value="Marketting">Marketting</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Research">Research</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col">
                <button type="submit" className="btn btn-white">Save</button> &nbsp;
                <button type="button" className="btn btn-white" data-bs-dismiss="offcanvas">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAddDepartments;