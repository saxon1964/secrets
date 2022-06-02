import * as React from 'react'
import * as Utils from '../misc/utils.js'
import ViewTable from './ViewTable.js'
import HiddenText from './HiddenText.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewCard = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)

  return (
    <ViewTable alertType="alert-danger" secret={secret} expanded={expanded} toggle={toggle} edit={edit} del={del}>
      <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
      <tr><td><b>Card type:</b></td><td>{secret.cardType}</td></tr>
      <tr><td><b>Card holder:</b></td><td>{secret.cardHolder}</td></tr>
      <tr><td><b>Card number:</b></td><td><HiddenText text={secret.cardNumber}/></td></tr>
      <tr><td><b>Expires:</b></td><td>{secret.expires}</td></tr>
      <tr><td><b>CVV:</b></td><td>{secret.cvv}</td></tr>
      <tr><td><b>Pin:</b></td><td>{secret.pin}</td></tr>
      <tr><td><b>Account:</b></td><td>{secret.account}</td></tr>
      <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
    </ViewTable>
  )
}

export default ViewCard
