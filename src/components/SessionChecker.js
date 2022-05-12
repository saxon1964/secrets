import * as React from 'react'
import * as Utils from '../misc/utils.js'
import axios from 'axios'

const VERIFY_SESSION_URL = 'verifySession.php'
const LOGOUT_URL = 'logout.php'

const SessionChecker = ({token, dispatcher}) => {
  const [lastToken, setLastToken] = React.useState(token)

  React.useEffect(() => {
    console.log("HERE1")
    if(lastToken != '' && token == '') {
      // logout action
      axios.post(Utils.getScriptUrl(LOGOUT_URL), {
        headers: Utils.getAuthorizationHeader(lastToken)
      }).then(result => {
        if(result.data.status == 1) {
          console.log("Session ended")
        }
        else {
          Utils.reportError(`Error while logging out`)
        }
      }).catch(error => {
        Utils.reportError(`Error while ending session: ${error}`)
      })
    }
    setLastToken(token)
  }, [token])

  React.useEffect(() => {
    console.log("HERE2")
    if(token != '') {
      axios.get(Utils.getScriptUrl(VERIFY_SESSION_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        if(result.data.status == 0) {
          // stale session, just invalidate it
          console.log("Invalidating stale session")
          dispatcher({type: 'ACTION_LOGOUT'})
        }
        else {
          console.log("Valid session")
        }
      }).catch(error => {
        Utils.reportError(`Error while verifying session: ${error}`)
      })
    }
    else {
      console.log("Anonimoys session")
    }
  }, [token])
}

export default SessionChecker
