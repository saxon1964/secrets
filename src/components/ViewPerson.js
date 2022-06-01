import * as React from 'react'
import * as Utils from '../misc/utils.js'
import HiddenText from './HiddenText.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewPerson = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)

  return (
    <div className="alert alert-success">
      <h5 className="alert-heading mb-0">
        <button className="btn btn-sm btn-primary" onClick={toggle}>
          {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
        </button>&nbsp;&nbsp;
        {secret.name}
      </h5>
      {expanded && (
        <table className="table mt-3 bg-light" style={{width: 'auto'}}>
          <tbody>
            <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
            <tr><td><b>Full name:</b></td><td>{secret.fullName}</td></tr>
            <tr><td><b>Birth date:</b></td><td>{Utils.formatIsoDate(secret.birth)}</td></tr>
            <tr><td><b>Address:</b></td><td>{secret.address}</td></tr>
            <tr><td><b>ZIP:</b></td><td>{secret.zip}</td></tr>
            <tr><td><b>City:</b></td><td>{secret.city}</td></tr>
            <tr><td><b>Country:</b></td><td>{secret.country}</td></tr>
            <tr><td><b>Email 1:</b></td><td>{secret.email1}</td></tr>
            <tr><td><b>Email 2:</b></td><td>{secret.email2}</td></tr>
            <tr><td><b>Phone 1:</b></td><td>{secret.phone1}</td></tr>
            <tr><td><b>Phone 2:</b></td><td>{secret.phone2}</td></tr>
            <tr><td><b>Comapny:</b></td><td>{secret.company}</td></tr>
            <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
            <tr>
              <td colSpan="2">
                <button className="btn btn-sm btn-primary me-2" onClick={edit}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={del}>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ViewPerson
