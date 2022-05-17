import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'
import EditPass from './EditPass.js'
import ViewPass from './ViewPass.js'


const TYPE_NONE       = 0
const TYPE_PASS       = 1

const ACTION_LOAD_SECRETS = 1
const ACTION_SECRETS_LOADED = 2
const ACTION_NEW_SECRET = 3
const ACTION_IDLE = 4
const ACTION_SAVE_SECRET = 5
const ACTION_SECRET_SAVED = 6

const SAVE_SECRET_URL   = 'saveSecret.php'
const GET_SECRETS_URL   = 'getSecrets.php'

const SecretList = ({token, masterPass}) => {
  const initState = {
    secrets: [],
    loadingSecrets: true,
    editSecret: {
      id: 0,
      data: {
        type: TYPE_NONE
      }
    },
    savingSecret: false
  }

  const stateManager = (state, action) => {
    switch(action.type) {
      case ACTION_IDLE:
        return {...state, editSecret: {id: 0, data: {type: TYPE_NONE}}}
      case ACTION_LOAD_SECRETS:
        return {...state, loadingSecrets: true}
      case ACTION_SECRETS_LOADED:
        return {...state, secrets: action.payload, loadingSecrets: false}
      case ACTION_NEW_SECRET:
        return {...state, editSecret: {id: 0, data: {type: action.payload}}}
      case ACTION_SAVE_SECRET:
        return {...state, editSecret: action.payload, savingSecret: true}
      case ACTION_SECRET_SAVED:
        return {...state, editSecret: {id: 0, data: {type: TYPE_NONE}}, savingSecret: false}
      default:
        throw new Error('Unknown action type: ' + action.type)
    }
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  // LOAD SECRETS
  React.useEffect(() => {
    if(state.loadingSecrets) {
      axios.get(Utils.getScriptUrl(GET_SECRETS_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        const secrets = result.data.map(secret => {
          let decrypted = JSON.parse(Utils.decrypt(masterPass, secret.secret))
          decrypted.id = secret.id
          return decrypted
        })
        secrets.sort((s1, s2) => s1.name.localeCompare(s2.name))
        console.log(secrets)
        dispatch({type: ACTION_SECRETS_LOADED, payload: secrets})
      }).catch(error => {
        Utils.reportError(`Error while loading secrets: ${error}`)
      })
    }
  }, [state.loadingSecrets])

  // SAVING SECRET
  React.useEffect(() => {
    if(state.savingSecret) {
      const id = state.editSecret.id
      const data = state.editSecret.data
      const secret = Utils.encrypt(masterPass, JSON.stringify(data))
      const formData = new FormData()
      formData.append('id', id)
      formData.append('secret', secret)
      axios.post(Utils.getScriptUrl(SAVE_SECRET_URL), formData, {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        if(result.data.status == 0) {
          Utils.reportSuccess(`Secret [${data.name}] saved successfully`)
          dispatch({type: ACTION_SECRET_SAVED})
          dispatch({type: ACTION_LOAD_SECRETS})
        }
        else {
          Utils.reportError(`Unknown error: secret not saved, please try again`)
        }
      }).catch(error => {
        Utils.reportError(`Error while saving secret: ${error}`)
      })
    }
  }, [state.savingSecret])

  const newSecret = (secretType) => {
    dispatch({type: ACTION_NEW_SECRET, payload: secretType})
  }

  const saveSecret = (id, data) => {
    // data == false means cancel edit
    if(data === false) {
      dispatch({type: ACTION_IDLE})
      return
    }
    dispatch({type: ACTION_SAVE_SECRET, payload: {id: id, data: data}})
  }

  return (
    <div>
      <div className="btn-group my-3" role="group" aria-label="New secrets">
        <button type="button" className="btn btn-outline-primary">Create secret:</button>
        <button type="button" className="btn btn-primary" onClick={() => newSecret(TYPE_PASS)}>Password</button>
      </div>
      {state.editSecret.data.type == TYPE_PASS &&
        <EditPass id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      <h4>Your secrets ({Object.keys(state.secrets).length}) {state.loadingSecrets && <Spinner/>}</h4>
      <div className="row">
        {state.secrets.map(secret =>
          <>
            <ViewPass secret={secret} key={secret.id}/>
          </>
        })}
      </div>
    </div>
  )
}

export default SecretList
