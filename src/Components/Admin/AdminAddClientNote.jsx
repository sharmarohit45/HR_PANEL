import React from 'react'

const AdminAddClientNote = () => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <form action="">
                        <div className="row">
                            <div className="col">
                                <h3><b>Add Note Details</b></h3><hr />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="">Note Title </label>
                                <input type="text" name="" id="" className="form-control" />
                            </div>
                            <div className="col">
                                <label htmlFor="noteType">Note Type</label><br />
                                <div className="form-check form-check-inline pt-2">
                                    <input type="radio" id="publicNote" name="noteType" value="public" className="form-check-input" />
                                    <label className="form-check-label me-5" htmlFor="publicNote">Public</label>
                                </div>
                                <div className="form-check form-check-inline pt-2">
                                    <input type="radio" id="privateNote" name="noteType" value="private" className="form-check-input" />
                                    <label className="form-check-label" htmlFor="privateNote">Private</label>
                                </div>
                            </div>

                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="">Note Details</label>
                                <textarea name="" id="" className="form-control"></textarea>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col">
                                <button type='submit' className="btn btn-white">Save</button> &nbsp; &nbsp;
                                <button type='button' className="btn btn-white" data-bs-dismiss="offcanvas">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AdminAddClientNote