import * as React from 'react';
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const LOGIN_URL = 'login.php'

const Login = ({dispatcher}) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const register = () => dispatcher({type: 'ACTION_REGISTER'})
  const handleUsernameChange = e => setUsername(e.target.value)
  const handlePasswordChange = e => setPassword(e.target.value)

  const checkAndSubmitForm = (e) => {
    if(username == '') {
      Utils.reportError('Username must be specified')
    }
    else if(password == '') {
      Utils.reportError('Password must be specified')
    }
    else {
      submitForm()
    }
    e.preventDefault()
  }

  const submitForm = () => {
    setLoading(true)
    let formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)
    axios.post(Utils.getScriptUrl(LOGIN_URL), formData, {
    }).then(result => {
      let data = result.data
      console.log(data)
      if(data.token.length > 0) {
        //vue.setAuthorization(data.username, data.token)
        //vue.$router.push({name: 'Home'})
      }
      else {
        Utils.reportError("Wrong username/password")
      }
    }).catch(error => {
      Utils.reportError(`Login error: ${error}`)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <form>
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
            <button type="submit" className="btn btn-sm btn-primary" onClick={checkAndSubmitForm}>
              Submit {loading && <Spinner/>}
            </button>
          </div>
          <div className="col-lg-6">
            <p>Don't have an account? Click here to <a href="#" onClick={register}>register.</a></p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
