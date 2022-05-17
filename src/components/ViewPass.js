import * as React from 'react'
import * as Utils from '../misc/utils.js'
import HiddenText from './HiddenText.js'

const ViewPass = ({secret}) => {
  const [expanded, setExpanded] = React.useState(false)

  const toggleContainer = () => setExpanded(!expanded)

  return (
    <div className="col-lg-6">
      <div className="alert alert-primary">
        <h5 className="alert-heading mb-0">
          <button className="btn btn-sm btn-primary" onClick={toggleContainer}>
            {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
          </button>&nbsp;&nbsp;
          {secret.name}
        </h5>
        {expanded && (
          <table className="table mt-3 bg-light" style={{width: 'auto'}}>
            <tbody>
              <tr><td><b>Type:</b></td><td>{secret.type}</td></tr>
              <tr><td><b>Host:</b></td><td>{secret.host}</td></tr>
              <tr><td><b>Username:</b></td><td>{secret.username}</td></tr>
              <tr><td><b>Password:</b></td><td><HiddenText text={secret.password}/></td></tr>
              <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ViewPass
