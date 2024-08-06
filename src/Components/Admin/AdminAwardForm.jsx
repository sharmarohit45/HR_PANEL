import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminAwardForm = () => {
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('');
    const [colorCode, setColorCode] = useState('#000000');
    const [status, setStatus] = useState('active');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!title || !icon || !summary) {
            alert('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            await axios.post('https://smarthrbackend-production.up.railway.app/award', {
                title,
                icon,
                colorCode,
                summary,
                status
            });
            toast.success('Award details saved successfully');
            // Optionally reset the form fields
            setTitle('');
            setIcon('');
            setColorCode('#000000');
            setSummary('');
            setStatus('active')
        } catch (error) {
            console.error('Error saving award details:', error.response ? error.response.data : error.message);
            toast.error('Failed to save award details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col">
                            <h3><b>Add Award Details</b><hr /></h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="icon">Choose Icon</label>
                            <div className="input-group">
                                <select
                                    className="form-control"
                                    name="icon"
                                    id="icon"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                >
                                    <option value="">--</option>
                                    <option value="fa fa-trophy">Trophy</option>
                                    <option value="fa fa-thumbs-up">Thumbs Up</option>
                                    <option value="fa fa-award">Award</option>
                                    <option value="fa fa-book">Book</option>
                                    <option value="fa fa-gift">Gift</option>
                                    <option value="fa fa-clock">Watch</option>
                                    <option value="fa fa-mug-hot">Cup</option>
                                    <option value="fa fa-plane">Plane</option>
                                    <option value="fa fa-piggy-bank">Money</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-1 p-4">
                            <i className={icon}
                                style={{ backgroundColor: colorCode, fontSize: '18px', padding: '10px', borderRadius: '20%' }}></i>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-sm-1">
                            <label htmlFor="colorCode">Color Code</label>
                            <input
                                type="color"
                                id="colorCode"
                                className="form-control"
                                value={colorCode}
                                onChange={(e) => setColorCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <label htmlFor="summary">Summary</label>
                            <textarea
                                className="form-control"
                                id="summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="row mt-3 mb-3">
                        <div className="col text-end">
                            <button
                                className="btn btn-white"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </>
    );
};

export default AdminAwardForm;
