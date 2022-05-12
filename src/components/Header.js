import * as React from 'react'
import styles from './Header.module.css'
import axios from 'axios'

const Header = ({email, token, dispatcher}) => {
  const homeAction = () => dispatcher({type: 'ACTION_HOME'})

  const logoutAction = () => {
    
    dispatcher({type: 'ACTION_LOGOUT'})
  }

  const username = (email) => {
    const pos = email.indexOf('@')
    return email.substring(0, pos)
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
                  Hello {username(email)}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
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
