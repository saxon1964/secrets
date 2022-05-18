import * as React from 'react'
import * as Utils from '../misc/utils.js'
import Mandatory from './Mandatory.js'

const RANDOM_PASSWORD_LENGTH = 12

const EditCard = ({id, data, submitData}) => {
  const [name, setName] = React.useState('')
  const [cardType, setCardType] = React.useState('')
  const [cardHolder, setCardHolder] = React.useState('')
  const [cardNumber, setCardNumber] = React.useState('')
  const [expires, setExpires] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [note, setNote] = React.useState('')

  React.useEffect(() => {
    setName(data.name || '')
    setCardType(data.cardType || '')
    setCardHolder(data.cardHolder || '')
    setCardNumber(data.cardNumber || '')
    setExpires(data.expires || '')
    setCvv(data.cvv || '')
    setNote(data.note || '')
  }, [id])

  const checkForm = (e) => {
    e.preventDefault()
    if(name.length == 0) {
      Utils.reportError('Name must be specified')
    }
    else if(cardType.length == 0) {
      Utils.reportError('Card type must be specified')
    }
    else if(cardHolder.length == 0) {
      Utils.reportError('Card holder must be specified')
    }
    else if(cardNumber.length < 16) {
      Utils.reportError('Invalid card number')
    }
    else if(expires.length != 5) {
      Utils.reportError('Invalid expiry data')
    }
    else if(cvv.length < 3) {
      Utils.reportError('Invalid CVV code')
    }
    else {
      const newData = {
        type: data.type,
        name: name,
        cardType: cardType,
        cardHolder: cardHolder,
        cardNumber: cardNumber,
        expires: expires,
        cvv: cvv,
        note: note
      }
      submitData(id, newData)
    }
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} bank card:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <label htmlFor="name">Name:<Mandatory/></label>
            <input type="text" value={name} id="name" className="form-control" onChange={e => setName(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="cardType">Card type (Visa/Amex/etc.):<Mandatory/></label>
            <input type="text" value={cardType} id="cardType" className="form-control" onChange={e => setCardType(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="cardHolder">Card holder:<Mandatory/></label>
            <input type="text" value={cardHolder} id="cardHolder" className="form-control" onChange={e => setCardHolder(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="cardNumber">Card number:<Mandatory/></label>
            <input type="text" value={cardNumber} id="cardNumber" className="form-control" onChange={e => setCardNumber(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="expires">Expires (mm/yy):<Mandatory/></label>
            <input type="text" value={expires} id="expires" className="form-control" onChange={e => setExpires(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="cvv">CVV:<Mandatory/></label>
            <input type="text" value={cvv} id="cvv" className="form-control" onChange={e => setCvv(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="note">Note:</label>
            <textarea rows="4" value={note} id="note" className="form-control" onChange={e => setNote(e.target.value)}/>
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

export default EditCard
