import * as React from 'react'
import * as Utils from '../misc/utils.js'
import { useToken, useMasterPass } from './hooks/usePersistentValue.js'
import axios from "axios"
import Spinner from "./Spinner.js"

const SAVE_FILE_URL = 'saveFile.php'
const GET_FILES_URL = 'getFiles.php'

const EditFiles = ({id}) => {
  const [masterPass] = useMasterPass('')
  const [token] = useToken('')
  const [files, setFiles] = React.useState([])
  const [busy, setBusy] = React.useState(false)
  const uploadRef = React.createRef();

  React.useEffect(() => {
    axios.get(Utils.getScriptUrl(GET_FILES_URL), {
      headers: Utils.getAuthorizationHeader(token),
      params: {id}
    }).then(result => {
      console.log(result.data)
    }).catch(error => {
      Utils.reportError("Error while loading files: " + error)
    })
  }, [])

  const uploadFile = (e) => {
    e.preventDefault()
    const picker = uploadRef.current
    if (picker.files.length == 0) {
      return
    }
    const file = picker.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      setBusy(true)
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
        console.log(result.data)
        picker.value = ''
      }).catch(error => {
        Utils.reportError("Error while saving file: " + error)
      }).finally(() => {
        setBusy(false)
      })
    })
    reader.readAsDataURL(file)
  }

  return (
    <>
      <label htmlFor='fileSelector'>Upload file:</label>
      <input ref={uploadRef} type="file" id="fileSelector" className="form-control mb-2"/>
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={uploadFile}>Upload</button>
      {busy && <Spinner/>}
    </>
  )
}

export default EditFiles
