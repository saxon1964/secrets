import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import MasterPassSelector from './MasterPassSelector.js'
import MasterPassChecker from './MasterPassChecker.js'
import SecretList from './SecretList.js'
import useMasterPass from './useMasterPass.js'
import axios from 'axios'

const TARGET_URL = 'getTarget.php'

const Secrets = ({token}) => {
  const [target, setTarget] = React.useState('')
  const [masterPass, setMasterPass] = useMasterPass('')

  React.useEffect(() => {
    if(masterPass == '') {
      axios.get(Utils.getScriptUrl(TARGET_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        //console.log(result.data)
        if(result.data.target != target) {
          setTarget(result.data.target)
        }
      }).catch(error => {
        Utils.reportError(`Error while checking if master password is defined: ${error}`)
      })
    }
  }, [token])

  const lock = () => setMasterPass('')

  return (
    <div className="container secretContainer">
      <h2>Secrets</h2>
      {masterPass == '' && target == '' && <MasterPassSelector token={token} setMasterPass={setMasterPass}/>}
      {masterPass == '' && target != '' && <MasterPassChecker target={target} setMasterPass={setMasterPass}/>}
      {masterPass != '' && <SecretList token={token} masterPass={masterPass} lock={lock}/>}
    </div>
  )
}

export default Secrets
