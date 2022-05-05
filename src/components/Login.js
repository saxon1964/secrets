import * as React from 'react';
import * as Utils from '../misc/utils.js'

const Login = ({dispatcher}) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const register = () => dispatcher({type: 'ACTION_REGISTER'})
  const handleUsernameChange = e => setUsername(e.target.value)
  const handlePasswordChange = e => setPassword(e.target.value)

  const submitForm = (e) => {
    if(username == '') {
      Utils.reportError('Username must be specified')
    }
    else if(password == '') {
      Utils.reportError('Password must be specified')
    }
    else {
      console.log(`Submitting ${username} ${password}`)
    }
    e.preventDefault()
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="row">
        <div className="col-lg-6">
          <label htmlFor="username">Username:</label>
          <input className="form-control" type="text" name="username" id="username"
            value={username} onChange={handleUsernameChange}/>
        </div>
        <div className="col-lg-6">
          <label htmlFor="password">Password:</label>
          <input className="form-control" type="password" name="password" id="password"
            value={password} onChange={handlePasswordChange}/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-6">
          <button type="submit" className="btn btn-sm btn-primary" onClick={submitForm}>Submit</button>
        </div>
        <div className="col-lg-6">
          <p>Don't have an account? Click here to <a href="#" onClick={register}>register.</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
