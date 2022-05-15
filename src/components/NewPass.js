import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import Mandatory from './Mandatory.js'
import axios from 'axios'
import sjcl from 'sjcl'

const RANDOM_PASSWORD_LENGTH = 12

const NewPass = ({token, masterPass, cancel}) => {
  const [name, setName] = React.useState('')
  const [host, setHost] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordControl, setPasswordControl] = React.useState('password')
  const [note, setNote] = React.useState('')

  const togglePasswordControlType = () => setPasswordControl(passwordControl == 'password'? 'text': 'password')
  const createRandomPassword = () => setPassword(Utils.randomString(RANDOM_PASSWORD_LENGTH))

  const checkForm = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <h5>New password:</h5>
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
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => cancel()}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewPass
