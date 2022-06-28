import * as React from 'react'

const PhotoPreview = ({ secret, file }) => {
  const modalId = `imagePreview-${secret.id}`

  return (
    <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{ textAlign: 'center' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {file && file.file.name}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {file && <img style={{ maxHeight: 'calc(100vh - 175px)', maxWidth: '100%' }} src={file.file.content} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoPreview