import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import Mandatory from './Mandatory.js'
import axios from 'axios'
import sjcl from 'sjcl'

const RANDOM_PASSWORD_LENGTH = 12

const EditPass = ({id, data, submitData}) => {
  const [name, setName] = React.useState(data.name || '')
  const [host, setHost] = React.useState(data.host || '')
  const [username, setUsername] = React.useState(data.username || '')
  const [password, setPassword] = React.useState(data.password || '')
  const [note, setNote] = React.useState(data.note || '')
  const [passwordControl, setPasswordControl] = React.useState('password')

  const togglePasswordControlType = () => setPasswordControl(passwordControl == 'password'? 'text': 'password')
  const createRandomPassword = () => setPassword(Utils.randomString(RANDOM_PASSWORD_LENGTH))

  const checkForm = (e) => {
    e.preventDefault()
    if(name.length == 0) {
      Utils.reportError('Name must be specified')
    }
    else if(username.length == 0) {
      Utils.reportError('Username must be specified')
    }
    else if(password.length == 0) {
      Utils.reportError('Password must be specified')
    }
    else {
      const newData = {
        type: data.type,
        name: name,
        host: host,
        username: username,
        password: password,
        note: note
      }
      submitData(id, newData)
    }
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} password:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <label htmlFor="name">Name:<Mandatory/></label>
            <input type="text" value={name} id="name" className="form-control" onChange={e => setName(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="host">Host:</label>
            <input type="text" value={host} id="host" className="form-control" onChange={e => setHost(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="username">Username:<Mandatory/></label>
            <input type="text" value={username} id="username" className="form-control" onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="password">Password:<Mandatory/></label>
            <div className="input-group">
              <input type={passwordControl} value={password} id="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" title="Toggle visibility" onClick={togglePasswordControlType}>
                  {passwordControl == 'password'? <i className="fa-solid fa-eye"/>: <i className="fa-solid fa-eye-slash"/>}
                </button>
                <button className="btn btn-outline-secondary" type="button" title="Create random password" onClick={createRandomPassword}>
                  <i className="fa-solid fa-pencil"/>
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="note">Note:</label>
            <textarea rows="4" className="form-control" id="note" value={note} onChange={e => setNote(e.target.value)}/>
          </div>
          <div className="col-lg-12 mt-2">
            <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => submitData(id, false)}>Cancel</button>
          </div>
        </div>
      </form>
      <hr/>
    </div>
  )
}

export default EditPass
