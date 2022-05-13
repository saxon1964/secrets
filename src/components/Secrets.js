import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'

const TARGET_URL = 'getTarget.php'

const Secrets = ({token, dispatcher}) => {
  const [target, setTarget] = React.useState('')

  React.useEffect(() => {
    axios.get(Utils.getScriptUrl(TARGET_URL), {
      headers: Utils.getAuthorizationHeader(token)
    }).then(result => {
      if(result.data.target != target) {
        setTarget(result.data.target)
      }
    }).catch(error => {
      Utils.reportError(`Error while checking if master password is defined: ${error}`)
    })
  }, [token])

  return (
    <div className="container secretContainer">
      <h2>Secrets</h2>
      {target == '' ? (
        <p>It seems that you haven't set your master password yet</p>
      ) : (
        <p>Please enter your master password</p>
      )}
    </div>
  )
}

export default Secrets
