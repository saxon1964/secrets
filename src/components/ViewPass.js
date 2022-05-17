import * as React from 'react'
import * as Utils from '../misc/utils.js'

const ViewPass = ({secret}) => {
  const [expanded, setExpanded] = React.useState(false)
  const [password, setPassword] = React.useState(secret.password)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const passwordPlaceholder = '••••••••••••'

  const toggleContainer = () => setExpanded(!expanded)
  const togglePassword = () => setPasswordVisible(!passwordVisible)

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    Utils.reportSuccess("Password copied to clipboard")
  }

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
              <tr>
                <td>
                  <b>Password:</b>

                </td>
                <td>
                  {passwordVisible? secret.password: passwordPlaceholder}
                  <button className="ms-2 btn btn-sm btn-primary" onClick={togglePassword}>
                    {passwordVisible? <i className="fa-solid fa-eye-slash"/>: <i className="fa-solid fa-eye"/>}
                  </button>
                  <button className="ms-2 btn btn-sm btn-secondary" onClick={copyPassword}>
                    <i className="fa-regular fa-copy"></i>
                  </button>
                </td>
              </tr>
              <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ViewPass
