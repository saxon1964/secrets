import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'
import EditPass from './EditPass.js'

const TYPE_NONE       = 0
const TYPE_PASS       = 1

const ACTION_LOAD_SECRETS = 1
const ACTION_SECRETS_LOADED = 2
const ACTION_NEW_SECRET = 3
const ACTION_IDLE = 4

const SAVE_SECRET_URL   = 'saveSecret.php'
const GET_SECRETS_URL   = 'getSecrets.php'

const SecretList = ({token, masterPass}) => {
  const initState = {
    secrets: [],
    loadingSecrets: true,
    editSecret: {
      id: 0,
      type: TYPE_NONE
    }
  }

  const stateManager = (state, action) => {
    switch(action.type) {
      case ACTION_IDLE:
        return {...state, editSecret: {id: 0, type: TYPE_NONE}}
      case ACTION_LOAD_SECRETS:
        return {...state, loadingSecrets: true}
      case ACTION_SECRETS_LOADED:
        return {...state, secrets: action.payload, loadingSecrets: false}
      case ACTION_NEW_SECRET:
        return {...state, editSecret: {id: 0, type: action.payload}}
      default:
        throw new Error('Unknown action type')
    }
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  // LOAD SECRETS UPON REQUEST
  React.useEffect(() => {
    if(state.loadingSecrets) {
      axios.get(Utils.getScriptUrl(GET_SECRETS_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        const secrets = result.data.map(secret => Utils.decrypt(masterPass, secret.secret))
        const action = {type: ACTION_SECRETS_LOADED, payload: secrets}
        dispatch(action)
      }).catch(error => {
        Utils.reportError(`Error while saving new secret: ${error}`)
      })
    }
  }, [state.loadingSecrets])
/*
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
*/
  const newSecret = (secretType) => {
    dispatch({type: ACTION_NEW_SECRET, payload: secretType})
  }

  const saveSecret = (data) => {
    // data == false means cancel edit
    if(data === false) {
      dispatch(ACTION_IDLE)
      return
    }
    console.log(data)
  }

  return (
    <div>
      <div className="btn-group my-3" role="group" aria-label="New secrets">
        <button type="button" className="btn btn-outline-primary">Create secret: {state.loadingSecrets && <Spinner/>}</button>
        <button type="button" className="btn btn-primary" onClick={() => newSecret(TYPE_PASS)}>Password</button>
      </div>
      {state.editSecret.type == TYPE_PASS && <EditPass data={state.editSecret} submitData={saveSecret}/>}
      <h4>Your secrets ({state.secrets.length})</h4>
    </div>
  )
}

export default SecretList
