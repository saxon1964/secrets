import * as React from 'react';
import Header from './Header.js'
import Login from './Login.js'
import Register from './Register.js'

const Content = () => {
  const stateManager = (state, action) => {
    switch(action.type) {
      case 'ACTION_HOME':
        return { username: state.username, view: 'HOME' }
      case 'ACTION_LOGOUT':
        return { username: '', view: 'HOME' }
      case 'ACTION_REGISTER':
        return { username: '', view: 'REGISTER' }
      default:
        throw new Error('Unknown action type')
    }
  }

  const initState = {
    username: '',
    view: 'HOME'
  }

  const [state, dispatch] = React.useReducer(stateManager, initState)

  return (
    <>
      <Header username={state.username} dispatcher={dispatch}/>
      {state.view == 'HOME' && state.username == '' && <Login dispatcher={dispatch}/>}
      {state.view == 'REGISTER' && state.username == '' && <Register dispatcher={dispatch}/>}
    </>
  )
}

export default Content
