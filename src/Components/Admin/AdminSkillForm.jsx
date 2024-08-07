import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminSkillForm = ({addSkill}) => {
  // State to store the skill input value
  const [skill, setSkill] = useState('');

  // Handler for form input change
  const handleChange = (event) => {
    setSkill(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    
      const response = await axios.post('https://smarthrbackend-production.up.railway.app/skills', { skill });
      toast.success('Skills Add Successfully');
      addSkill();
      setSkill('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed');
    }
  };

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="row">
            <div className="col">
              <h3><b>Add Skill Details</b></h3><hr />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="skill">Add Skill</label>
                    <input
                      type="text"
                      id="skill"
                      className="form-control"
                      value={skill}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mt-3 mb-3">
                  <div className="col">
                    <button type="submit" className="btn btn-white">Submit</button> &nbsp; 
                    <button type="button" className="btn btn-white" data-bs-dismiss="offcanvas">Cancel</button>
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

export default AdminSkillForm;
