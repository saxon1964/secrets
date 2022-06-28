import * as React from 'react'
import * as Utils from '../misc/utils.js'
import { useToken, useMasterPass } from './hooks/usePersistentValue.js'
import axios from "axios"
import Spinner from "./Spinner.js"

const SAVE_FILE_URL = 'saveFile.php'
const GET_FILES_URL = 'getFiles.php'
const DELETE_FILE_URL = 'deleteFile.php'

const EditFiles = ({id}) => {
  const [masterPass] = useMasterPass('')
  const [token] = useToken('')
  const [files, setFiles] = React.useState([])
  const [busy, setBusy] = React.useState(false)
  const [reload, setReload] = React.useState(true)
  const [previewFile, setPreviewFile] = React.useState(null)
  const uploadRef = React.createRef();

  React.useEffect(() => {
    if (id > 0 && reload) {
      setBusy(true)
      axios.get(Utils.getScriptUrl(GET_FILES_URL), {
        headers: Utils.getAuthorizationHeader(token),
        params: {id}
      }).then(result => {
        const newFiles = result.data.map(newFile => {
          const decryptedFile = JSON.parse(Utils.decrypt(masterPass, newFile.file))
          return { ...newFile, file: decryptedFile }
        })
        setFiles(newFiles)
      }).catch(error => {
        Utils.reportError("Error while loading files: " + error)
      }).finally(() => {
        setReload(false)
        setBusy(false)
      })
    }
  }, [reload])

  const uploadFile = (e) => {
    e.preventDefault()
    const picker = uploadRef.current
    if (picker.files.length == 0) {
      return
    }
    const file = picker.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const newFile = {
        name: file.name,
        size: file.size,
        content: event.target.result
      }
      // We have the file, store it to the database
      let data = new FormData()
      data.append('id', id)
      data.append('file', Utils.encrypt(masterPass, JSON.stringify(newFile)))
      axios.post(Utils.getScriptUrl(SAVE_FILE_URL), data, {
        headers: Utils.getAuthorizationHeader(token)
      }).then(result => {
        picker.value = ''
        if (result.data.status == 0) {
          setReload(true)
        }
        else {
          throw Error("File upload failed")
        }
      }).catch(error => {
        Utils.reportError("Error while saving file: " + error)
      }).finally(() => {
        setBusy(false)
      })
    })
    setBusy(true)
    reader.readAsDataURL(file)
  }

  const deleteFile = (file) => {
    Utils.confirmAction('Delete file', `Are you sure that you want to delete file '${file.file.name}'?`).then(result => {
      if (result.isConfirmed) {
        setBusy(true)
        let data = new FormData()
        data.append('id', id)
        data.append('fileId', file.id)
        axios.post(Utils.getScriptUrl(DELETE_FILE_URL), data, {
          headers: Utils.getAuthorizationHeader(token)
        }).then(result => {
          if (result.data.status == 0) {
            setReload(true)
          }
          else {
            throw Error("File delete failed")
          }
        }).catch(error => {
          Utils.reportError("Error while deleting file: " + error)
        }).finally(() => {
          setBusy(false)
        })
      }
    })
  }

  const handlePreviewFile = (file) => {
    setPreviewFile(file)
  }

  return (
    <>
      {id == 0 && <p>You will be able to attach files after you save your secret for the first time.</p>}
      {id > 0 && (
        <>
          <label htmlFor='fileSelector'>Upload file:</label>
          <input ref={uploadRef} type="file" id="fileSelector" className="form-control mb-2"/>
          <button type="button" className="btn btn-sm btn-primary me-2 mb-2" onClick={uploadFile}>Upload</button>
          {busy && <Spinner/>}
          {files.length > 0 && (
            <>
              <table className="table table-striped" style={{ width: 'auto' }}>
                <thead>
                  <tr>
                    <th>Actions</th>
                    <th>Attachment</th>
                    <th>Bytes</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id}>
                      <td>
                        <a href={file.file.content} target="_self" download={file.file.name} title="download">
                          <i className="fa-solid fa-download" />
                        </a>
                        &nbsp;&nbsp;
                        <a className="text-danger" onClick={() => deleteFile(file)} title="delete">
                          <i className="fa-solid fa-circle-minus" />
                        </a>
                      </td>
                      <td>
                        {file.file.content.startsWith('data:image/') ? (
                          <a href="" onClick={() => handlePreviewFile(file)} style={{ textDecoration: 'none' }}
                            data-bs-toggle="modal" data-bs-target="#imagePreview" title="Preview">
                            <span className="text-primary">{file.file.name}</span>
                          </a>
                        ) : (
                            file.file.name
                        )}                        
                      </td>
                      <td>{Utils.numberFormat(file.file.size)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="modal fade" id="imagePreview" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ textAlign: 'center'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {previewFile && previewFile.file.name}
                      </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      {previewFile && <img style={{maxHeight: 'calc(100vh - 175px)', maxWidth: '100%'}} src={previewFile.file.content}/>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default EditFiles
