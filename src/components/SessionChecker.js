import * as React from 'react'
import * as Utils from '../misc/utils.js'
import axios from 'axios'

const VERIFY_SESSION_URL = 'verifySession.php'

const SessionChecker = ({token, dispatcher}) => {
  React.useEffect(() => {
    if(token != '') {
      axios.get(Utils.getScriptUrl(VERIFY_SESSION_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        if(result.data.status == 0) {
          // stale session, just invalidate it
          console.log("Invalidating stale session.")
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
