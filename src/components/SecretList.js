import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'
import NewPass from './NewPass.js'

const ACTION_NONE       = 0
const ACTION_PASS       = 1

const SAVE_SECRET_URL   = 'saveSecret.php'
const GET_SECRETS_URL   = 'getSecrets.php'

const SecretList = ({token, masterPass}) => {
  const [action, setAction] = React.useState(0)
  const [busy, setBusy] = React.useState(false)
  const [reload, setReload] = React.useState(true)
  const [secrets, setSecrets] = React.useState([])

  React.useEffect(() => {
    if(reload) {
      setBusy(true)
      axios.get(Utils.getScriptUrl(GET_SECRETS_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        setSecrets(result.data.map(secret => Utils.decrypt(masterPass, secret.secret)))
      }).catch(error => {
        Utils.reportError(`Error while saving new secret: ${error}`)
      }).finally(() => {
        setReload(false)
        setBusy(false)
      })
    }
  }, [reload])

  const submitData = (action, data) => {
    if(data !== false) {
      setBusy(true)
      let payload = {...data, type: action}
      let secret = Utils.encrypt(masterPass, JSON.stringify(payload))
      const formData = new FormData()
      formData.append('secret', secret)
      axios.post(Utils.getScriptUrl(SAVE_SECRET_URL), formData, {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        if(result.data.status == 0) {
          Utils.reportSuccess(`Secret [${data.name}] saved successfully`)
          setAction(ACTION_NONE)
          // TODO: force secrets reload
        }
        else {
          Utils.reportError(`Unknown error: secret not saved, please try again`)
        }
      }).catch(error => {
        Utils.reportError(`Error while saving new secret: ${error}`)
      }).finally(() => {
        setBusy(false)
      })
    }
    else {
      setAction(ACTION_NONE)
    }
  }

  const submitDataFunc = (action) => ((data) => submitData(action, data))

  return (
    <div>
      <div className="btn-group my-3" role="group" aria-label="New secrets">
        <button type="button" className="btn btn-outline-primary">Create secret: {busy && <Spinner/>}</button>
        <button type="button" className="btn btn-primary" onClick={() => setAction(ACTION_PASS)}>Password</button>
      </div>
      {action == ACTION_PASS && <NewPass token={token} masterPass={masterPass} submitData={submitDataFunc(ACTION_PASS)}/>}
      <h4>Your secrets ({secrets.length})</h4>
    </div>
  )
}

export default SecretList
