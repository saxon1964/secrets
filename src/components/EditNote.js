import * as React from 'react'
import * as Utils from '../misc/utils.js'
import NameField from './NameField.js'
import Mandatory from './Mandatory.js'
import EditFiles from './EditFiles.js'

const EditNote = ({id, data, submitData}) => {
  const [name, setName] = React.useState(data.name || '')
  const [note, setNote] = React.useState(data.note || '')

  React.useEffect(() => {
    setName(data.name || '')
    setNote(data.note || '')
  }, [data.name])

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
      }
      submitData(id, newData)
    }
  }

  return (
    <div>
      <hr/>
      <h5>{id == 0? ('New'): ('Edit')} secret note:</h5>
      <form onSubmit={checkForm}>
        <div className="row mb-3">
          <div className="col-lg-6 mt-2">
            <NameField id={id} name={name} setName={setName}/>
            <label htmlFor="note" className="mt-2">Note:<Mandatory/></label>
            <textarea rows="4" className="form-control mb-2" id="note" value={note} onChange={e => setNote(e.target.value)} />
            <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={e => submitData(id, false)}>Cancel</button>
          </div>
          <div className="col-lg-6 mt-2">
            <EditFiles id={id}/>
          </div>
        </div>
      </form>
      <hr/>
    </div>
  )
}

export default EditNote
