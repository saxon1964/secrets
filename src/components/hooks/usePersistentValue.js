import * as React from 'react'

const usePersistentValue = (key, initValue, isSessionStorage) => {
  const storedValue = isSessionStorage? sessionStorage.getItem(key): localStorage.getItem(key)
  const [value, setValue] = React.useState(storedValue || initValue)
  const setPersistentValue = (value) => {
    if(isSessionStorage) {
      sessionStorage.setItem(key, value)
    }
    else {
      localStorage.setItem(key, value)
    }
    return setValue(value)
  }
  return [value, setPersistentValue]
}

const EMAIL_STORAGE_KEY = 'my-secrets-email-key'
const MASTER_PASS_SESSION_KEY = 'my-secrets-master-pass-key'
const TOKEN_STORAGE_KEY = 'my-secrets-token-key'

const useEmail      = (init) => usePersistentValue(EMAIL_STORAGE_KEY, init, false)
const useToken      = (init) => usePersistentValue(TOKEN_STORAGE_KEY, init, false)
const useMasterPass = (init) => usePersistentValue(MASTER_PASS_SESSION_KEY, init, true)

export { useEmail, useToken, useMasterPass }
