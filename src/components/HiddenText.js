import * as React from 'react'
import * as Utils from '../misc/utils.js'

const HiddenText = ({text}) => {
  const [textVisible, setTextVisible] = React.useState(false)
  const textPlaceholder = '••••••••••••••••'

  const toggleText = () => setTextVisible(!textVisible)
  const copyText = () => {
    navigator.clipboard.writeText(text)
    Utils.reportSuccess("Hidden text copied to clipboard")
  }

  return (
    <>
      {textVisible? text: textPlaceholder}
      <button style={{float: 'right'}} className="ms-2 btn btn-sm btn-primary" onClick={copyText}>
        <span className="text-white"><i className="fa-solid fa-clone"></i></span>
      </button>
      <button style={{float: 'right'}} className="ms-2 btn btn-sm btn-primary" onClick={toggleText}>
        {textVisible? <i className="fa-solid fa-eye-slash"/>: <i className="fa-solid fa-eye"/>}
      </button>
    </>
  )
}

export default HiddenText
