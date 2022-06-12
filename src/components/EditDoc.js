import * as React from 'react'
import * as Utils from '../misc/utils.js'
import EditHidden from './EditHidden.js'
import NameField from './NameField.js'
import Mandatory from './Mandatory.js'

const RANDOM_PASSWORD_LENGTH = 12

const EditDoc = ({id, data, submitData}) => {
  const [name, setName] = React.useState(data.name || '')
  const [fullName, setFullName] = React.useState(data.fullName || '')
  const [country, setCountry] = React.useState(data.country || '')
  const [issuer, setIssuer] = React.useState(data.issuer || '')
  const [birth, setBirth] = React.useState(data.birth || '')
  const [number, setNumber] = React.useState(data.number || '')
  const [validFrom, setValidFrom] = React.useState(data.validFrom || '')
  const [validTo, setValidTo] = React.useState(data.validTo || '')
  const [note, setNote] = React.useState(data.note || '')

  React.useEffect(() => {
    setName(data.name || '')
    setFullName(data.fullName || '')
    setCountry(data.country || '')
    setIssuer(data.issuer || '')
    setBirth(data.birth || '')
    setNumber(data.number || '')
    setValidFrom(data.validFrom || '')
    setValidTo(data.validTo || '')
    setNote(data.note || '')
  }, [data.name])

  const checkForm = (e) => {
    e.preventDefault()
    if(name.length == 0) {
      Utils.reportError('Name must be specified')
    }
    else if(number.length == 0) {
      Utils.reportError('Document number must be specified')
    }
    else {
      const newData = {
        type: data.type,
        name: name,
        fullName: fullName,
        country: country,
        issuer: issuer,
        birth: birth,
        number: number,
        validFrom: validFrom,
        validTo: validTo,
        note: note
      }
      submitData(id, newData)
    }
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} document:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <NameField id={id} name={name} setName={setName}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="fullName">Full name:</label>
            <input type="text" value={fullName} id="fullName" className="form-control" onChange={e => setFullName(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="country">Country:</label>
            <input type="text" value={country} id="country" className="form-control" onChange={e => setCountry(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="issuer">Issuer:</label>
            <input type="text" value={issuer} id="issuer" className="form-control" onChange={e => setIssuer(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="birth">Birth date:</label>
            <input type="date" value={birth} id="birth" className="form-control" onChange={e => setBirth(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <EditHidden id="number" label="Document number" value={number} reportValue={setNumber} randomize={undefined}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="validFrom">Valid from:</label>
            <input type="date" value={validFrom} id="validFrom" className="form-control" onChange={e => setValidFrom(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="validTo">Valid to:</label>
            <input type="date" value={validTo} id="validTo" className="form-control" onChange={e => setValidTo(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="note">Note:</label>
            <textarea rows="4" className="form-control" id="note" value={note} onChange={e => setNote(e.target.value)}/>
          </div>
          <div className="col-lg-12 mt-2">
            <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => submitData(id, false)}>Cancel</button>
          </div>
        </div>
      </form>
      <hr/>
    </div>
  )
}

export default EditDoc
