import * as React from 'react'
import * as Utils from '../misc/utils.js'
import axios from 'axios'
import Spinner     from './Spinner.js'
import EditPass    from './EditPass.js'
import EditCard    from './EditCard.js'
import EditNote    from './EditNote.js'
import EditDoc     from './EditDoc.js'
import EditPerson  from './EditPerson.js'
import ViewPass    from './ViewPass.js'
import ViewCard    from './ViewCard.js'
import ViewDoc     from './ViewDoc.js'
import ViewPerson  from './ViewPerson.js'
import ViewNote    from './ViewNote.js'

const TYPE_NONE       = ''
const TYPE_PASS       = 'Password'
const TYPE_CARD       = 'Bank card'
const TYPE_NOTE       = 'Secret note'
const TYPE_DOC        = 'Document'
const TYPE_PERSON     = 'Person'

const ACTION_LOAD_SECRETS = 1
const ACTION_SECRETS_LOADED = 2
const ACTION_NEW_SECRET = 3
const ACTION_IDLE = 4
const ACTION_SAVE_SECRET = 5
const ACTION_SECRET_SAVED = 6
const ACTION_EDIT_SECRET = 7
const ACTION_DELETE_SECRET = 8
const ACTION_SECRET_DELETED = 9
const ACTION_SET_FILTER = 10

const SAVE_SECRET_URL   = 'saveSecret.php'
const GET_SECRETS_URL   = 'getSecrets.php'
const DELETE_SECRET_URL = 'deleteSecret.php'
const TIMEOUT_SECONDS   = 600 // seconds
const CHECK_INTERVAL    = 10 // seconds

