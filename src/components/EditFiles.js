import * as React from 'react'
import * as Utils from '../misc/utils.js'
import { useMasterPass } from './hooks/usePersistentValue.js'

const EditFiles = (id) => {
  const [masterPass] = useMasterPass()
  const [files, setFiles] = React.useState([])
  const uploadRef = React.createRef();

  const uploadFile = (e) => {
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

    })
    reader.readAsDataURL(file)
  }

  return (
    <>
      <label htmlFor='fileSelector'>Upload file:</label>
      <input ref={uploadRef} type="file" id="fileSelector" className="form-control mb-2"/>
      <button className="btn btn-sm btn-primary" onClick={uploadFile}>Upload</button>
    </>
  )
}

export default EditFiles
