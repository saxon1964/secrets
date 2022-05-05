import * as React from 'react'
import styles from './Header.module.css'

const Header = ({username, dispatcher}) => {
  const logoutAction = () => {
    dispatcher({
      type: 'ACTION_LOGOUT'
    })
  }

  const homeAction = () => {
    dispatcher({
      type: 'ACTION_HOME'
    })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={() => homeAction()}>
          <span className={styles.logo}><h2>My Secrets</h2></span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {username.length > 0 && (
              <div className="dropdown">
                <button className="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello {username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a className="dropdown-item" onClick={() => logoutAction()}>Logout</a></li>
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
