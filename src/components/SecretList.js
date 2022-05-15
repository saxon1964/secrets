import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Spinner from './Spinner.js'
import axios from 'axios'
import NewPass from './NewPass.js'

const ACTION_NONE       = 0
const ACTION_PASS       = 1

const SecretList = ({token, masterPass}) => {
  const [action, setAction] = React.useState(0)

  const cancel = () => {
    setAction(0)
  }

  return (
    <div>
      <div className="btn-group my-3" role="group" aria-label="New secrets">
        <button type="button" className="btn btn-outline-primary">Create secret: </button>
        <button type="button" className="btn btn-primary" onClick={() => setAction(ACTION_PASS)}>Password</button>
      </div>
      {action == ACTION_PASS && <NewPass token={token} masterPass={masterPass} cancel={cancel}/>}
      <h4>Your secrets:</h4>
    </div>
  )
}

export default SecretList
