import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Mandatory from './Mandatory.js'

const RANDOM_PASSWORD_LENGTH = 12

const EditPerson = ({id, data, submitData}) => {
  const [name, setName] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [birth, setBirth] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [zip, setZip] = React.useState('')
  const [city, setCity] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [email1, setEmail1] = React.useState('')
  const [email2, setEmail2] = React.useState('')
  const [phone1, setPhone1] = React.useState('')
  const [phone2, setPhone2] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [note, setNote] = React.useState('')

  React.useEffect(() => {
    setName(data.name || '')
    setFullName(data.fullName || '')
    setBirth(data.birth || '')
    setAddress(data.address || '')
    setZip(data.zip || '')
    setCity(data.city || '')
    setCountry(data.country || '')
    setEmail1(data.email1 || '')
    setEmail2(data.email2 || '')
    setPhone1(data.phone1 || '')
    setPhone2(data.phone2 || '')
    setCompany(data.company || '')
    setNote(data.note || '')
  }, [id])

  const checkForm = (e) => {
    e.preventDefault()
    if(name.length == 0) {
      Utils.reportError('Name must be specified')
    }
    else if(fullName.length == 0) {
      Utils.reportError('Full name must be specified')
    }
    else {
      const newData = {
        type: data.type,
        name: name,
        fullName: fullName,
        birth: birth,
        address: address,
        zip: zip,
        city: city,
        country: country,
        email1: email1,
        email2: email2,
        phone1: phone1,
        phone2: phone2,
        company: company,
        note: note
      }
      submitData(id, newData)
    }
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} password:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <label htmlFor="name">Name:<Mandatory/></label>
            <input type="text" value={name} id="name" className="form-control" onChange={e => setName(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="fullName">Full name:<Mandatory/></label>
            <input type="text" value={fullName} id="fullName" className="form-control" onChange={e => setFullName(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="birth">Birth date:</label>
            <input type="date" value={birth} id="birth" className="form-control" onChange={e => setBirth(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="address">Address:</label>
            <input type="text" value={address} id="address" className="form-control" onChange={e => setAddress(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="zip">ZIP:</label>
            <input type="text" value={zip} id="zip" className="form-control" onChange={e => setZip(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="city">City:</label>
            <input type="text" value={city} id="city" className="form-control" onChange={e => setCity(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="country">Country:</label>
            <input type="text" value={country} id="country" className="form-control" onChange={e => setCountry(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="email1">Email 1:</label>
            <input type="text" value={email1} id="email1" className="form-control" onChange={e => setEmail1(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="email2">Email 2:</label>
            <input type="text" value={email2} id="email2" className="form-control" onChange={e => setEmail2(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="phone1">Phone 1:</label>
            <input type="text" value={phone1} id="phone1" className="form-control" onChange={e => setPhone1(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="phone2">Phone 2:</label>
            <input type="text" value={phone2} id="phone2" className="form-control" onChange={e => setPhone2(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="company">Phone 2:</label>
            <input type="text" value={company} id="company" className="form-control" onChange={e => setCompany(e.target.value)}/>
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

export default EditPerson
