import * as React from 'react'
import * as Utils from '../misc/utils.js'

const MIN_MASTER_PASS_LENGTH = 8

const MasterPassChecker = ({target, setMasterPass}) => {
  const [master, setMaster] = React.useState('')

  const handleMasterChange = (e) => setMaster(e.target.value)

  const checkForm = (e) => {
    e.preventDefault()
    if(master.length < MIN_MASTER_PASS_LENGTH) {
      Utils.reportError(`Master password must be at least ${MIN_MASTER_PASS_LENGTH} chars long`)
    }
    else {
      try {
        const decrypted = Utils.decrypt(master, target)
        if(typeof decrypted === 'string' && decrypted.length > 0) {
          setMasterPass(master)
        }
        else {
          // decryption has failed
          throw Error()
        }
      }
      catch(error) {
        Utils.reportError("Wrong master password")
      }
    }
  }

  return (
    <div>
      <h4>Enter your master password</h4>
      <form onSubmit={checkForm}>
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="master">Master password:</label>
            <input className="form-control" type="password" id="master"
              value={master} onChange={handleMasterChange}/>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <button type="submit" className="btn btn-sm btn-primary">
              Submit
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
