import * as React from 'react'
import Mandatory from './Mandatory.js'

const NameField = ({id, name, setName}) => {

  const labelRef = React.useRef();
  const nameRef = React.useRef();

  const handleNameChange = (e) => setName(e.target.value)

  React.useEffect(() => {
    if (nameRef.current && labelRef.current) {
      nameRef.current.focus()
      const offsetTop = labelRef.current.offsetTop;
      window.scrollTo({ top: offsetTop, behavior: 'smooth'});
    }
  }, [id]);

  return (
    <>
      <label htmlFor="name" ref={labelRef}>Name:<Mandatory/></label>
      <input type="text" ref={nameRef} value={name} id="name" className="form-control" onChange={handleNameChange}/>
    </>
  )
}

export default NameField
