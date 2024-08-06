import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateInterviewForm = ({ interviewId }) => {
    console.log("ID : " , interviewId)
    const [formData, setFormData] = useState({
        job: '',
        interviewer: '',
        candidate: '',
        round: '',
        interviewType: '',
        startDate: '',
        startTime: '',
        interviewerComment: '',
        notifyCandidate: false,
        candidateComment: '',
        sendReminder: false,
        status: 'Pending',
        remindBeforeAmount: '',
        remindBeforeUnit: 'Days',
    });

    const [show, setShow] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const fetchInterviewData = async () => {
            if (!interviewId) return;

            try {
                const response = await axios.get(`https://smarthrbackend-production.up.railway.app/interview/${interviewId}`);
                console.log("Fetched Data:", response.data);

                if (response.data) {
                    setFormData(prevData => {
                        const updatedData = {
                            ...prevData,
                            ...response.data,
                            notifyCandidate: response.data.notifyCandidate || false,
                            sendReminder: response.data.sendReminder || false,
                        };
                        console.log("Updated Form Data:", updatedData);
                        return updatedData;
                    });
                    setShow(response.data.notifyCandidate || false);
                    setShowReminder(response.data.sendReminder || false);
                } else {
                    toast.error('No data found for the provided ID.');
                }
            } catch (error) {
                console.error('Failed to fetch interview data', error);
                toast.error('Failed to load interview data.');
            }
        };

        fetchInterviewData();
    }, [interviewId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVisibility = () => {
        setShow(prev => !prev);
    };

    const handleReminderVisibility = (event) => {
        setShowReminder(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`https://smarthrbackend-production.up.railway.app/interview/${interviewId}`, formData);
            toast.success("Data Updated Successfully");
        } catch (error) {
            console.error('There was a problem updating the data', error);
            toast.error("Update failed");
        }
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="row">
                            <div className="col">
                                <h3><b>Interview Details</b></h3>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="job">Job</label>
                                            <input
                                                type='text'
                                                name="job"
                                                id="job"
                                                className="form-control"
                                                value={formData.job }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="candidate">Candidate</label>
                                            <input
                                                type='text'
                                                name="candidate"
                                                id="candidate"
                                                className="form-control"
                                                value={formData.candidate }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="interviewer">Interviewer</label>
                                            <input
                                                type='text'
                                                name="interviewer"
                                                id="interviewer"
                                                className="form-control"
                                                value={formData.interviewer }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="round">Round</label>
                                            <select
                                                name="round"
                                                id="round"
                                                className="form-select"
                                                value={formData.round }
                                                onChange={handleChange}
                                            >
                                                <option value="">--</option>
                                                <option value="Hr Round">Hr Round</option>
                                                <option value="Technical Round">Technical Round</option>
                                                <option value="Manager Round">Manager Round</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col">
                                            <label htmlFor="interviewType">Interview Type</label>
                                            <select
                                                name="interviewType"
                                                id="interviewType"
                                                className="form-select"
                                                value={formData.interviewType }
                                                onChange={handleChange}
                                            >
                                                <option value="">--</option>
                                                <option value="Video">Video</option>
                                                <option value="Person">Person</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="startDate">Start On</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                id="startDate"
                                                className="form-control"
                                                value={formData.startDate }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="startTime">Start Time</label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                id="startTime"
                                                className="form-control"
                                                value={formData.startTime }
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="interviewerComment">Comment for Interviewer</label>
                                            <textarea
                                                name="interviewerComment"
                                                id="interviewerComment"
                                                className='form-control'
                                                value={formData.interviewerComment }
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="notifyCandidate"
                                                    id="notifyCandidate"
                                                    className='form-check-input'
                                                    checked={formData.notifyCandidate || false}
                                                    onChange={handleVisibility}
                                                />
                                                <label htmlFor="notifyCandidate" className='form-label'>Notify Candidate</label>
                                            </div>
                                        </div>
                                    </div>
                                    {show && (
                                        <div className="row mt-2">
                                            <div className="col">
                                                <label htmlFor="candidateComment">Comment for Candidate</label>
                                                <textarea
                                                    name="candidateComment"
                                                    id="candidateComment"
                                                    className='form-control'
                                                    value={formData.candidateComment }
                                                    onChange={handleChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row mt-2">
                                        <div className="col">
                                            <div className="form-check mt-4">
                                                <input
                                                    type="checkbox"
                                                    name="sendReminder"
                                                    id="sendReminder"
                                                    className='form-check-input'
                                                    checked={formData.sendReminder || false}
                                                    onChange={handleReminderVisibility}
                                                />
                                                <label htmlFor="sendReminder" className='form-label'>Send Reminder</label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="status">Status</label>
                                            <select
                                                name="status"
                                                id="status"
                                                className="form-select"
                                                value={formData.status }
                                                onChange={handleChange}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Hired">Hired</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Canceled</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                    {showReminder && (
                                        <div className="row mt-2">
                                            <div className="col">
                                                <label htmlFor="remindBefore">Remind Before</label>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <input
                                                            type="text"
                                                            name="remindBeforeAmount"
                                                            id="remindBeforeAmount"
                                                            className="form-control"
                                                            value={formData.remindBeforeAmount }
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <select
                                                            name="remindBeforeUnit"
                                                            id="remindBeforeUnit"
                                                            className="form-select"
                                                            value={formData.remindBeforeUnit }
                                                            onChange={handleChange}
                                                        >
                                                            <option value="Days">Days</option>
                                                            <option value="Hours">Hours</option>
                                                            <option value="Minutes">Minutes</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row mb-3 mt-3">
                                        <div className="col">
                                            <button type='submit' className='btn btn-white'>Save</button> &nbsp;
                                            <button type='button' className='btn btn-white' data-bs-dismiss="offcanvas">Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default UpdateInterviewForm;
