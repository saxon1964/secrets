import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const TARGET_SET_URL = 'setTarget.php'
const MIN_MASTER_PASS_LENGTH = 8

const MasterPassSelector = ({token, setMasterPass}) => {
  const [master1, setMaster1] = React.useState('')
  const [master2, setMaster2] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const handleMaster1Change = (e) => setMaster1(e.target.value)
  const handleMaster2Change = (e) => setMaster2(e.target.value)

  const checkForm = (e) => {
    e.preventDefault()
    if(master1.length < MIN_MASTER_PASS_LENGTH) {
      Utils.reportError(`Master password must be at least ${MIN_MASTER_PASS_LENGTH} chars long`)
    }
    else if(master1 != master2) {
      Utils.reportError("Master passwords do not match")
    }
    else {
      setSending(true)
    }
  }

  React.useEffect(() => {
    if(!sending) {
      return
    }
    // get random word
    const target = Utils.randomString(64)
    const encrypted = Utils.encrypt(master1, target)
    const data = new FormData()
    data.append('target', encrypted)
    axios.post(Utils.getScriptUrl(TARGET_SET_URL), data, {
      headers: Utils.getAuthorizationHeader(token)
    }).then(result => {
      console.log(result.data)
      if(result.data.status == 0) {
        Utils.reportSuccess(`Master password successfully created`)
        setMasterPass(master1)
      }
      else {
        Utils.reportError(`Unknown error: master password not created`)
      }
    }).catch(error => {
      Utils.reportError(`Error while creating master password: ${error}`)
    }).finally(() => {
      setSending(false)
    })
  }, [sending])

  return (
    <div>
      <h4>Create your master password</h4>
      <p>It seems that you have not defined your master password yet. You have to do it now.</p>
      <p><b>The master password will never be transmitted over the internet and it won't be stored anywhere.</b></p>
      <p>
        If you lose it or foget it, it's gone forever, kaputt. In that case, all your secrets
        will be lost. So choose your master password carefully, write it down, and <b>store it in some
        well protected, secret place</b>.
      </p>
      <form onSubmit={checkForm}>
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="master1">Master password:</label>
            <input className="form-control" type="password" id="master1"
              value={master1} onChange={handleMaster1Change}/>
          </div>
          <div className="col-lg-6">
            <label htmlFor="master2">Retype master password:</label>
            <input className="form-control" type="password" id="master2"
              value={master2} onChange={handleMaster2Change}/>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <button type="submit" className="btn btn-sm btn-primary">
              Submit {sending && <Spinner/>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MasterPassSelector
