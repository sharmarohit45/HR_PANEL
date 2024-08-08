import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAssetsForm = ({assetData}) => {
    const [formData, setFormData] = useState({
        assetName: '',
        assetType: '',
        assetData: '',
        serialNumber: '',
        value: '',
        location: 'Office',
        status: 'Active',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
        const file = files[0];
    
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file.');
                return;
            }
    
            if (file.size > 5 * 1024 * 1024) { // 5 MB limit
                toast.error('File size exceeds 5 MB.');
                return;
            }
    
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setFormData((prevState) => ({
                    ...prevState,
                    assetData: base64String,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://smarthrbackend-production.up.railway.app/assets', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Asset added successfully');
            assetData();
            setFormData({
                assetName: '',
                assetType: '',
                assetData: '',
                serialNumber: '',
                value: '',
                location: 'Office',
                status: 'Active',
                description: '',
            });
        } catch (error) {
            toast.error('Error adding asset');
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col">
                <div className="card">
                    <div className="row">
                        <div className="col">
                            <h3>Add Asset Info</h3>
                        </div>
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="assetName">Asset Name</label>
                                <input
                                    type="text"
                                    id="assetName"
                                    name="assetName"
                                    className="form-control"
                                    value={formData.assetName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="assetType">Asset Type</label>
                                <input type="text" id="assetType"
                                    name="assetType"
                                    className="form-select"
                                    value={formData.assetType}
                                    onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="assetPicture">Asset Picture</label>
                                <input
                                    type="file"
                                    id="assetPicture"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="serialNumber">Serial Number</label>
                                <input
                                    type="text"
                                    id="serialNumber"
                                    name="serialNumber"
                                    className="form-control"
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="value">Value</label>
                                <input
                                    type="text"
                                    id="value"
                                    name="value"
                                    className="form-control"
                                    value={formData.value}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="form-control"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label>Status</label><br />
                                {['Active', 'Non Functional', 'Lost', 'Damaged', 'Under Maintenance'].map(statusOption => (
                                    <div className="form-check form-check-inline" key={statusOption}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id={statusOption}
                                            value={statusOption}
                                            checked={formData.status === statusOption}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor={statusOption}>{statusOption}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button> &nbsp;
                                <button type="button" className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminAssetsForm;
