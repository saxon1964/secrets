import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const ACTIVATOR_URL = 'activator.php'

const Activator = ({dispatcher, email}) => {
  const [busy, setBusy] = React.useState(false)
  const [code, setCode] = React.useState('')

  const updateCode = (e) => setCode(e.target.value)

  const checkFormAndSubmit = (e) => {
    e.preventDefault()
    if(code == '') {
      Utils.reportError('Activation code must be provided')
    }
    else {
      submitForm()
    }
  }

  const submitForm = () => {
    setBusy(true)
    let formData = new FormData()
    formData.append("email", email)
    formData.append("code", code)
    axios.post(Utils.getScriptUrl(ACTIVATOR_URL), formData, {
    }).then(result => {
      let data = result.data
      //console.log(data)
      if(data.status == 0) {
        Utils.reportSuccess(`Username ${email} registered and activated. You can log in now`)
      }
      else {
        Utils.reportError('Registration failed. Wrong registration code?')
      }
    }).catch(error => {
      Utils.reportError(`Registration error: ${error}`)
    }).finally(() => {
      setBusy(false)
    })
  }

  return (
    <form onSubmit={checkFormAndSubmit}>
      <div className="row">
        <div className="col-lg-auto">
          <label htmlFor="code">Activation code:</label>
          <input type="text" className="form-control" name="code" id="code" value={code} onChange={updateCode}/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-auto"><button type="submit" className="btn btn-danger btn-sm">Activate</button></div>
      </div>
    </form>
  )
}

export default Activator
