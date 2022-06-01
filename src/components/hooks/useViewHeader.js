import * as React from 'react'

const useViewHeader = (secret, secretAction) => {
  const [expanded, setExpanded] = React.useState(false)
  const toggle = () => {
    setExpanded(!expanded)
    secretAction(0) // PING
  }
  const edit = () => secretAction(secret.id) // Edit
  const del = () => secretAction(-secret.id) // Delete
  return [expanded, toggle, edit, del]
}

export default useViewHeader;
