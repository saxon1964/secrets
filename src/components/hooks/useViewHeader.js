import * as React from 'react'

const useViewHeader = (secret, secretAction) => {
  const [expanded, setExpanded] = React.useState(false)
  const toggle = React.useCallback(() => {
    setExpanded(!expanded)
    secretAction(0) // PING
  })
  const edit = React.useCallback(() => secretAction(secret.id)) // Edit
  const del = React.useCallback(() => secretAction(-secret.id)) // Delete
  return [expanded, toggle, edit, del]
}

export default useViewHeader;