const SecretList = ({token, masterPass, lock}) => {
  const [lastActionTimestamp, setLastActionTimestamp] = React.useState(Utils.getTimestamp())
  const lastActionRef = React.useRef()
  lastActionRef.current = lastActionTimestamp

  // registe timestamp of the last action
  const registerAction = () => {
    const ts = Utils.getTimestamp()
    setLastActionTimestamp(ts)
    //console.log(`Last action timestamp set to ${ts}`)
  }


  // JUST DISPLAY lastActionTimestamp
  React.useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Utils.getTimestamp() - lastActionRef.current
      // console.log(`Elapsed: ${elapsed} secs`)
      if(elapsed >= TIMEOUT_SECONDS) {
        lock()
      }
    }, CHECK_INTERVAL * 1000)
    return () => clearInterval(timer)
  }, [])

  const initState = {
    secrets: [],
    loadingSecrets: true,
    editSecret: {
      id: 0,
      data: {
        type: TYPE_NONE
      }
    },
    savingSecret: false,
    deletingSecret: false,
    filter: ''
  }

  const stateManager = (state, action) => {
    registerAction()
    switch(action.type) {
      case ACTION_IDLE:
        return {...state, editSecret: {id: 0, data: {type: TYPE_NONE}}}
      case ACTION_LOAD_SECRETS:
        return {...state, loadingSecrets: true}
      case ACTION_SECRETS_LOADED:
        return {...state, secrets: action.payload, loadingSecrets: false}
      case ACTION_NEW_SECRET:
        return {...state, editSecret: {id: 0, data: {type: action.payload}}}
      case ACTION_EDIT_SECRET:
        return {...state, editSecret: action.payload}
      case ACTION_SAVE_SECRET:
        return {...state, editSecret: action.payload, savingSecret: true}
      case ACTION_DELETE_SECRET:
        return {...state, editSecret: action.payload, deletingSecret: true}
      case ACTION_SECRET_SAVED:
        return {...state, editSecret: {id: 0, data: {type: TYPE_NONE}}, savingSecret: false}
      case ACTION_SECRET_DELETED:
        return {...state, editSecret: {id: 0, data: {type: TYPE_NONE}}, deletingSecret: false}
      case ACTION_SET_FILTER:
        return {...state, filter: action.payload}
      default:
        throw new Error('Unknown action type: ' + action.type)
    }
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  // LOAD SECRETS
  React.useEffect(() => {
    let secrets = []
    if(state.loadingSecrets) {
      axios.get(Utils.getScriptUrl(GET_SECRETS_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        secrets = result.data.map(secret => {
           let decrypted = JSON.parse(Utils.decrypt(masterPass, secret.secret))
           decrypted.id = secret.id
           return decrypted
        })
        //console.log(secrets)
        secrets.sort((s1, s2) => s1.name.localeCompare(s2.name))
      }).catch(error => {
        Utils.reportError(`Error while loading secrets: ${error}`)
      }).finally(() => {
        dispatch({type: ACTION_SECRETS_LOADED, payload: secrets})
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
        dispatch({type: ACTION_SECRET_SAVED})
        if(result.data.status == 0) {
          Utils.reportSuccess(`Secret [${data.name}] saved successfully`)
          dispatch({type: ACTION_LOAD_SECRETS})
        }
        else {
          throw Error(`Unknown backend error: secret not saved`)
        }
      }).catch(error => {
        dispatch({type: ACTION_SECRET_SAVED})
        Utils.reportError(`Error while saving secret: ${error}`)
      })
    }
  }, [state.savingSecret])

  // DELETEING SECRET
  React.useEffect(() => {
    if(state.deletingSecret) {
      const id = state.editSecret.id
      const data = state.editSecret.data
      const formData = new FormData()
      formData.append('id', id)
      axios.post(Utils.getScriptUrl(DELETE_SECRET_URL), formData, {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        dispatch({type: ACTION_SECRET_DELETED})
        if(result.data.status == 0) {
          Utils.reportSuccess(`Secret [${data.name}] deleted successfully`)
          dispatch({type: ACTION_LOAD_SECRETS})
        }
        else {
          throw Error(`Unknown backend error: secret not deleted`)
        }
      }).catch(error => {
        dispatch({type: ACTION_SECRET_DELETED})
        Utils.reportError(`Error while saving secret: ${error}`)
      })
    }
  }, [state.deletingSecret])

  // NEW SECRET
  const newSecret = (secretType) => {
    dispatch({type: ACTION_NEW_SECRET, payload: secretType})
  }

  // SAVE SECRET
  const saveSecret = (id, data) => {
    if(data === false) {
      dispatch({type: ACTION_IDLE})
      return
    }
    if(state.secrets.find(secret => secret.name == data.name && secret.id != id)) {
      Utils.reportError(`Secret with name [${data.name}] already exists. Please choose different name`)
      return
    }
    dispatch({type: ACTION_SAVE_SECRET, payload: {id: id, data: data}})
  }

  // EDIT/DELETE SECRET
  const secretAction = (id) => {
    if(id == 0) {
      dispatch({type: ACTION_IDLE})
      return
    }
    const secret = state.secrets.find(secret => secret.id == Math.abs(id))
    const payload = {id: Math.abs(id), data: secret}
    if(id >= 0) {
      dispatch({type: ACTION_EDIT_SECRET, payload: payload})
    }
    else {
      // delete secret
      const question = `Are you sure that you want to delete secret [${secret.name}]?`
      Utils.confirmAction('Delete', question).then(result => {
        if(result.isConfirmed) {
          dispatch({type: ACTION_DELETE_SECRET, payload: payload})
        }
      })
    }
  }

  const handleFilterChange = (e) => dispatch({type: ACTION_SET_FILTER, payload: e.target.value})
  const clearFilter = (e) => dispatch({type: ACTION_SET_FILTER, payload: ''})
  const filterLower = state.filter.toLowerCase()
  const filteredSecrets = state.secrets.filter(secret => secret.name.toLowerCase().includes(filterLower))

  const busy = state.loadingSecrets || state.savingSecret || state.deletingSecret

  const buttonGroup = (
    <>
      <button type="button" className="btn btn-primary" onClick={() => newSecret(TYPE_PASS)}>Password</button>
      <button type="button" className="btn btn-danger" onClick={() => newSecret(TYPE_CARD)}>Card</button>
      <button type="button" className="btn btn-success" onClick={() => newSecret(TYPE_DOC)}>ID</button>
      <button type="button" className="btn btn-info" onClick={() => newSecret(TYPE_PERSON)}>Person</button>
      <button type="button" className="btn btn-warning" onClick={() => newSecret(TYPE_NOTE)}>Note</button>
    </>
  )

  return (
    <div>
      <h4 className="mt-3">Create new secret:</h4>
      <div className="btn-group mb-3 d-none d-md-block" role="group" aria-label="New secrets">
        {buttonGroup}
      </div>
      <div className="btn-group-vertical mb-3 d-xs-inline-flex d-md-none" role="group" aria-label="New secrets">
        {buttonGroup}
      </div>
      {state.editSecret.data.type == TYPE_PASS &&
        <EditPass id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      {state.editSecret.data.type == TYPE_CARD &&
        <EditCard id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      {state.editSecret.data.type == TYPE_DOC &&
        <EditDoc id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      {state.editSecret.data.type == TYPE_PERSON &&
        <EditPerson id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      {state.editSecret.data.type == TYPE_NOTE &&
        <EditNote id={state.editSecret.id} data={state.editSecret.data} submitData={saveSecret}/>}
      <div className="row mb-3">
        <div className="col-lg-4 mt-2">
          <h5>
            Secrets: {state.secrets.length}&nbsp;
            {state.filter != '' && <small className="text-primary">({filteredSecrets.length} shown)&nbsp;</small>}
            {busy && <span className="text-danger"><Spinner/></span>}
          </h5>
        </div>
        <div className="col-lg-4 mt-2">
          <div className="input-group">
            <input className="form-control" placeholder="Filter secrets by name" type="text"
              value={state.filter} onChange={handleFilterChange}/>
            <div className="input-group-append">
              <button className="btn btn-danger" type="button" title="Clear filter" onClick={clearFilter}>
                <i className="fa-solid fa-xmark"/>
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mt-2">
          <button type="button" className="btn btn-danger" onClick={lock}>Lock screen</button>
        </div>
      </div>
      <div className="row">
        {filteredSecrets.map(secret => {
          return (
            <div  className="col-lg-4" key={secret.id}>
              {secret.type == TYPE_PASS    && <ViewPass   secret={secret} secretAction={secretAction}/>}
              {secret.type == TYPE_CARD    && <ViewCard   secret={secret} secretAction={secretAction}/>}
              {secret.type == TYPE_DOC     && <ViewDoc    secret={secret} secretAction={secretAction}/>}
              {secret.type == TYPE_PERSON  && <ViewPerson secret={secret} secretAction={secretAction}/>}
              {secret.type == TYPE_NOTE    && <ViewNote   secret={secret} secretAction={secretAction}/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SecretList
