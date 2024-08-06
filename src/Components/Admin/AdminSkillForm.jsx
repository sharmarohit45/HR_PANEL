import React from 'react'

const AdminSkillForm = () => {
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
                        <form action="">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label htmlFor="">Add Skill</label>
                                    <input type="text" name="" id="" className="form-control" />
                                </div>
                            </div>
                            <div className="row mt-3 mb-3">
                                <div className="col">
                                    <button type='submit' className='btn btn-white'>Submit</button> &nbsp; 
                                    <button type='button' className='btn btn-white' data-bs-dismiss="offcanvas">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminSkillForm