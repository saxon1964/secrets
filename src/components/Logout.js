import * as React from 'react'
import * as Utils from '../misc/utils.js'
import axios from 'axios'

const VERIFY_SESSION_URL = 'verifySession.php'
const LOGOUT_URL = 'logout.php'

const SessionChecker = ({token, dispatcher}) => {
  const [lastToken, setLastToken] = React.useState(token)

  React.useEffect(() => {
    if(lastToken != '' && token == '') {
      console.log(`Logout action requested`)
      // logout action
      axios.post(Utils.getScriptUrl(LOGOUT_URL), new FormData(), {
        headers: Utils.getAuthorizationHeader(lastToken)
      }).then(result => {
        //console.log(result.data)
        if(result.data.status == 0) {
          Utils.reportSuccess(`Logout successful`)
          console.log(`Logout successful`)
        }
        else {
          Utils.reportError(`Error while logging out [code ${result.data.status}]`)
        }
      }).catch(error => {
        Utils.reportError(`Error while ending session: ${error}`)
      })
    }
    setLastToken(token)
  }, [token])

  React.useEffect(() => {
    if(token != '') {
      console.log(`Checking session for token: ${token}`)
      axios.get(Utils.getScriptUrl(VERIFY_SESSION_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        console.log(result.data)
        if(result.data.status == 0) {
          // stale session, just invalidate it
          Utils.reportError("Your session is no longer valid. Logging you out")
          console.log("Invalidating stale session")
          dispatcher({type: 'ACTION_LOGOUT'})
        }
        else {
          console.log("Valid session")
        }
      })/*.catch(error => {
        Utils.reportError(`Error while verifying session: ${error}`)
      })*/
    }
    else {
      console.log("Anonimoys session")
    }
  }, [token])
}

export default SessionChecker
