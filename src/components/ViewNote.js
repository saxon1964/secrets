import * as React from 'react'
import ViewTable from './ViewTable.js'
import ViewFiles from './ViewFiles.js'
import PhotoPreview from './PhotoPreview.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewNote = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)
  const [previewFile, setPreviewFile] = React.useState(null)

  return (
    <>
      <ViewTable alertType="alert-warning" secret={secret} expanded={expanded} toggle={toggle} edit={edit} del={del}>
        <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
        <tr><td><b>Note:</b></td><td><pre style={{ whiteSpace: 'pre-wrap' }}>{secret.note}</pre></td></tr>
        <ViewFiles secret={secret} previewFile={setPreviewFile} />
      </ViewTable>
      <PhotoPreview secret={secret} file={previewFile}/>
    </>
  )
}

export default ViewNote
