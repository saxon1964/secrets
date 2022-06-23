import * as React from 'react';
import Header from './Header.js'
import About from './About.js'
import Footer from './Footer.js'
import Login from './Login.js'
import Register from './Register.js'
import Secrets from './Secrets.js'
import SessionChecker from './SessionChecker.js'
import { useEmail, useToken } from './hooks/usePersistentValue.js'

const Content = () => {
  const [email, setEmail] = useEmail('')
  const [token, setToken] = useToken('')

  const initState = {
    view: 'HOME',
    email: email,
    token: token
  }

  const stateManager = (state, action) => {
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
      case 'ACTION_ABOUT':
        return { ...state, view: 'ABOUT' }
      default:
        throw new Error('Unknown action type')
    }
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  React.useEffect(() => {
    setEmail(state.email)
    setToken(state.token)
  }, [state.email, state.token])

  return (
    <>
      <Header email={state.email} token={state.token} dispatcher={dispatch}/>
      {state.view == 'HOME' && state.email == '' && <Login dispatcher={dispatch}/>}
      {state.view == 'REGISTER' && state.email == '' && <Register dispatcher={dispatch}/>}
      {state.view == 'HOME' && state.email != '' && <Secrets token={state.token}/>}
      {state.view == 'ABOUT' && <About/>}
      <SessionChecker token={state.token} dispatcher={dispatch}/>
      <Footer/>
    </>
  )
}

export default Content
