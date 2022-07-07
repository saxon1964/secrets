import * as React from 'react'
import * as Utils from '../misc/utils.js'

const ViewTable = ({ alertType, secret, expanded, toggle, edit, del, children }) => {
  return (
    <div className={`alert ${alertType}`}>
      <h5 className="alert-heading mb-0">
        <button className="btn btn-sm btn-primary" onClick={toggle}>
          {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
        </button>&nbsp;&nbsp;
        {secret.name}
      </h5>
      {expanded && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3 mb-0">
            <tbody>
              {children}
              <tr>
                <td style={{whiteSpace: 'nowrap'}}>
                  <button className="btn btn-sm btn-primary me-2" onClick={edit} title="Edit secret">
                    <i className="fa-solid fa-pencil"/>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={del} title="Delete secret">
                    <i className="fa-solid fa-trash-can"/>
                  </button>
                </td>
                <td style={{width: '100%'}}>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ViewTable
