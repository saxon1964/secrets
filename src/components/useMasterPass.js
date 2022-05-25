import * as React from 'react'

const MASTER_PASS_SESSION_KEY = 'my-secrets-master-pass-key'

const useMasterPass = (init) => {
  const [masterPass, setMasterPass] = React.useState(sessionStorage.getItem(MASTER_PASS_SESSION_KEY) || init)
  const setMasterPassPersistent = (masterPass) => {
    sessionStorage.setItem(MASTER_PASS_SESSION_KEY, masterPass)
    return setMasterPass(masterPass)
  }
  return [masterPass, setMasterPassPersistent]
}

export default useMasterPass
