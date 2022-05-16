import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const ACTIVATOR_URL = 'activate.php'

const Activator = ({dispatcher, email}) => {
  const [sending, setSending] = React.useState(false)
  const [activation, setActivation] = React.useState('')

  const updateActivation = (e) => setActivation(e.target.value)

  const checkForm = (e) => {
    e.preventDefault()
    if(activation == '') {
      Utils.reportError('Activation code must be provided')
    }
    else {
      setSending(true)
    }
  }

  React.useEffect(() => {
    if(!sending) {
      return
    }
    let formData = new FormData()
    formData.append("email", email)
    formData.append("activation", activation)
    axios.post(Utils.getScriptUrl(ACTIVATOR_URL), formData, {
    }).then(result => {
      let data = result.data
      //console.log(data)
      if(data.status == 0) {
        Utils.reportSuccess(`Username ${email} registered and activated. You can log in now`).then(() => {
          dispatcher({type: 'ACTION_REGISTERED'})
        })
      }
      else {
        Utils.reportError('Registration failed. Wrong registration code or already registered?')
      }
    }).catch(error => {
      Utils.reportError(`Registration error: ${error}`)
    }).finally(() => {
      setSending(false)
    })
  }, [sending])

  return (
    <form onSubmit={checkForm}>
      <div className="row">
        <div className="col-lg-auto">
          <label htmlFor="activation">Activation code:</label>
          <input type="text" className="form-control" name="activation" id="activation"
            value={activation} onChange={updateActivation}/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-auto">
          <button type="submit" className="btn btn-danger btn-sm">
            Activate {sending && <Spinner/>}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Activator
