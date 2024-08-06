import React from 'react'

const AdminProjectPaymentForm = () => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <form action="">
                        <div className="row">
                            <div className="col">
                                <h3><b>Payment Details</b></h3><hr />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <label htmlFor="">Project</label>
                                <select name="" id="" className="form-select">
                                    <option value="">--</option>
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="">Invoice</label>
                                <select name="" id="" className="form-select">
                                    <option value="">--</option>
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="">Paid On</label>
                                <input type="date" name="" id="" className="form-control" />
                            </div>
                            <div className="col">
                            <input type="date" name="" id="" className="form-control" placeholder='e.g. 10,000'/>
                                <label htmlFor="">Amount </label>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <label htmlFor="">Currency</label>
                                <select name="" id="" className="form-select">
                                    <option value="">--</option>
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="">Exchange Rate </label>
                                <input type="text" name="" id="" className="form-control" />
                            </div>
                            <div className="col">
                                <label htmlFor="">Transaction Id</label>
                                <input type="text" name="" id="" className="form-control" />
                            </div>
                            <div className="col">
                                <label htmlFor="">Payment Gateway</label>
                                <select name="" id="" className="form-select">
                                    <option value="">--</option>
                                    <option value="">Offline Payment</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <label htmlFor="">Receipt </label>
                                <input type="file" name="" id="" className="form-control" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <label htmlFor="">Remark</label>
                                <textarea className="form-control" ></textarea>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <button type="submit" className='btn btn-white'>Save</button> &nbsp; &nbsp;
                                <button type="button" className='btn btn-white'>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AdminProjectPaymentForm