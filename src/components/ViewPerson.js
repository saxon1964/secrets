import * as React from 'react'
import * as Utils from '../misc/utils.js'
import ViewTable from './ViewTable.js'
import ViewFiles from './ViewFiles.js'
import PhotoPreview from './PhotoPreview.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewPerson = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)
  const [previewFile, setPreviewFile] = React.useState(null)

  return (
    <>
      <ViewTable alertType="alert-info" secret={secret} expanded={expanded} toggle={toggle} edit={edit} del={del}>
        <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
        <tr><td><b>Full name:</b></td><td>{secret.fullName}</td></tr>
        <tr><td><b>Birth date:</b></td><td>{Utils.formatIsoDate(secret.birth)}</td></tr>
        <tr><td><b>Address:</b></td><td>{secret.address}</td></tr>
        <tr><td><b>ZIP:</b></td><td>{secret.zip}</td></tr>
        <tr><td><b>City:</b></td><td>{secret.city}</td></tr>
        <tr><td><b>Country:</b></td><td>{secret.country}</td></tr>
        <tr><td><b>Email 1:</b></td><td>{secret.email1}</td></tr>
        <tr><td><b>Email 2:</b></td><td>{secret.email2}</td></tr>
        <tr><td><b>Phone 1:</b></td><td>{secret.phone1}</td></tr>
        <tr><td><b>Phone 2:</b></td><td>{secret.phone2}</td></tr>
        <tr><td><b>Comapny:</b></td><td>{secret.company}</td></tr>
        <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
        <ViewFiles secret={secret} previewFile={setPreviewFile} />
      </ViewTable>
      <PhotoPreview secret={secret} file={previewFile} />
    </>
  )
}

export default ViewPerson
