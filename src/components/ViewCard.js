import * as React from 'react'
import * as Utils from '../misc/utils.js'
import HiddenText from './HiddenText.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewCard = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)

  return (
    <div className="alert alert-danger">
      <h5 className="alert-heading mb-0">
        <button className="btn btn-sm btn-primary" onClick={toggle}>
          {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
        </button>&nbsp;&nbsp;
        {secret.name}
      </h5>
      {expanded && (
        <table className="table mt-3 bg-light" style={{width: 'auto'}}>
          <tbody>
            <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
            <tr><td><b>Card type:</b></td><td>{secret.cardType}</td></tr>
            <tr><td><b>Card holder:</b></td><td>{secret.cardHolder}</td></tr>
            <tr><td><b>Card number:</b></td><td><HiddenText text={secret.cardNumber}/></td></tr>
            <tr><td><b>Expires:</b></td><td>{secret.expires}</td></tr>
            <tr><td><b>CVV:</b></td><td>{secret.cvv}</td></tr>
            <tr><td><b>Pin:</b></td><td>{secret.pin}</td></tr>
            <tr><td><b>Account:</b></td><td>{secret.account}</td></tr>
            <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
            <tr>
              <td colSpan="2">
                <button className="btn btn-sm btn-primary me-2" onClick={edit}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={del}>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ViewCard
