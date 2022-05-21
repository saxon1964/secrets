import * as React from 'react'
import * as Utils from '../misc/utils.js'
import EditHidden from './EditHidden.js'
import NameField from './NameField.js'
import Mandatory from './Mandatory.js'

const RANDOM_PASSWORD_LENGTH = 12

const EditPass = ({id, data, submitData}) => {
  const [name, setName] = React.useState('')
  const [host, setHost] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [note, setNote] = React.useState('')

  React.useEffect(() => {
    setName(data.name || '')
    setHost(data.host || '')
    setUsername(data.username || '')
    setPassword(data.password || '')
    setNote(data.note || '')
  }, [id])

  const createRandomPassword = () => Utils.randomPassword(RANDOM_PASSWORD_LENGTH)

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
            <NameField id={id} name={name} setName={setName}/>
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
            <EditHidden id="password" label="Password" value={password} reportValue={setPassword} randomize={createRandomPassword}/>
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
