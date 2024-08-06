import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const AdminAddInterviewForm = () => {
    const [show, setShow] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    const handleVisibility = () => {
        setShow(!show);
    };

    const handleReminderVisibility = (event) => {
        setShowReminder(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        try {
            const response = await axios.post('https://smarthrbackend-production.up.railway.app/interview', formDataObject);
            console.log('API response:', response.data);
            toast.success("Added Data Successfully");    
        } catch (error) {
            console.error('There was a problem with the axios request:', error);
            toast.success("Added Data failed");
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
                        </div><hr />
                        <div className="row">
                            <div className="col">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="job">Job</label>
                                            <input type='text' name="job" id="job" className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="candidate">Candidate</label>
                                            <input type='text'  name="candidate" id="candidate"  className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="interviewer">Interviewer</label>
                                            <input type='text'  name="interviewer" id="interviewer"  className="form-control" />

                                        </div>
                                        <div className="col">
                                            <label htmlFor="round">Round</label>
                                            <select name="round" id="round" className="form-select">
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
                                            <select name="interviewType" id="interviewType" className="form-select">
                                                <option value="">--</option>
                                                <option value="Video">Video</option>
                                                <option value="Person">Person</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="startDate">Start On</label>
                                            <input type="date" name="startDate" id="startDate" className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="startTime">Start Time</label>
                                            <input type="time" name="startTime" id="startTime" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="interviewerComment">Comment for Interviewer</label>
                                            <textarea name="interviewerComment" id="interviewerComment" className='form-control'></textarea>
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
                                                <textarea name="candidateComment" id="candidateComment" className='form-control'></textarea>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row mt-2">
                                        <div className="col">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="sendReminder"
                                                    id="sendReminder"
                                                    className='form-check-input'
                                                    onChange={handleReminderVisibility}
                                                />
                                                <label htmlFor="sendReminder" className='form-label'>Send Reminder</label>
                                            </div>
                                        </div>
                                    </div>
                                    {showReminder && (
                                        <div className="row mt-2">
                                            <div className="col">
                                                <label htmlFor="remindBefore">Remind Before</label>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <input type="text" name="remindBeforeAmount" id="remindBeforeAmount" className="form-control" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <select name="remindBeforeUnit" id="remindBeforeUnit" className="form-select">
                                                            <option value="">Day's</option>
                                                            <option value="">Hour's</option>
                                                            <option value="">Minute's</option>
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

export default AdminAddInterviewForm;
