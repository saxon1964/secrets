import * as React from 'react'
import * as Utils from '../misc/utils.js'
import useMasterPass from './hooks/useMasterPass.js'
import axios from 'axios'
import styles from './css/Header.module.css'

const LOGOUT_URL = 'logout.php'

const Header = ({email, token, dispatcher}) => {
  const [masterPass, setMasterPass] = useMasterPass('')
  const homeAction = () => dispatcher({type: 'ACTION_HOME'})
  const aboutAction = () => dispatcher({type: 'ACTION_ABOUT'})

  const username = (email) => {
    const pos = email.indexOf('@')
    return email.substring(0, pos)
  }

  const logoutAction = () => {
    if(token != '') {
      axios.post(Utils.getScriptUrl(LOGOUT_URL), new FormData(), {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        if(result.data.status == 0) {
          setMasterPass('')
          Utils.reportSuccess(`Logout successful`)
          console.log(`Logout successful`)
          dispatcher({type: 'ACTION_LOGOUT'})
        }
        else {
          Utils.reportError(`Error while logging out (code: ${result.data.status})`)
        }
      }).catch(error => {
        Utils.reportError(`Error while logging out: ${error}`)
      })
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={homeAction}>
          <span className={styles.logo}><h2><b>My Secrets</b></h2></span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {email.length > 0 && (
              <div className="dropdown">
                <button className="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello <b>{username(email)}</b>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a className="dropdown-item" onClick={homeAction}>HOME</a></li>
                  <li><a className="dropdown-item" onClick={aboutAction}>About this app</a></li>
                  <li><a className="dropdown-item" onClick={logoutAction}>Logout</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header;
