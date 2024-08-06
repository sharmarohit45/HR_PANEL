import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminProfileSetting = () => {
  const [formData, setFormData] = useState({
    adminName: '',
    email: '',
    password: '',
    country: '',
    mobileNo: '',
    gender: '',
    fileData: '',
    emailNotification: null,
    googleCalender: null,
    dateOfBirth: '',
    slackMemberId: '',
    maritalStatus: '',
    address: '',
    about: '',
    role: '',
    anniversaryDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('https://smarthrbackend-production.up.railway.app/admin/1');
        const data = response.data;

        setFormData(data);
        if (data.fileData) {
          setImagePreview(`data:image/jpeg;base64,${data.fileData}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          fileData: reader.result.split(',')[1]
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://smarthrbackend-production.up.railway.app/admin/1', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <h3><b>Update Profile</b></h3><hr />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="adminName">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="mobileNo">Mobile Number:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobileNo"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="fileData">Profile Picture:</label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="fileData"
                      name="fileData"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {imagePreview && <img src={imagePreview} alt="Profile Preview" className="mt-2" style={{ width: '100px', height: '100px' }} />}
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="slackMemberId">Slack Member ID:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="slackMemberId"
                      name="slackMemberId"
                      value={formData.slackMemberId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="maritalStatus">Marital Status:</label>
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      className="form-select"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widower">Widower</option>
                      <option value="Widow">Widow</option>
                      <option value="Separate">Separate</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Engaged">Engaged</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                {formData.maritalStatus === 'Married' && (
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="anniversaryDate">Anniversary Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="anniversaryDate"
                        name="anniversaryDate"
                        value={formData.anniversaryDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="about">About:</label>
                    <textarea
                      id="about"
                      name="about"
                      className="form-control"
                      value={formData.about}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                      id="address"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row mt-3 mb-3">
                <div className="col">
                  <button type="submit" className="btn btn-white">Update Profile</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminProfileSetting;
