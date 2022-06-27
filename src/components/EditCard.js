import * as React from 'react'
import * as Utils from '../misc/utils.js'
import EditHidden from './EditHidden.js'
import NameField from './NameField.js'
import Mandatory from './Mandatory.js'
import EditFiles from './EditFiles.js'

const RANDOM_PASSWORD_LENGTH = 12

const EditCard = ({id, data, submitData}) => {
  const [name, setName] = React.useState(data.name || '')
  const [cardType, setCardType] = React.useState(data.cardType || '')
  const [cardHolder, setCardHolder] = React.useState(data.cardHolder || '')
  const [cardNumber, setCardNumber] = React.useState(data.cardNumber || '')
  const [expires, setExpires] = React.useState(data.expires || '')
  const [cvv, setCvv] = React.useState(data.cvv || '')
  const [pin, setPin] = React.useState(data.pin || '')
  const [account, setAccount] = React.useState(data.account || '')
  const [note, setNote] = React.useState(data.note || '')

  React.useEffect(() => {
    setName(data.name || '')
    setCardType(data.cardType || '')
    setCardHolder(data.cardHolder || '')
    setCardNumber(data.cardNumber || '')
    setExpires(data.expires || '')
    setCvv(data.cvv || '')
    setPin(data.pin || '')
    setAccount(data.account || '')
    setNote(data.note || '')
  }, [data.name])

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
    else {
      const newData = {
        type: data.type,
        name: name,
        cardType: cardType,
        cardHolder: cardHolder,
        cardNumber: cardNumber,
        expires: expires,
        cvv: cvv,
        pin: pin,
        account: account,
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
            <NameField id={id} name={name} setName={setName}/>
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
            <EditHidden id="cardNumber" label="Card number" value={cardNumber} reportValue={setCardNumber} randomize={undefined}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="expires">Expires (mm/yy):</label>
            <input type="text" value={expires} id="expires" className="form-control" onChange={e => setExpires(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="cvv">CVV:</label>
            <input type="text" value={cvv} id="cvv" className="form-control" onChange={e => setCvv(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="pin">Pin:</label>
            <input type="text" value={pin} id="pin" className="form-control" onChange={e => setPin(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="account">Bank account:</label>
            <input type="text" value={account} id="account" className="form-control" onChange={e => setAccount(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="note">Note:</label>
            <textarea rows="4" value={note} id="note" className="form-control mb-2" onChange={e => setNote(e.target.value)} />
            <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => submitData(id, false)}>Cancel</button>
          </div>
          <div className="col-lg-6 mt-2">
            <EditFiles id={id} />
          </div>
        </div>
      </form>
      <hr/>
    </div>
  )
}

export default EditCard
