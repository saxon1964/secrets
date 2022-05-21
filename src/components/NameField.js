import * as React from 'react'
import Mandatory from './Mandatory.js'

const NAME_FIELD_SCROLL_OFFSET = 50

const NameField = ({id, name, setName}) => {

  const nameRef = React.useRef();

  const handleNameChange = (e) => setName(e.target.value)

  React.useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
      var scrollDiv = nameRef.current.offsetTop;
      window.scrollTo({ top: scrollDiv - NAME_FIELD_SCROLL_OFFSET, behavior: 'smooth'});
    }
  }, [id]);

  return (
    <>
      <label htmlFor="name">Name:<Mandatory/></label>
      <input type="text" ref={nameRef} value={name} id="name" className="form-control" onChange={handleNameChange}/>
    </>
  )
}

export default NameField
