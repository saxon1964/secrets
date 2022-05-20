import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Mandatory from './Mandatory.js'

const EditHidden = ({id, label, value, reportValue, randomize}) => {
  const [inputType, setInputType] = React.useState('password')

  const toggleInputControlType = () => setInputType(inputType == 'password'? 'text': 'password')
  const setRandomValue = () => reportValue(randomize())

  return (
    <>
      <label htmlFor={id}>{label}:<Mandatory/></label>
      <div className="input-group">
        <input type={inputType} value={value} id={id} className="form-control" onChange={e => reportValue(e.target.value)}/>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" title="Toggle visibility" onClick={toggleInputControlType}>
            {inputType == 'password'? <i className="fa-solid fa-eye"/>: <i className="fa-solid fa-eye-slash"/>}
          </button>
          {randomize && (
            <button className="btn btn-outline-secondary" type="button" title="Create random value" onClick={setRandomValue}>
              <i className="fa-solid fa-pencil"/>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default EditHidden
