import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const LOGIN_URL = 'login.php'

const Login = ({dispatcher}) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  const register = () => dispatcher({type: 'ACTION_REGISTER'})
  const handleEmailChange = e => setEmail(e.target.value)
  const handlePasswordChange = e => setPassword(e.target.value)

  const checkFormAndSubmit = (e) => {
    e.preventDefault()
    if(email == '' || !email.includes('@')) {
      Utils.reportError('Wrong or missing email address')
    }
    else if(password == '') {
      Utils.reportError('Password must be specified')
    }
    else {
      submitForm()
    }
  }

  const submitForm = () => {
    setBusy(true)
    let formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    axios.post(Utils.getScriptUrl(LOGIN_URL), formData, {
    }).then(result => {
      let data = result.data
      console.log(data)
      if(data.token.length > 0) {
        Utils.reportSuccess(`Login OK`).then(() => {
          dispatcher({type: 'ACTION_AUTHENTICATED', payload: {email: email, token: data.token}})
        })
      }
      else {
        Utils.reportError("Login failed")
      }
    }).catch(error => {
      Utils.reportError(`Login error: ${error}`)
    }).finally(() => {
      setBusy(false)
    })
  }

  return (
    <div className="container secretContainer">
      <h2>Login</h2>
      <form onSubmit={checkFormAndSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="email">Email:</label>
            <input className="form-control" type="text" name="email" id="email"
              value={email} onChange={handleEmailChange}/>
          </div>
          <div className="col-lg-6">
            <label htmlFor="password">Password:</label>
            <input className="form-control" type="password" name="password" id="password"
              value={password} onChange={handlePasswordChange}/>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <button type="submit" className="btn btn-sm btn-primary">
              Submit {busy && <Spinner/>}
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
