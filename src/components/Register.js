import * as React from 'react'
import Spinner from './Spinner.js'
import Activator from './Activator.js'
import * as Utils from '../misc/utils.js'
import axios from 'axios'

const REGISTER_URL = 'register.php'

const Register = ({dispatcher}) => {
  const [email, setEmail] = React.useState('')
  const [pass1, setPass1] = React.useState('')
  const [pass2, setPass2] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [registered, setRegistered] = React.useState(false)

  const updateEmail = (e) => setEmail(e.target.value)
  const updatePass1 = (e) => setPass1(e.target.value)
  const updatePass2 = (e) => setPass2(e.target.value)

  const checkFormAndSubmit = (e) => {
    e.preventDefault()
    if(registered) {
      Utils.reportError('Please enter the activation code')
    }
    else if(email == '' || !email.includes('@')) {
      Utils.reportError('Missing or invalid email address')
    }
    else if(pass1 == '') {
      Utils.reportError('Missing password')
    }
    else if(pass1 != pass2) {
      Utils.reportError('Passwords do not match')
    }
    else {
      submitForm()
    }
  }

  const submitForm = () => {
    setBusy(true)
    let formData = new FormData()
    formData.append("email", email)
    formData.append("password", pass1)
    axios.post(Utils.getScriptUrl(REGISTER_URL), formData, {
    }).then(result => {
      let data = result.data
      //console.log(data)
      switch(data.status) {
        case 0:
          Utils.reportSuccess('Registration successfull. Check your email and look for the registration code')
          setRegistered(true)
          break
        case 1:
          Utils.reportError('Registration failed. Email already registered')
          break
        case 2:
          Utils.reportError('Registration failed. Could not sent activation mail')
          break
        default:
          Utils.reportError('Registration failed. Unknown error')
          break
      }
    }).catch(error => {
      Utils.reportError(`Registration error: ${error}`)
    }).finally(() => {
      setBusy(false)
    })
  }

  return (
    <div className="container secretContainer">
      <h2>Register</h2>
      <form onSubmit={checkFormAndSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="email">Email:</label>
            <input type="text" className="form-control" name="email" id="email" value={email} onChange={updateEmail}/>
          </div>
          <div className="col-lg-6">
            &nbsp;
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <label htmlFor="pass1">Password:</label>
            <input type="password" className="form-control" name="pass1" id="pass1" value={pass1} onChange={updatePass1}/>
          </div>
          <div className="col-lg-6">
            <label htmlFor="pass2">Retype password:</label>
            <input type="password" className="form-control" name="pass2" id="pass2" value={pass2} onChange={updatePass2}/>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <button type="submit" className="btn btn-sm btn-primary" disabled={registered}>
              Register {busy && <Spinner/>}
            </button>
          </div>
        </div>
      </form>
      {registered && (
        <>
          <hr/>
          <Activator dispatcher={dispatcher} email={email}/>
        </>
      )}
    </div>
  )
}

export default Register
