import * as React from 'react'
import * as Utils from '../misc/utils.js'
import axios from 'axios'

const VERIFY_SESSION_URL = 'verifySession.php'
const LOGOUT_URL = 'logout.php'

const SessionChecker = ({token, dispatcher}) => {

  React.useEffect(() => {
    if(token != '') {
      //console.log(`Checking session for token: ${token}`)
      axios.get(Utils.getScriptUrl(VERIFY_SESSION_URL), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        //console.log(result.data)
        if(result.data.status == 0) {
          console.log("Invalidating session that is no longer in the database")
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
      console.log("Anonymous session")
    }
  }, [token])

}

export default SessionChecker
