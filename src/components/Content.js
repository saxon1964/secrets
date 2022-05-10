import * as React from 'react';
import Header from './Header.js'
import Login from './Login.js'
import Register from './Register.js'

const Content = () => {
  const stateManager = (state, action) => {
    switch(action.type) {
      case 'ACTION_HOME':
        return { email: state.email, view: 'HOME', token: state.token }
      case 'ACTION_LOGOUT':
        return { email: '', view: 'HOME', token: '' }
      case 'ACTION_REGISTER':
        return { email: '', view: 'REGISTER', token: '' }
      case 'ACTION_AUTHENTICATED':
        return { email: action.payload.email, view: 'HOME', token: action.payload.token}
      default:
        throw new Error('Unknown action type')
    }
  }

  const initState = {
    email: '',
    view: 'HOME',
    token: ''
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  return (
    <>
      <Header email={state.email} dispatcher={dispatch}/>
      {state.view == 'HOME' && state.email == '' && <Login dispatcher={dispatch}/>}
      {state.view == 'REGISTER' && state.email == '' && <Register dispatcher={dispatch}/>}
      {state.view == 'HOME' && state.email != ''  && state.token != '' && <Secrets dispatcher={dispatch}/>}
    </>
  )
}

export default Content
