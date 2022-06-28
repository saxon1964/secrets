import * as React from 'react'

const ViewFiles = ({ secret, previewFile }) => {
  const files = secret.files
  const modalId = `#imagePreview-${secret.id}`
  return (
    files.length > 0 && (
      <>
        <tr><td colSpan="2"><h5>Attachments ({files.length})</h5></td></tr>
        {files.map((file) => (
          <tr key={file.id}>
            <td>
              <a href={file.file.content} target="_self" download={file.file.name} title="download">
                <i className="fa-solid fa-download" />
              </a>
            </td>
            <td>
              {file.file.content.startsWith('data:image/') ? (
                <a href="" onClick={() => previewFile(file)} style={{ textDecoration: 'none' }}
                  data-bs-toggle="modal" data-bs-target={modalId} title="Preview">
                  <span className="text-primary">{file.file.name}</span>
                </a>
              ) : (
                file.file.name
              )}
            </td>
          </tr>
        ))}
      </>
    )
  )
}

export default ViewFiles