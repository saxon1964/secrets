import * as React from 'react'
import * as Utils from '../misc/utils.js'

const MIN_MASTER_PASS_LENGTH = 8
const MASTER_PASS_RETRY_INTERVAL = 10 // seconds

const MasterPassChecker = ({target, setMasterPass}) => {
  const [master, setMaster] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)

  const handleMasterChange = (e) => setMaster(e.target.value)

  const checkForm = (e) => {
    e.preventDefault()
    try {
      setDisabled(true)
      if (master.length < MIN_MASTER_PASS_LENGTH) {
        // wrong password length
        throw Error(`Master password must be at least ${MIN_MASTER_PASS_LENGTH} chars long`)
      }
      const decrypted = Utils.decrypt(master, target)
      if (typeof decrypted !== 'string' || decrypted.length == 0) {
        // decryption has failed
        throw Error('Wrong master password')
      }
      else {
        // everything ok
        setMasterPass(master)
        setDisabled(false)
      }
    }
    catch (error) {
      Utils.reportError(error)
      setTimeout(() => {
        setDisabled(false)
      }, MASTER_PASS_RETRY_INTERVAL * 1000)
    }
  }

  return (
    <div>
      <h4>Enter your master password</h4>
      <form onSubmit={checkForm}>
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="master">Master password:</label>
            <input disabled={disabled} className="form-control" type="password" id="master"
              value={master} onChange={handleMasterChange}/>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <button disabled={disabled} type="submit" className="btn btn-sm btn-primary">
              Submit&nbsp;
              {disabled? '(please wait)': ''}
            </button>
          </div>
        </div>
      </form>
      <div className="row mt-3">
        <div className="col-lg-6">
          <p>Your master password is not storred anywhere. It's never transmitted
          over the internet, either in plain or encrypted form.</p>

          <p>However, we are still able to check its validity:
          when you picked your master password we encrypted some random "lorem ipsum" text with it and the encrypted
          text was saved in the database. By entering your master password your are trying to decrypt that text
          on your local machine. If it fails, your master password is wrong.</p>
        </div>
      </div>
    </div>
  )
}

export default MasterPassChecker
