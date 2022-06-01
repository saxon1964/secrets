import * as React from 'react'
import * as Utils from '../misc/utils.js'
import HiddenText from './HiddenText.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewPass = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)

  return (
    <div className="alert alert-primary">
      <h5 className="alert-heading mb-0">
        <button className="btn btn-sm btn-primary" onClick={toggle}>
          {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
        </button>&nbsp;&nbsp;
        {secret.name}
      </h5>
      {expanded && (
        <div className="table-responsive">
          <table className="table mt-3 bg-light" style={{width: 'auto'}}>
            <tbody>
              <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
              <tr><td><b>Host:</b></td><td>{secret.host}</td></tr>
              <tr><td><b>Username:</b></td><td>{secret.username}</td></tr>
              <tr><td><b>Password:</b></td><td><HiddenText text={secret.password}/></td></tr>
              <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
              <tr>
                <td colSpan="2">
                  <button className="btn btn-sm btn-primary me-2" onClick={edit}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={del}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ViewPass
