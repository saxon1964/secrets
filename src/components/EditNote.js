import * as React from 'react'
import * as Utils from '../misc/utils.js'
import NameField from './NameField.js'
import Mandatory from './Mandatory.js'

const NO_FILE = { name: '', size: '', content: '' }

const EditNote = ({id, data, submitData}) => {
  const [name, setName] = React.useState(data.name || '')
  const [note, setNote] = React.useState(data.note || '')
  const [existingFile, setExistingFile] = React.useState(data.file || NO_FILE)
  const [selectedFile, setSelectedFile] = React.useState(NO_FILE)
  const [removeFile, setRemoveFile] = React.useState(false)

  const checkForm = (e) => {
    e.preventDefault()
    if(name.length == 0) {
      Utils.reportError('Name must be specified')
    }
    else if(note.length == 0) {
      Utils.reportError('Note must be specified')
    }
    else {
      const newData = {
        type: data.type,
        name: name,
        note: note,
        file: existingFile
      }
      if (removeFile && selectedFile.name == '') {
        newData.file = NO_FILE
      }
      else if (selectedFile.name != '') {
        newData.file = selectedFile
      }
      //console.log(newData)
      submitData(id, newData)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files.length == 0) {
      setSelectedFile(NO_FILE)
      return
    }
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        content: event.target.result
      })
    })
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} secret note:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <NameField id={id} name={name} setName={setName}/>
          </div>
          <div className="col-lg-6 mt-2" style={{wordWrap: 'anywhere'}}>
            {existingFile.name == '' && <label htmlFor="fileSelector">Existing file: none</label>}
            {existingFile.name != '' &&
              <span>
                <label htmlFor="fileSelector">Existing file:</label>&nbsp;&nbsp;
                <a href={existingFile.content} title={`${existingFile.size} bytes`} target="_self" download={existingFile.name}>{existingFile.name}</a>
                &nbsp;&nbsp;&nbsp;
                <input className="form-check-input" type="checkbox" id="removeFileCheck" onChange={(e) => setRemoveFile(!removeFile)} checked={removeFile}/>
                &nbsp;
                <label className="form-check-label" htmlFor="removeFileCheck">delete</label>
              </span>
            }
            <input type="file" id="fileSelector" className="form-control" onChange={handleFileSelect} />
          </div>
          <div className="col-lg-6 mt-2">
            <label htmlFor="note">Note:<Mandatory/></label>
            <textarea rows="4" className="form-control" id="note" value={note} onChange={e => setNote(e.target.value)}/>
          </div>
          <div className="col-lg-6 mt-2">

          </div>
          <div className="col-lg-12 mt-2">
            <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => submitData(id, false)}>Cancel</button>
          </div>
        </div>
      </form>
      <hr/>
    </div>
  )
}

export default EditNote
