import * as React from 'react'
import * as Utils from '../misc/utils.js'
import ViewTable from './ViewTable.js'
import useViewHeader from './hooks/useViewHeader.js'

const ViewNote = ({secret, secretAction}) => {
  const [expanded, toggle, edit, del] = useViewHeader(secret, secretAction)

  const hasFile = secret.file && secret.file.name != ''
  const isImage = hasFile && secret.file.content.startsWith('data:image')

  return (
    <ViewTable alertType="alert-warning" secret={secret} expanded={expanded} toggle={toggle} edit={edit} del={del}>
      <tr><td><b>Type:</b></td><td><b>{secret.type}</b></td></tr>
      <tr><td><b>Note:</b></td><td><pre style={{whiteSpace: 'pre-wrap'}}>{secret.note}</pre></td></tr>
      {hasFile && (
        <tr>
          <td><b>File:</b></td>
          <td style={{wordWrap: 'anywhere'}}>
            <p>
              <a href={secret.file.content} title='Click to download' target="_self"
              download={secret.file.name}>
                {secret.file.name}
              </a>
              &nbsp;({Utils.numberFormat(secret.file.size)} bytes)
            </p>
            {isImage && (
              <img src={secret.file.content} className="rounded" style={{width: '100%'}}/>
            )}
          </td>
        </tr>
      )}
    </ViewTable>
  )
}

export default ViewNote
