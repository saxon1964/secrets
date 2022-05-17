import * as React from 'react'
import * as Utils from '../misc/utils.js'

const ViewNote = ({secret, secretAction}) => {
  const [expanded, setExpanded] = React.useState(false)

  const toggleContainer = () => setExpanded(!expanded)

  const edit = (e) => secretAction(secret.id) // Edit
  const del = (e) => secretAction(-secret.id) // Delete

  return (
    <div className="alert alert-secondary">
      <h5 className="alert-heading mb-0">
        <button className="btn btn-sm btn-primary" onClick={toggleContainer}>
          {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
        </button>&nbsp;&nbsp;
        {secret.name}
      </h5>
      {expanded && (
        <table className="table mt-3 bg-light" style={{width: 'auto'}}>
          <tbody>
            <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
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

export default ViewNote
