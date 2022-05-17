import * as React from 'react'
import * as Utils from '../misc/utils.js'

const ViewPass = ({secret}) => {
  console.log(secret.id)
  const [expanded, setExpanded] = React.useState(false)

  const toggle = () => setExpanded(!expanded)

  return (
    <div className="col-lg-6">
      <div className="alert alert-primary">
        <h5>
          <button className="btn btn-sm btn-primary" onClick={toggle}>
            {expanded? <i className="fas fa-arrow-down"/>: <i className="fas fa-arrow-right"/>}
          </button>&nbsp;&nbsp;
          {secret.name}
        </h5>
      </div>
    </div>
  )
}

export default ViewPass
