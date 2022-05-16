import * as React from 'react';
import Header from './Header.js'
import Login from './Login.js'
import Register from './Register.js'
import Secrets from './Secrets.js'
import SessionChecker from './SessionChecker.js'

const Content = () => {
  const initState = {
    view: 'HOME',
    email: localStorage.getItem('email') || '',
    token: localStorage.getItem('token') || ''
  }

  const stateManager = (state, action) => {
    console.log("Dispatcher called: " + action.type)
    console.log(action)
    switch(action.type) {
      case 'ACTION_HOME':
        return { ...state, view: 'HOME' }
      case 'ACTION_LOGOUT':
        return { view: 'HOME', email: '', token: '' }
      case 'ACTION_REGISTER':
        return { view: 'REGISTER', email: '', token: '' }
      case 'ACTION_REGISTERED':
        return { view: 'HOME', email: '', token: '' }
      case 'ACTION_AUTHENTICATED':
        return { view: 'HOME', email: action.payload.email, token: action.payload.token}
      default:
        throw new Error('Unknown action type')
    }
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  React.useEffect(() => {
    localStorage.setItem('email', state.email)
    localStorage.setItem('token', state.token)
  }, [state.email, state.token])

  return (
    <>
      <Header email={state.email} token={state.token} dispatcher={dispatch}/>
      {state.view == 'HOME' && state.email == '' && <Login dispatcher={dispatch}/>}
      {state.view == 'REGISTER' && state.email == '' && <Register dispatcher={dispatch}/>}
      {state.view == 'HOME' && state.email != '' && <Secrets token={state.token}/>}
      <SessionChecker token={state.token} dispatcher={dispatch}/>
    </>
  )
}

export default Content
